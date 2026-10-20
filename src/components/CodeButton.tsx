import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

// Opens the secret code screen. Shown next to the skins button, on the
// home screen and after a game over, in every mode.
export default function CodeButton({ onPress, style }: { onPress: () => void; style?: any }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel="Codes secrets" style={[styles.button, style]}>
      <Text style={styles.icon}>?</Text>
      <Text style={styles.text}>CODES</Text>
      <Text style={styles.text}>SECRETS</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    width: 76,
    height: 86, // same as the skins button next to it
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8e44ad",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  icon: { color: "#ffd54f", fontFamily: "retro", fontSize: 26 },
  text: { color: "white", fontFamily: "retro", fontSize: 10 },
});
