import { Alert, Linking, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import i18n from '@/utils/translations';
import { track } from '@/utils/analytics';

export const APP_PACKAGE_ID = 'com.ilyadylko.knitapp';
export const SOFT_UPDATE_PROMPT_KEY = 'softUpdatePromptAt';
/** Show the soft update hint at most once every 3 days. */
export const SOFT_UPDATE_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000;

const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${APP_PACKAGE_ID}`;

export type StoreVersionInfo = {
  version: string;
  storeUrl: string;
};

/** Compare dotted versions like 1.0.4. Returns -1 / 0 / 1. */
export function compareVersions(a: string, b: string): number {
  const parse = (value: string) =>
    value
      .split('.')
      .map((part) => {
        const match = part.match(/^\d+/);
        return match ? Number(match[0]) : 0;
      });

  const left = parse(a);
  const right = parse(b);
  const length = Math.max(left.length, right.length);

  for (let i = 0; i < length; i += 1) {
    const l = left[i] ?? 0;
    const r = right[i] ?? 0;
    if (l < r) return -1;
    if (l > r) return 1;
  }
  return 0;
}

export function getInstalledVersion(): string | null {
  const version =
    Constants.nativeAppVersion ??
    Constants.expoConfig?.version ??
    null;
  return version && String(version).trim() ? String(version).trim() : null;
}

export function isSnoozeActive(
  lastPromptAt: number | null,
  now = Date.now(),
  snoozeMs = SOFT_UPDATE_SNOOZE_MS,
): boolean {
  if (lastPromptAt == null || !Number.isFinite(lastPromptAt)) {
    return false;
  }
  return now - lastPromptAt < snoozeMs;
}

export async function readLastUpdatePromptAt(): Promise<number | null> {
  try {
    const raw = await AsyncStorage.getItem(SOFT_UPDATE_PROMPT_KEY);
    if (!raw) {
      return null;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : null;
  } catch {
    return null;
  }
}

export async function markUpdatePromptShown(now = Date.now()): Promise<void> {
  try {
    await AsyncStorage.setItem(SOFT_UPDATE_PROMPT_KEY, String(now));
  } catch (error) {
    console.error('Failed to save update prompt snooze:', error);
  }
}

function extractAndroidVersion(html: string): string | null {
  const patterns = [
    /\[\[\["([\d]+\.[\d]+(?:\.[\d]+)*)"\]\]/,
    /"softwareVersion"\s*:\s*"([\d]+\.[\d]+(?:\.[\d]+)*)"/,
    /Current Version<\/div><span[^>]*><span[^>]*>([\d]+\.[\d]+(?:\.[\d]+)*)<\/span>/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

async function fetchLatestIosVersion(): Promise<StoreVersionInfo | null> {
  const response = await fetch(
    `https://itunes.apple.com/lookup?bundleId=${APP_PACKAGE_ID}&t=${Date.now()}`,
  );
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as {
    resultCount?: number;
    results?: Array<{
      version?: string;
      trackViewUrl?: string;
      trackId?: number;
    }>;
  };
  const app = data.results?.[0];
  if (!app?.version) {
    return null;
  }
  const storeUrl =
    app.trackViewUrl ??
    (app.trackId ? `https://apps.apple.com/app/id${app.trackId}` : null);
  if (!storeUrl) {
    return null;
  }
  return {
    version: app.version,
    storeUrl,
  };
}

async function fetchLatestAndroidVersion(): Promise<StoreVersionInfo | null> {
  const response = await fetch(
    `${ANDROID_STORE_URL}&hl=en&gl=US`,
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
      },
    },
  );
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const version = extractAndroidVersion(html);
  if (!version) {
    return null;
  }
  return { version, storeUrl: ANDROID_STORE_URL };
}

export async function fetchLatestStoreVersion(
  platform: typeof Platform.OS = Platform.OS,
): Promise<StoreVersionInfo | null> {
  try {
    if (platform === 'ios') {
      return await fetchLatestIosVersion();
    }
    if (platform === 'android') {
      return await fetchLatestAndroidVersion();
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch store version:', error);
    return null;
  }
}

async function openStoreUrl(storeUrl: string): Promise<void> {
  try {
    const canOpen = await Linking.canOpenURL(storeUrl);
    if (canOpen) {
      await Linking.openURL(storeUrl);
      return;
    }
  } catch {
    // fall through
  }
  if (Platform.OS === 'android') {
    await Linking.openURL(ANDROID_STORE_URL);
  }
}

/**
 * Soft, dismissible update hint. No-op when offline, snoozed, or already current.
 */
export async function maybePromptSoftUpdate(): Promise<boolean> {
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
    return false;
  }

  const installed = getInstalledVersion();
  if (!installed) {
    return false;
  }

  const lastPromptAt = await readLastUpdatePromptAt();
  if (isSnoozeActive(lastPromptAt)) {
    return false;
  }

  const latest = await fetchLatestStoreVersion();
  if (!latest || compareVersions(installed, latest.version) >= 0) {
    return false;
  }

  await markUpdatePromptShown();
  track('update_prompt_shown', {
    installed_version: installed,
    store_version: latest.version,
  });

  return await new Promise((resolve) => {
    Alert.alert(
      i18n.t('updateAvailableTitle'),
      i18n.t('updateAvailableMessage'),
      [
        {
          text: i18n.t('updateAvailableLater'),
          style: 'cancel',
          onPress: () => {
            track('update_prompt_dismissed', {
              installed_version: installed,
              store_version: latest.version,
            });
            resolve(true);
          },
        },
        {
          text: i18n.t('updateAvailableAction'),
          onPress: () => {
            track('update_prompt_opened_store', {
              installed_version: installed,
              store_version: latest.version,
            });
            void openStoreUrl(latest.storeUrl);
            resolve(true);
          },
        },
      ],
      { cancelable: true, onDismiss: () => resolve(true) },
    );
  });
}
