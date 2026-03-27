import { useCallback, useEffect, useRef } from "react";
import {
  RewardedAd,
  RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { AD_UNIT_IDS } from "../config/adUnitIds";

/**
 * Hook that manages a rewarded ad lifecycle.
 * Returns `show` to display the ad and calls `onReward` when earned.
 */
export function useRewardedAd(onReward: () => void) {
  const adRef = useRef<RewardedAd | null>(null);
  const isLoadedRef = useRef(false);

  useEffect(() => {
    const ad = RewardedAd.createForAdRequest(AD_UNIT_IDS.REWARDED);

    const unsubLoaded = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        isLoadedRef.current = true;
      },
    );

    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        onReward();
        isLoadedRef.current = false;
        ad.load();
      },
    );

    ad.load();
    adRef.current = ad;

    return () => {
      unsubLoaded();
      unsubEarned();
    };
  }, [onReward]);

  const show = useCallback(() => {
    if (isLoadedRef.current && adRef.current) {
      adRef.current.show();
    }
  }, []);

  return { show };
}
