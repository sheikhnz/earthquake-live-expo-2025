import { useCallback, useEffect, useRef } from "react";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { AD_UNIT_IDS } from "../config/adUnitIds";

/**
 * Hook that manages an interstitial ad lifecycle.
 * Returns a `show` function that displays the ad if loaded.
 */
export function useInterstitialAd() {
  const adRef = useRef<InterstitialAd | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL);

    const onLoaded = () => {
      isLoadedRef.current = true;
    };

    const onClosed = () => {
      isLoadedRef.current = false;
      ad.load(); // preload the next one
    };

    const unsubLoaded = ad.addAdEventListener(AdEventType.LOADED, onLoaded);
    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, onClosed);

    ad.load();
    adRef.current = ad;

    return () => {
      unsubLoaded();
      unsubClosed();
    };
  }, []);

  const show = useCallback(() => {
    if (isLoadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, []);

  return { show };
}
