import mobileAds from "react-native-google-mobile-ads";

/**
 * Initialize the Google Mobile Ads SDK.
 * Call this once at app startup before rendering any ads.
 */
export async function initializeAds(): Promise<void> {
  await mobileAds().initialize();
}
