import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MonoText from "./MonoText";

import Colors from "../Colors";

type AllowTypes =
  | string[]
  | number[]
  | boolean[]
  | string
  | number
  | boolean
  | null
  | undefined;

export type FunctionTestCaseProps = {
  title: string;
  function: () => Promise<AllowTypes> | AllowTypes;
  correctOutput?: AllowTypes;
  functionBody?: string;
  showModal: (functionBody: string, expectedOutput: any | null) => void;
};

const compareArrays = (a: any[], b: any[]) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

function comperaData(result: AllowTypes, correctOutput: AllowTypes): boolean {
  if (Array.isArray(result) && Array.isArray(correctOutput)) {
    return compareArrays(result, correctOutput);
  }

  return result === correctOutput;
}

function printData(result: AllowTypes): string {
  if (typeof result === "object") {
    return JSON.stringify(result);
  }
  return "" + result;
}

export default function FunctionTestCase(props: FunctionTestCaseProps) {
  const [result, setResult] = React.useState<AllowTypes | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);

  return (
    <TouchableOpacity
      onPress={async () => {
        const newResult = await props.function();
        setResult(newResult);
        if (props.correctOutput != null) {
          setIsCorrect(comperaData(newResult, props.correctOutput));
        }
      }}
      onLongPress={() => {
        const functionBody = props.functionBody;
        if (functionBody != null) {
          props.showModal(functionBody, props.correctOutput);
        }
      }}
    >
      <View
        style={{
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderBottomWidth: 1,
          borderBottomColor: Colors.secondBackground,
        }}
      >
        <Text style={{ color: Colors.text }}>🚀 {props.title}</Text>

        {result && (
          <MonoText>
            {isCorrect != null ? (isCorrect ? "✅ " : "❌ ") : ""}
            {printData(result)}
          </MonoText>
        )}
      </View>
    </TouchableOpacity>
  );
}
