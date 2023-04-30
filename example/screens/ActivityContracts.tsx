import { Alert, View } from "react-native";
import { ChartsModule as Charts } from "workshops-charts";
import Colors from "../Colors";
import React from "react";

import Button from "../components/Button";

export default function () {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [functionBody, setFunctionBody] = React.useState("");
  const [expectedOutput, setExpectedOutput] = React.useState<any | null>(null);

  const showModal = (functionBody: string, expectedOutput: any | null) => {
    setFunctionBody(functionBody);
    setExpectedOutput(expectedOutput);
    setIsModalVisible(true);
  };
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
