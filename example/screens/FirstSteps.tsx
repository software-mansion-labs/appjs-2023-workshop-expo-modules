import { View, FlatList, Text, Alert, StyleSheet } from "react-native";
import React from "react";
import Colors from "../Colors";
import Button from "../components/Button";
import { requireNativeModule } from "expo-modules-core";

export default function () {
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flexGrow: 1,
        justifyContent: "center",
      }}
    >
      <View style={styles.button}>
        <Button
          title="Check if module exists"
          onPress={() => {
            const module = requireNativeModule("FirstModule");
            Alert.alert("NativeModule", JSON.stringify(module));
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Run async function"
          onPress={async () => {
            const module = requireNativeModule("FirstModule");
            const result = await module.functionAsync();
            Alert.alert("NativeModule", JSON.stringify(result));
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Run sync function"
          onPress={() => {
            const module = requireNativeModule("FirstModule");
            const result = module.function();
            Alert.alert("NativeModule", JSON.stringify(result));
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 20,
  },
});
