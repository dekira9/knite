import introState from "@/state/introState";
import onboardingState from "@/state/onboardingState";
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href={onboardingState.hasCompletedOnboarding ? introState.styleChosen ? "/(tabs)/input/result" : "/(tabs)/input" : "/onboarding"} />;
}

