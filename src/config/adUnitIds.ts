import { TestIds } from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

export const AD_UNIT_IDS = {
  BANNER: IS_DEV
    ? TestIds.BANNER
    : process.env.EXPO_PUBLIC_ADMOB_BANNER_ID || "",

  INTERSTITIAL: IS_DEV
    ? TestIds.INTERSTITIAL
    : process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ID || "",

  REWARDED: IS_DEV
    ? TestIds.REWARDED
    : process.env.EXPO_PUBLIC_ADMOB_REWARDED_ID || "",
} as const;
