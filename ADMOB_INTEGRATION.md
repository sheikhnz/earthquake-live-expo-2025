# Google AdMob Integration Guide

> Complete guide and implementation plan for integrating Google AdMob ads into **Earthquake Live** using `react-native-google-mobile-ads` with Expo + EAS Build.

---

## Prerequisites

- [x] Expo project with `expo-dev-client` (already installed)
- [x] EAS Build configured (`eas.json` exists)
- [ ] Google AdMob account — [admob.google.com](https://admob.google.com)

> **⚠️ Important:** AdMob does **not** work with Expo Go. You must use a development build via EAS.

---

## Step 1: Create AdMob Account & Ad Units

1. Sign in at [admob.google.com](https://admob.google.com)
2. Go to **Apps → Add App**
3. Select **Android** → enter package name: `com.sheikhmohdnazmulhasan.earthquakeliveexpo2025`
4. Copy your **App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)
5. Go to **Ad Units → Add Ad Unit** and create the following:

| Ad Type          | When to Show             | Recommended Placement           |
| ---------------- | ------------------------ | ------------------------------- |
| **Banner**       | Always visible           | Bottom of `EarthquakeMapScreen` |
| **Interstitial** | Between actions          | On country change or app resume |
| **Rewarded**     | Optional, user-initiated | "Remove ads for 1 hour" button  |

6. Copy each **Ad Unit ID** for use in step 3

---

## Step 2: Install the Package

```bash
npx expo install react-native-google-mobile-ads
```

This installs the library and its Expo config plugin.

---

## Step 3: Configure `app.json`

Add the config plugin **and** your AdMob App IDs at the **root level** of `app.json`:

```jsonc
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
        },
      ],
    ],
    // ... rest of your expo config
  },

  // ⬇️ This goes OUTSIDE the "expo" key, at root level
  "react-native-google-mobile-ads": {
    "android_app_id": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
    "ios_app_id": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
  },
}
```

> **⚠️ Replace** all `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY` with your real AdMob App ID.

---

## Step 4: Initialize the SDK

Create a new file `src/config/ads.ts`:

```typescript
import mobileAds from "react-native-google-mobile-ads";

/**
 * Initialize the Google Mobile Ads SDK.
 * Call this once at app startup before rendering any ads.
 */
export async function initializeAds(): Promise<void> {
  await mobileAds().initialize();
}
```

Then call it in your `App.tsx` inside a `useEffect`:

```typescript
import { useEffect } from "react";
import { initializeAds } from "./src/config/ads";

const App = (): ReactElement => {
  useEffect(() => {
    initializeAds();
  }, []);

  // ... rest of your app
};
```

---

## Step 5: Create Ad Unit ID Constants

Create `src/config/adUnitIds.ts`:

```typescript
import { TestIds } from "react-native-google-mobile-ads";

const IS_DEV = __DEV__;

export const AD_UNIT_IDS = {
  BANNER: IS_DEV ? TestIds.BANNER : "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // your real banner ID

  INTERSTITIAL: IS_DEV
    ? TestIds.INTERSTITIAL
    : "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // your real interstitial ID

  REWARDED: IS_DEV
    ? TestIds.REWARDED
    : "ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY", // your real rewarded ID
} as const;
```

> **⚠️ Always use `TestIds` during development** to avoid getting your AdMob account banned.

---

## Step 6: Implement Banner Ad Component

Create `src/components/BannerAdView.tsx`:

```tsx
import React, { type ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AD_UNIT_IDS } from "../config/adUnitIds";

export const BannerAdView = (): ReactElement => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          networkExtras: {
            collapsible: "bottom",
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
});
```

### Add to `EarthquakeMapScreen.tsx`

Place the banner between the map and the list:

```tsx
import { BannerAdView } from "../components/BannerAdView";

// Inside the return, after the map container and before the list:
<View style={styles.mapContainer}>
  <MapView ... />
</View>

<BannerAdView />

<View style={styles.listContainer}>
  ...
</View>
```

---

## Step 7: Implement Interstitial Ad (Optional)

Create `src/hooks/useInterstitialAd.ts`:

```typescript
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
```

### Usage in `EarthquakeMapScreen.tsx`

Show an interstitial when the user changes country:

```typescript
import { useInterstitialAd } from "../hooks/useInterstitialAd";

const { show: showInterstitial } = useInterstitialAd();

const handleCountrySelected = useCallback(
  (country: CountryOption) => {
    setManualCountry(country);
    setIsSelectingCountry(false);
    showInterstitial(); // show ad on country change
    // ... rest of handler
  },
  [mapDefaultZoomDelta, showInterstitial],
);
```

---

## Step 8: Implement Rewarded Ad (Optional)

Create `src/hooks/useRewardedAd.ts`:

```typescript
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
```

---

## Step 9: Build & Test

### Development Build

```bash
# Create a development build with ads support
eas build --platform android --profile development
```

> You **must** use a dev build — AdMob requires native modules that Expo Go doesn't support.

### Testing Checklist

- [ ] SDK initializes without crash
- [ ] Banner ad appears at the bottom of the map screen
- [ ] Test banner shows "Test Ad" label
- [ ] Interstitial loads and shows on country change (if implemented)
- [ ] Rewarded ad loads and grants reward (if implemented)
- [ ] App doesn't crash when ads fail to load (poor network)

### Production Build

```bash
eas build --platform android --profile production
```

---

## Step 10: Pre-Launch Checklist

Before submitting to the Play Store:

- [ ] Replace **all** `TestIds` with real Ad Unit IDs in `adUnitIds.ts`
- [ ] Verify `app.json` has the **real** AdMob App ID (not test)
- [ ] In Google Play Console → **App Content → Ads**: select **"Yes, my app contains ads"**
- [ ] Update **Data Safety Form** to declare advertising data collection
- [ ] Update **privacy policy** to mention AdMob (already done in `privacy-policy.html`)
- [ ] Test with a real device to verify production ads appear

---

## File Structure After Integration

```
src/
├── config/
│   ├── ads.ts                 # SDK initialization
│   ├── adUnitIds.ts           # Ad unit ID constants
│   └── appConfig.ts           # existing
├── components/
│   ├── BannerAdView.tsx       # Banner ad component
│   ├── EarthquakeList.tsx     # existing
│   └── CountrySelector.tsx    # existing
├── hooks/
│   ├── useInterstitialAd.ts   # Interstitial ad hook
│   ├── useRewardedAd.ts       # Rewarded ad hook
│   └── useEarthquakesPolling.ts # existing
└── screens/
    └── EarthquakeMapScreen.tsx # updated with ads
```

---

## Quick Reference: Test Ad Unit IDs

These are Google's official test IDs (safe to use during development):

| Type         | Test ID                                  |
| ------------ | ---------------------------------------- |
| Banner       | `ca-app-pub-3940256099942544/9214589741` |
| Interstitial | `ca-app-pub-3940256099942544/1033173712` |
| Rewarded     | `ca-app-pub-3940256099942544/5224354917` |
| App Open     | `ca-app-pub-3940256099942544/9257395921` |

Or simply use the `TestIds` import from `react-native-google-mobile-ads`.

---

## Troubleshooting

| Issue                 | Solution                                                                  |
| --------------------- | ------------------------------------------------------------------------- |
| App crashes on launch | Double-check your AdMob App ID in `app.json` — an invalid ID causes crash |
| Ads not showing       | Make sure SDK is initialized before rendering ad components               |
| "No fill" errors      | Normal during testing; use `TestIds` to guarantee test ads appear         |
| Build fails           | Run `npx expo prebuild --clean` then rebuild with EAS                     |
| Expo Go error         | AdMob doesn't work in Expo Go — use `eas build --profile development`     |

---

## Resources

- [react-native-google-mobile-ads docs](https://docs.page/invertase/react-native-google-mobile-ads)
- [Google AdMob Console](https://admob.google.com)
- [AdMob Test Ads Guide](https://developers.google.com/admob/android/test-ads)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
