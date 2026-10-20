import React from "react";
import { Image, Pressable, StyleSheet, Text } from "react-native";

import GameContext from "@/context/GameContext";
import { SkinId } from "@/Skins";

export const SKIN_PREVIEWS: Record<SkinId, number> = {
  pyjama: require("../../assets/images/skins/pyjama.png"),
  toxic: require("../../assets/images/skins/toxic.png"),
  business: require("../../assets/images/skins/business.png"),
  licorne: require("../../assets/images/skins/licorne.png"),
  emo: require("../../assets/images/skins/emo.png"),
  nerd: require("../../assets/images/skins/nerd.png"),
  rich: require("../../assets/images/skins/rich.png"),
  secret: require("../../assets/images/skins/secret.png"),
};

// Opens the skin shop; shows the skin currently worn. Same button in every
// mode (Singapore, exam, haze), on the home screen and after a game over.
export default function SkinButton({ onPress, style }: { onPress: () => void; style?: any }) {
  const { character } = React.useContext(GameContext);
  return (
    <Pressable onPress={onPress} accessibilityLabel="Skins" style={[styles.button, style]}>
      <Image source={SKIN_PREVIEWS[character] ?? SKIN_PREVIEWS.pyjama} style={styles.preview} />
      <Text style={styles.text}>SKINS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 76,
    alignItems: "center",
    paddingVertical: 4,
    backgroundColor: "#4cb8f0",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  preview: { width: 56, height: 56, resizeMode: "contain" },
  text: { color: "white", fontFamily: "retro", fontSize: 12 },
});
