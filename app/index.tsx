import introState from "@/state/introState";
import onboardingState from "@/state/onboardingState";
import { Redirect } from "expo-router";

export default function Index() {
  // Если онбординг не завершен, идем на онбординг
  if (!onboardingState.hasCompletedOnboarding) {
    return <Redirect href="./onboarding" />;
  }

  // В остальных случаях идем на страницу стилей
  return <Redirect href="./(tabs)" />;
}

