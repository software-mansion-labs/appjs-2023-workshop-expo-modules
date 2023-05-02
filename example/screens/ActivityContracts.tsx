import { Alert, View } from "react-native";
import { ChartsModule as Charts } from "workshops-charts";
import Colors from "../Colors";
import React from "react";

import Button from "../components/Button";

export default function () {
  return (
    <View
      style={{
        backgroundColor: Colors.background,
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        title="Pick Ringtone"
        onPress={async () => {
          const ringtone = await Charts.pickRingtone();
          Alert.alert("Rington", `Selected rington ${ringtone}`);
        }}
      />
    </View>
  );
}
