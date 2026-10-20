import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoinIcon } from "@/components/CoinCounter";
import { SKINS, SkinId } from "@/Skins";
import { buySkin, getWallet, subscribeWallet } from "@/Wallet";

const PREVIEWS: Record<SkinId, number> = {
  pyjama: require("../../assets/images/skins/pyjama.png"),
  toxic: require("../../assets/images/skins/toxic.png"),
  business: require("../../assets/images/skins/business.png"),
  licorne: require("../../assets/images/skins/licorne.png"),
  emo: require("../../assets/images/skins/emo.png"),
  nerd: require("../../assets/images/skins/nerd.png"),
  rich: require("../../assets/images/skins/rich.png"),
};

// Skin shop: pick an unlocked skin, or buy a new one with the coins.
// The retro font has no accents, so texts are written without them.
export default function ShopScreen({ character, setCharacter, onClose }) {
  const [wallet, setWallet] = React.useState(getWallet());
  const [message, setMessage] = React.useState("");
  React.useEffect(() => subscribeWallet(setWallet), []);

  const { width } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const columns = width < 520 ? 2 : width < 900 ? 3 : 4;
  const cardWidth = Math.min(200, (Math.min(width, 900) - 24 - 12 * (columns - 1)) / columns);

  const choose = (id: SkinId, price: number) => {
    if (wallet.unlocked.includes(id)) {
      setCharacter(id);
      setMessage("");
    } else if (buySkin(id)) {
      setCharacter(id);
      setMessage("Nouveau skin debloque !");
    } else {
      setMessage(`Il te manque ${price - wallet.coins} pieces`);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(top, 16), paddingBottom: Math.max(bottom, 12) }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.close} accessibilityLabel="Fermer">
          <Text style={styles.closeText}>X</Text>
        </Pressable>
        <Text style={styles.title}>SKINS</Text>
        <View style={styles.balance}>
          <Text style={styles.balanceText}>{wallet.coins}</Text>
          <CoinIcon />
        </View>
      </View>
      <Text style={styles.message}>{message}</Text>
      <ScrollView contentContainerStyle={styles.grid}>
        {SKINS.map(({ id, name, price }) => {
          const unlocked = wallet.unlocked.includes(id);
          const selected = character === id;
          const affordable = wallet.coins >= price;
          return (
            <Pressable
              key={id}
              onPress={() => choose(id, price)}
              style={[styles.card, { width: cardWidth }, selected && styles.cardSelected]}
            >
              <Image
                source={PREVIEWS[id]}
                style={[styles.preview, { width: cardWidth - 16, height: cardWidth - 16 }, !unlocked && styles.locked]}
              />
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              {selected ? (
                <Text style={[styles.status, styles.selectedText]}>CHOISI</Text>
              ) : unlocked ? (
                <Text style={styles.status}>CHOISIR</Text>
              ) : (
                <View style={styles.price}>
                  <Text style={[styles.status, !affordable && styles.tooExpensive]}>{price}</Text>
                  <CoinIcon size={16} />
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 42, 84, 0.94)",
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },
  close: {
    width: 48,
    height: 48,
    borderWidth: 3,
    borderColor: "#ffffff",
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: { color: "white", fontFamily: "retro", fontSize: 20 },
  title: { color: "white", fontFamily: "retro", fontSize: 28 },
  balance: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceText: { color: "#ffd54f", fontFamily: "retro", fontSize: 20 },
  message: {
    color: "#ffd54f",
    fontFamily: "retro",
    fontSize: 13,
    textAlign: "center",
    minHeight: 30,
    paddingTop: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    alignItems: "center",
    padding: 8,
    backgroundColor: "#4cb8f0",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  cardSelected: { backgroundColor: "#66bb6a", borderColor: "#ffd54f" },
  preview: { resizeMode: "contain" },
  locked: { opacity: 0.45 },
  name: { color: "white", fontFamily: "retro", fontSize: 12, marginTop: 6 },
  status: { color: "white", fontFamily: "retro", fontSize: 14, marginTop: 6 },
  selectedText: { color: "#ffd54f" },
  price: { flexDirection: "row", alignItems: "center", gap: 6 },
  tooExpensive: { color: "#ffcdd2" },
});
