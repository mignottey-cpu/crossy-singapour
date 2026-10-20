import { isAvailableAsync } from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Colors from "@/Colors";
import Images from "@/Images";
import ModelLoader from "@/ModelLoader";
import State from "@/state";
import { getTheme, setTheme } from "@/Theme";
import Button from "../Button";

async function shareAsync() {
  await Share.share(
    {
      message: `Check out Bouncy Bacon by @baconbrix`,
      url: "https://crossyroad.expo.app",
      title: "Bouncy Bacon",
    },
    {
      dialogTitle: "Share Bouncy Bacon",
      excludedActivityTypes: [
        "com.apple.UIKit.activity.AirDrop", // This speeds up showing the share sheet by a lot
        "com.apple.UIKit.activity.AddToReadingList", // This is just lame :)
      ],
      tintColor: Colors.blue,
    }
  );
}

export default function Footer({
  style,
  showSettings,
  setGameState,
  navigation,
}) {
  const [canShare, setCanShare] = useState(true);
  const [switching, setSwitching] = useState(false);
  const exam = getTheme() === "exam";

  // Switches between the Singapore and exam looks, then starts a new level.
  // Only the models change, so the gameplay stays exactly the same.
  const toggleMode = async () => {
    if (switching) return;
    setSwitching(true);
    await setTheme(exam ? "singapore" : "exam");
    await ModelLoader.loadModels();
    setGameState(State.Game.none);
  };

  useEffect(() => {
    isAvailableAsync()
      .then(setCanShare)
      .catch(() => {});
  }, []);

  LayoutAnimation.easeInEaseOut();

  return (
    <View style={[styles.container, style]}>
      <Pressable onPress={toggleMode} style={styles.modeButton}>
        <View style={styles.modeInner}>
          <Text style={styles.modeText} numberOfLines={1}>
            {switching ? "..." : exam ? "MODE SG" : "MODE EXAM"}
          </Text>
        </View>
      </Pressable>
      {canShare && (
        <Button
          onPress={shareAsync}
          imageStyle={[styles.button, { marginRight: 4, aspectRatio: 1.9 }]}
          source={Images.button.share}
        />
      )}
      <Button
        onPress={() => {
          setGameState(State.Game.none);
        }}
        imageStyle={[
          styles.button,
          { marginLeft: canShare ? 4 : 0, aspectRatio: 1.9 },
        ]}
        source={Images.button.long_play}
      />
      {/* keeps the play button centred now that the leaderboard is gone */}
      <View style={styles.spacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 4,
    minHeight: 56,
    maxHeight: 56,
    minWidth: "100%",
    maxWidth: "100%",
    flex: 1,
  },
  button: {
    height: 56,
  },
  modeButton: {
    width: 140,
    height: 56,
    borderWidth: 2,
    borderColor: "#173a57",
    backgroundColor: "#ffffff",
    padding: 3,
  },
  modeInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4cb8f0",
  },
  modeText: {
    fontFamily: "retro",
    fontSize: 12,
    color: "white",
    textAlign: "center",
  },
  spacer: {
    width: 140,
  },
});
