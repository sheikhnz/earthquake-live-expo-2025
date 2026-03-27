# Google Play Store Publishing Checklist

> Complete checklist for publishing **Earthquake Live** (Expo + React Native) to the Google Play Store.

---

## 1. Google Play Developer Account

- [ ] Register at [play.google.com/console](https://play.google.com/console) — $25 one-time fee
- [ ] Complete identity verification (takes 1–2 days)

---

## 2. App Configuration (`app.json`)

- [x] `android.package` set — `com.sheikhmohdnazmulhasan.earthquakeliveexpo2025`
- [x] `version` set — `1.0.0`
- [x] Adaptive icons configured (foreground, background, monochrome)
- [x] Play Store icon (`play_store_512.png`) configured
- [ ] Restrict Google Maps API key in [Google Cloud Console](https://console.cloud.google.com/) (limit to package name + SHA-1)
- [ ] Verify only necessary permissions are declared

---

## 3. Google AdMob Setup

### AdMob Console

- [ ] Create an AdMob account at [admob.google.com](https://admob.google.com)
- [ ] Add a new app → link to your Play Store listing (or enter package name manually)
- [ ] Create ad units (Banner, Interstitial, Rewarded, etc.) and note the **Ad Unit IDs**
- [ ] Note your **AdMob App ID** (format: `ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY`)

### Install the Expo AdMob Package

```bash
pnpm add react-native-google-mobile-ads
```

- [ ] Install the package
- [ ] Add the AdMob App ID to `app.json`:

```json
{
  "expo": {
    "android": {
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    }
  }
}
```

- [ ] Create an `app.plugin.js` or use the config plugin for `react-native-google-mobile-ads`
- [ ] Replace test ad unit IDs with production IDs before publishing
- [ ] Implement ad components (Banner, Interstitial, etc.) in your screens
- [ ] Test ads using [AdMob test IDs](https://developers.google.com/admob/android/test-ads) during development

### EU Consent (GDPR)

- [ ] Implement the Google UMP SDK (User Messaging Platform) for EU consent
- [ ] This is **required by Google** if you serve ads to EU users

---

## 4. Privacy Policy (Required)

- [ ] Create a privacy policy — required because the app uses **location** and **ads**
- [ ] Ensure the policy discloses AdMob's data collection (device ID, ad interactions)
- [ ] Host it publicly (GitHub Pages, personal website, etc.)
- [ ] Add the URL in Google Play Console
- [ ] Add `expo.android.privacyPolicyUrl` in `app.json`

---

## 5. EAS Build Setup

- [ ] Login to EAS: `eas login`
- [ ] Verify project link: `eas project:info`

---

## 6. Build Production AAB

```bash
eas build --platform android --profile production
```

- [ ] Run the build command
- [ ] EAS manages keystores automatically (or provide your own)
- [ ] **Backup your keystore** — same keystore is needed for all future updates

---

## 7. Google Play Console — Create App

- [ ] Go to **All Apps → Create App**
- [ ] App name: **Earthquake Live**
- [ ] Select **App** (not Game), **Free**

---

## 8. Store Listing

| Asset              | Spec                     | Status             |
| ------------------ | ------------------------ | ------------------ |
| App icon           | 512×512 PNG              | ✅ Ready           |
| Feature graphic    | 1024×500 PNG             | ❌ Need to create  |
| Phone screenshots  | Min 2, up to 8           | ❌ Need to capture |
| Tablet screenshots | Optional but recommended | ❌ Need to capture |

- [ ] **Short description** — max 80 characters
- [ ] **Full description** — max 4000 characters
- [ ] **App category** — Weather or Tools
- [ ] **Contact email**
- [ ] **Privacy policy URL**

---

## 9. Content Rating

- [ ] Complete the **IARC questionnaire** in Play Console
- [ ] Expected rating: **Everyone**

---

## 10. Target Audience & Content

- [ ] Declare the app is **not directed at children** (under 13)
- [ ] Select target age group

---

## 11. Data Safety Form

- [ ] Declare **location data** collection (approximate/precise)
- [ ] Purpose: App functionality (showing nearby earthquakes)
- [ ] Declare **advertising data** collection via Google AdMob
  - Device identifiers (Advertising ID)
  - Ad interaction data
  - Purpose: Advertising / monetization
- [ ] Declare third-party data sharing: USGS API, Google AdMob
- [ ] Declare: ads are shown, data is shared with ad networks

---

## 12. App Signing

- [ ] Opt into **Google Play App Signing** (recommended, EAS default)
- [ ] Upload the upload key certificate if using a custom keystore

---

## 13. Testing & Release

### Recommended rollout path:

1. [ ] **Internal testing** — upload AAB, add testers by email
2. [ ] **Closed/Open testing** — optional but recommended
3. [ ] **Production release**

### Submit via EAS (optional shortcut):

```bash
eas submit --platform android --profile production
```

---

## 14. Final Review & Launch

- [ ] Fix any **pre-launch report** issues from Play Console automated tests
- [ ] Review for **policy compliance** warnings
- [ ] Set rollout percentage (start with 20% or go 100%)
- [ ] Click **Start Rollout to Production**
- [ ] First review typically takes **1–3 business days**

---

## Quick Commands

```bash
# Login
eas login

# Build production AAB
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android --profile production
```
