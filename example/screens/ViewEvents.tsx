import { View, ScrollView, Text, StyleSheet } from "react-native";
import { LinearChartView, DataMode } from "workshops-charts";
import React from "react";
import { getRandomInt } from "../Utils";
import MonoText from "../components/MonoText";
import Colors from "../Colors";

const data = [...Array(10).keys()].map((v, i) => ({
  x: i,
  y: getRandomInt(10),
}));

export default function ViewEvents() {
  const [onDataSelectEvent, setOnDataSelect] = React.useState<string | null>(
    null
  );
  const [onScaleEvent, setOnScaleEvent] = React.useState<string | null>(null);

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
          onDataSelect={({ nativeEvent }) =>
            setOnDataSelect(JSON.stringify(nativeEvent))
          }
          onScale={({ nativeEvent }) =>
            setOnScaleEvent(
              JSON.stringify({
                scaleX: nativeEvent.scaleX.toFixed(2),
                scaleY: nativeEvent.scaleY.toFixed(2),
              })
            )
          }
        />
      </View>
      <View style={{ marginTop: 10, padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>onDataSelect:</Text>
          <MonoText containerStyle={{ flexGrow: 1 }}>
            {onDataSelectEvent ? onDataSelectEvent : "wasn't sent"}
          </MonoText>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={styles.text}>onScale:</Text>
          <MonoText containerStyle={{ flexGrow: 1 }}>
            {onScaleEvent ? onScaleEvent : "wasn't sent"}
          </MonoText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "bold",
    paddingRight: 10,
    color: Colors.text,
  },
});
