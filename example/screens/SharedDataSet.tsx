import { View, ScrollView } from "react-native";
import {
  LinearChartView,
  DataMode,
  LinearChartViewRef,
  LinearChartModule,
  SharedDataSet,
} from "workshops-charts";
import React from "react";
import { getRandomInt } from "../Utils";
import Colors from "../Colors";
import Button from "../components/Button";

export default function () {
  const [dataSet, setDataSet] = React.useState<SharedDataSet>(
    new LinearChartModule.SharedDataSet()
  );

  const chartRef = React.useCallback<
    (current: LinearChartViewRef) => Promise<void>
  >(
    async (node) => {
      if (node !== null) {
        await node.setDataSet(dataSet);
      }
    },
    [dataSet]
  );

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
          nativeRef={chartRef}
        />
      </View>
      <View style={{ padding: 20 }}>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Add data point"
            onPress={() => dataSet.add(getRandomInt(10))}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Create SharedDataSet from typed array"
            onPress={() => {
              setDataSet(
                new LinearChartModule.SharedDataSet(new Uint8Array([1, 4, 10]))
              );
            }}
          />
        </View>
        <View style={{ paddingVertical: 10 }}>
          <Button
            title="Create SharedDataSet with custom options"
            onPress={() => {
              setDataSet(
                new LinearChartModule.SharedDataSet(
                  new Uint8Array([10, 8, 5, 3, 1]),
                  {
                    mode: DataMode.LINEAR,
                    lineWidth: 2,
                  }
                )
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
