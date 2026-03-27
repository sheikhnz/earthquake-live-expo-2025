import React, { useState, type ReactElement } from "react";
import { StyleSheet, View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AD_UNIT_IDS } from "../config/adUnitIds";

export const BannerAdView = (): ReactElement | null => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null;
  }

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
        onAdFailedToLoad={() => {
          setHasError(true);
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
