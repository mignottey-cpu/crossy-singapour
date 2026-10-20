import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getWallet, subscribeWallet } from "@/Wallet";

const textShadow = Platform.select({
  web: { textShadow: "-2px 0 0 #000, 2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000" },
  default: {},
});

// Number of coins the player owns, kept up to date.
export function useCoins() {
  const [coins, setCoins] = React.useState(getWallet().coins);
  React.useEffect(() => subscribeWallet((wallet) => setCoins(wallet.coins)), []);
  return coins;
}

export function CoinIcon({ size = 22 }) {
  return (
    <View style={[styles.icon, { width: size, height: size, borderRadius: size / 2 }]}>
      <View style={[styles.iconInner, { borderRadius: size / 2 }]} />
    </View>
  );
}

// Coin balance shown in the top right corner, like in Crossy Road.
export default function CoinCounter() {
  const coins = useCoins();
  const { top, right } = useSafeAreaInsets();
  return (
    <View
      pointerEvents="none"
      style={[styles.container, { top: Math.max(top, 16), right: Math.max(right, 12) }]}
    >
      <Text style={[styles.text, textShadow]}>{coins}</Text>
      <CoinIcon />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  text: {
    color: "#ffd54f",
    fontFamily: "retro",
    fontSize: 24,
  },
  icon: {
    backgroundColor: "#f2c94c",
    borderWidth: 2,
    borderColor: "#1a1a1a",
    padding: 3,
  },
  iconInner: {
    flex: 1,
    backgroundColor: "#e0a92a",
  },
});
