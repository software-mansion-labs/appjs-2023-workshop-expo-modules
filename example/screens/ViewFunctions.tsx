import { View, ScrollView, Text, Alert } from "react-native";
import {
  LinearChartView,
  DataMode,
  LinearChartViewRef,
} from "workshops-charts";
import React from "react";
import { getRandomInt } from "../Utils";
import Colors from "../Colors";
import Button from "../components/Button";

const data = [...Array(100).keys()].map((v, i) => ({
  x: i,
  y: getRandomInt(10),
}));

export default function ViewFunctions() {
  const chart = React.useRef<LinearChartViewRef>(null);

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
            mode: DataMode.CUBIC_BEZIER,
            textSize: 10,
            lineWidth: 5,
          }}
          nativeRef={chart}
        />
      </View>
      <View style={{ padding: 20 }}>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Move to start"
            onPress={() => chart.current?.moveToStart()}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Move to end"
            onPress={() => chart.current?.moveToEnd()}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Move to point"
            onPress={() => chart.current?.moveToPoint(50, 5)}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Save to gallery"
            onPress={async () => {
              const result = await chart.current?.saveToGallery();
              Alert.alert("Save To Gallery", `${result}`);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
