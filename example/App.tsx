import { StyleSheet, Text, View } from "react-native";

import * as Charts from "workshops-charts";
import Colors from "./Colors";
import { StatusBar } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Text style={styles.text}>🚀 It works! 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 40,
    color: Colors.text,
  },
});
