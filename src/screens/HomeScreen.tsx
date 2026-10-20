import React from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Hand from "@/components/HandCTA";
import Footer from "@/components/Home/Footer";
import SkinButton from "@/components/SkinButton";

let hasShownTitle = false;

function Screen(props) {
  const animation = new Animated.Value(0);

  // Starts the game once, after the title slides away.
  const starting = React.useRef(false);
  const play = () => {
    if (starting.current) return;
    starting.current = true;
    Animated.timing(animation, {
      toValue: 0,
      duration: 400,
      useNativeDriver: process.env.EXPO_OS !== "web",
      easing: Easing.in(Easing.cubic),
    }).start(() => props.onPlay());
  };

  React.useEffect(() => {
    function onKeyUp({ keyCode }) {
      // Space, up-arrow
      if ([32, 38].includes(keyCode)) {
        play();
      }
    }

    window.addEventListener("keyup", onKeyUp, false);
    return () => {
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (!hasShownTitle) {
      hasShownTitle = true;

      Animated.timing(animation, {
        useNativeDriver: process.env.EXPO_OS !== "web",
        toValue: 1,
        duration: 800,
        delay: 0,
      }).start();
    }
  }, []);

  const { top, bottom, left, right } = useSafeAreaInsets();

  const animatedTitleStyle = {
    transform: [
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-Dimensions.get("window").width, 0],
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
  };
  // console.log(props);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: top,
          paddingBottom: bottom,
          paddingLeft: left,
          paddingRight: right,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1.0}
        style={[
          StyleSheet.absoluteFill,
          { justifyContent: "center", alignItems: "center" },
        ]}
        // start on touch down, or on release if the touch down was missed
        onPressIn={play}
        onPress={play}
      >
        <Text style={styles.coins}>{props.coins}</Text>
        <Animated.Image
          source={require("../../assets/images/title.png")}
          style={[styles.title, animatedTitleStyle]}
        />

        <View
          style={{
            justifyContent: "center",
            alignItems: "stretch",
            position: "absolute",
            bottom: Math.max(bottom, 8),
            left: Math.max(left, 8),
            right: Math.max(right, 8),
          }}
        >
          <View style={{ height: 64, marginBottom: 48, alignItems: "center" }}>
            {/* {!__DEV__ && <Hand style={{ width: 36 }} />} */}
          </View>
          {/* <Footer
            onCharacterSelect={() => {
              props.onShowCharacterSelect?.();
            }}
            onShop={() => {}}
            onMultiplayer={() => {}}
            onCamera={() => {}}
          /> */}
        </View>
      </TouchableOpacity>

      {/* Skin shop, top left */}
      <SkinButton onPress={props.onShop} style={{ top: Math.max(top, 16), left: Math.max(left, 12) }} />

      {/* Secret codes, under the skins */}
      <Pressable
        onPress={props.onCodes}
        accessibilityLabel="Codes secrets"
        style={[styles.codeButton, { top: Math.max(top, 16) + 96, left: Math.max(left, 12) }]}
      >
        <Text style={styles.codeIcon}>?</Text>
        <Text style={styles.codeText}>CODES</Text>
        <Text style={styles.codeText}>SECRETS</Text>
      </Pressable>
    </View>
  );
}

export default Screen;

const styles = StyleSheet.create({
  codeButton: {
    position: "absolute",
    width: 76,
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#8e44ad",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  codeIcon: { color: "#ffd54f", fontFamily: "retro", fontSize: 26 },
  codeText: { color: "white", fontFamily: "retro", fontSize: 10 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  title: {
    // color: 'white',
    // fontSize: 48,
    // backgroundColor: 'transparent',
    // textAlign: 'center',
    resizeMode: "contain",
    maxWidth: 600,
    width: "80%",
    height: 300,
  },
  coins: {
    fontFamily: "retro",
    position: "absolute",
    right: 8,
    color: "#f8e84d",
    fontSize: 36,
    letterSpacing: 0.9,
    backgroundColor: "transparent",
    textAlign: "right",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#34495e",
  },
});
