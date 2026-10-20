import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CoinIcon, useCoins } from "@/components/CoinCounter";
import GameContext from "@/context/GameContext";
import { redeemCode } from "@/SecretCodes";

// Secret code screen: type a word, get a bonus. The codes themselves are
// never shown. The retro font has no accents, so texts are written without them.
export default function CodeScreen({ onClose }) {
  const { setCharacter } = React.useContext(GameContext) as { setCharacter: (id: string) => void };
  const coins = useCoins();
  const [code, setCode] = React.useState("");
  const [message, setMessage] = React.useState({ text: "", good: false });
  const { top } = useSafeAreaInsets();

  const submit = () => {
    if (!code.trim()) return;
    const result = redeemCode(code);
    if ("coins" in result) {
      setMessage({ text: `Bravo ! ${result.coins} pieces gagnees`, good: true });
    } else if ("skin" in result) {
      setCharacter(result.skin.id);
      setMessage({ text: `Bravo ! Skin ${result.skin.name} debloque`, good: true });
    } else {
      setMessage({
        text: {
          invalid: "Code invalide",
          used: "Code deja utilise",
          allSkins: "Tu as deja tous les skins",
        }[result.reason],
        good: false,
      });
    }
    setCode("");
  };

  return (
    <View style={[styles.container, { paddingTop: Math.max(top, 16) }]}>
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.close} accessibilityLabel="Fermer">
          <Text style={styles.closeText}>X</Text>
        </Pressable>
        <View style={styles.balance}>
          <Text style={styles.balanceText}>{coins}</Text>
          <CoinIcon />
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>CODES SECRETS</Text>
        <Text style={styles.hint}>Entre un code pour gagner un bonus</Text>
        <TextInput
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setMessage({ text: "", good: false });
          }}
          onSubmitEditing={submit}
          placeholder="CODE"
          placeholderTextColor="#90a4c8"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          spellCheck={false}
          maxLength={24}
          autoFocus
          returnKeyType="done"
          accessibilityLabel="Code secret"
          style={styles.input}
        />
        <Pressable onPress={submit} style={styles.validate} accessibilityLabel="Valider">
          <Text style={styles.validateText}>VALIDER</Text>
        </Pressable>
        <Text style={[styles.message, { color: message.good ? "#a5d6a7" : "#ffcdd2" }]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(16, 42, 84, 0.94)",
    paddingHorizontal: 16,
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
  balance: { flexDirection: "row", alignItems: "center", gap: 6 },
  balanceText: { color: "#ffd54f", fontFamily: "retro", fontSize: 20 },
  body: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    alignItems: "stretch",
    marginTop: 40,
    gap: 16,
  },
  title: { color: "white", fontFamily: "retro", fontSize: 26, textAlign: "center" },
  hint: { color: "#bbdefb", fontFamily: "retro", fontSize: 12, textAlign: "center" },
  input: {
    // 18 px or more so iPhones do not zoom in on the field
    fontSize: 22,
    fontFamily: "retro",
    color: "white",
    textAlign: "center",
    paddingVertical: 12,
    backgroundColor: "#0d2347",
    borderWidth: 3,
    borderColor: "#ffffff",
    outlineStyle: "none",
  } as any,
  validate: {
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#66bb6a",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  validateText: { color: "white", fontFamily: "retro", fontSize: 18 },
  message: { fontFamily: "retro", fontSize: 14, textAlign: "center", minHeight: 20 },
});
