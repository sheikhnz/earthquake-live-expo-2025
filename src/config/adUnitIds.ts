import { TestIds } from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

export const AD_UNIT_IDS = {
  BANNER: IS_DEV ? TestIds.BANNER : "ca-app-pub-4918601710187091/YYYYYYYYYY", // your real banner ID

  INTERSTITIAL: IS_DEV
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-4918601710187091/YYYYYYYYYY", // your real interstitial ID

  REWARDED: IS_DEV
    ? TestIds.REWARDED
    : "ca-app-pub-4918601710187091/YYYYYYYYYY", // your real rewarded ID
} as const;
