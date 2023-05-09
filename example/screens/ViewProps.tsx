import { View, ScrollView, Text } from "react-native";
import { LinearChartView } from "workshops-charts";
import React, { Dispatch, SetStateAction } from "react";
import { getRandomInt } from "../Utils";
import { Switch } from "react-native-gesture-handler";
import Colors from "../Colors";

const data = [...Array(5).keys()].map((_, i) => ({
  x: i,
  y: getRandomInt(10),
}));

const Toggle = ({
  text,
  current,
  setValue,
}: {
  text: string;
  current: boolean;
  setValue: Dispatch<SetStateAction<boolean>>;
}) => (
  <View
    style={{
      paddingVertical: 10,
      flexDirection: "row",
    }}
  >
    <Text style={{ fontWeight: "bold", flexGrow: 2, color: Colors.text }}>
      {text}
    </Text>
    <Switch
      trackColor={{
        true: Colors.secondBackground,
      }}
      value={current}
      onValueChange={setValue}
    />
  </View>
);

export default function ViewProps() {
  const [touchEnabled, setTouchEnabled] = React.useState(false);
  const [legendEnabled, setLegendEnabled] = React.useState(false);

  return (
    <ScrollView style={{ backgroundColor: Colors.background }}>
      <View
        style={{
          padding: 10,
          marginTop: 10,
          borderBottomWidth: 1,
          borderBottomColor: Colors.secondBackground,
        }}
      >
        <LinearChartView
          style={{
            height: 400,
          }}
          data={{
            label: "very important data",
            values: data,
          }}
          touchEnabled={touchEnabled}
          legendEnabled={legendEnabled}
        />
      </View>
      <View style={{ marginTop: 10, padding: 20 }}>
        <Toggle
          text="Touch enabled"
          setValue={setTouchEnabled}
          current={touchEnabled}
        />
        <Toggle
          text="Legend enabled"
          setValue={setLegendEnabled}
          current={legendEnabled}
        />
      </View>
    </ScrollView>
  );
}
