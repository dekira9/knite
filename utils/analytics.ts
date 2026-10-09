type EventProps = Record<string, string | number | boolean>;

type IdentifyEvent = {
  set: (key: string, value: string | number | boolean) => void;
};

type AmplitudeApi = {
  Identify: new () => IdentifyEvent;
  identify: (event: IdentifyEvent) => void;
  init: (
    apiKey: string,
    userId?: string,
    options?: { autocapture?: false },
  ) => void;
  track: (event: string, properties?: EventProps) => void;
};

const apiKey = process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY;

let started = false;
let amplitudeApi: AmplitudeApi | null = null;

function amplitude(): AmplitudeApi | null {
  if (!apiKey) {
    return null;
  }
  if (!amplitudeApi) {
    amplitudeApi = require('@amplitude/analytics-react-native') as AmplitudeApi;
  }
  return amplitudeApi;
}

export function initAnalytics() {
  const api = amplitude();
  if (!api || started || !apiKey) {
    return;
  }
  started = true;
  try {
    api.init(apiKey, undefined, { autocapture: false });
  } catch (error) {
    started = false;
    console.error('Amplitude init failed:', error);
  }
}

export function setAnalyticsUserProperties(
  properties: Record<string, string | number | boolean>,
) {
  const api = amplitude();
  if (!api) {
    return;
  }
  const identifyEvent = new api.Identify();
  for (const [key, value] of Object.entries(properties)) {
    identifyEvent.set(key, value);
  }
  try {
    api.identify(identifyEvent);
  } catch (error) {
    console.error('Amplitude identify failed:', error);
  }
}

export function track(event: string, properties?: EventProps) {
  const api = amplitude();
  if (!api) {
    return;
  }
  try {
    api.track(event, properties);
  } catch (error) {
    console.error('Amplitude track failed:', error);
  }
}

export function trackMeasurementStep(step: string, properties?: EventProps) {
  track('measurement_step_completed', { step, ...properties });
}

export function trackKnittingProgressSaved(chartId: string, row: number) {
  const chart = chartId.startsWith('ribbing')
    ? 'ribbing'
    : chartId.startsWith('back')
      ? 'back'
      : chartId.startsWith('front')
        ? 'front'
        : chartId.startsWith('sleeve')
          ? 'sleeve'
          : chartId;
  track('knitting_progress_saved', { chart, row });
}
