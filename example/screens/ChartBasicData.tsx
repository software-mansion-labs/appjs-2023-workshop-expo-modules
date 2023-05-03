import { View, ScrollView, Text } from "react-native";
import { LinearChartView, DataMode } from "workshops-charts";
import { ItemType, ValueType } from "react-native-dropdown-picker";
import React, { Dispatch, SetStateAction } from "react";
import { getRandomInt } from "../Utils";
import DropdownPicker from "../components/DropdownPicker";
import Colors from "../Colors";

const data = [...Array(5).keys()].map((v, i) => ({
  x: i,
  y: getRandomInt(10),
}));

const dataModes = [
  { label: "LINEAR", value: DataMode.LINEAR },
  { label: "CUBIC_BEZIER", value: DataMode.CUBIC_BEZIER },
  { label: "HORIZONTAL_BEZIER", value: DataMode.HORIZONTAL_BEZIER },
  { label: "STEPPED", value: DataMode.STEPPED },
];

const fontSizes = [
  { label: "5", value: 5 },
  { label: "10", value: 10 },
  { label: "15", value: 15 },
  { label: "20", value: 20 },
];

const lineWidths = [
  { label: "2", value: 2 },
  { label: "5", value: 5 },
  { label: "10", value: 10 },
];

const Options = <T extends ValueType>({
  text,
  items,
  current,
  setValue,
}: {
  text: string;
  items: ItemType<T>[];
  current: T;
  setValue: Dispatch<SetStateAction<T>>;
}) => (
  <View
    style={{
      paddingVertical: 5,
    }}
  >
    <Text style={{ fontWeight: "bold", color: Colors.text }}>{text}</Text>
    <DropdownPicker items={items} current={current} setValue={setValue} />
  </View>
);

export default function ChartBasicData() {
  const [dataMode, setDataMode] = React.useState(DataMode.LINEAR);
  const [fontSize, setFontSize] = React.useState(10);
  const [lineWidth, setLineWidth] = React.useState(5);

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
            mode: dataMode,
            textSize: fontSize,
            lineWidth: lineWidth,
          }}
        />
      </View>
      <View
        style={{
          backgroundColor: Colors.background,
          marginTop: 10,
          paddingHorizontal: 20,
        }}
      >
        <Options
          text="Font size:"
          items={fontSizes}
          current={fontSize}
          setValue={setFontSize}
        />
        <Options
          text="Line width:"
          items={lineWidths}
          current={lineWidth}
          setValue={setLineWidth}
        />
        <Options
          text="Data Mode:"
          items={dataModes}
          current={dataMode}
          setValue={setDataMode}
        />
      </View>
    </ScrollView>
  );
}
