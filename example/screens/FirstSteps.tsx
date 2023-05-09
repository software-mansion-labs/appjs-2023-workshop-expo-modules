import { View, Alert, StyleSheet } from "react-native";
import React from "react";
import Colors from "../Colors";
import Button from "../components/Button";
import { FirstModule } from "workshops-charts";

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
            Alert.alert(
              "NativeModule",
              JSON.stringify(Object.keys(FirstModule), null, 2)
            );
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Run async function"
          onPress={async () => {
            const result = await FirstModule.functionAsync();
            Alert.alert("NativeModule", JSON.stringify(result));
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Run sync function"
          onPress={() => {
            const result = FirstModule.function();
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
