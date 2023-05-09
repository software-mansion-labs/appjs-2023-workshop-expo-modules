import { View, ScrollView } from "react-native";
import FunctionTestCase, {
  FunctionTestCaseProps,
} from "../components/FunctionTestCase";
import { ChartsModule as Charts } from "workshops-charts";
import Colors from "../Colors";
import React from "react";
import TestDetails from "../components/TestDetails";

const testCases: Omit<FunctionTestCaseProps, "showModal" | "id">[] = [
  {
    title: "Returns 20 + 23",
    function: () => Charts.add(20, 23),
    correctOutput: 43,
    functionBody: `Charts.add(20, 23)`,
  },
  {
    title: "Returns 20 + 23 async",
    function: async () => Charts.addAsync(20, 23),
    correctOutput: 43,
    functionBody: `await Charts.addAsync(20, 23)`,
  },
  {
    title: "Returns average value",
    function: () => Charts.calculateAverage([1, 2, 3, 4, 5, 6]),
    correctOutput: 3.5,
    functionBody: `Charts.calculateAverage([1, 2, 3, 4, 5, 6])`,
  },
  {
    title: "Returns generated data",
    function: () => Charts.generateDataAsync(10),
    correctOutput: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    functionBody: `Charts.generateDataAsync(10)`,
  },
  {
    title: "GenerateDataAsync should reject if the incorrect size was passed",
    function: async () => {
      try {
        await Charts.generateDataAsync(-10);
      } catch (e: any) {
        return `✅ [${e.code}] ${e.message}`;
      }
      return "❌";
    },
    functionBody: `try {
  await Charts.generateDataAsync(-10);
} catch (e: any) {
  return \`✅ [\${e.code}] \${e.message}\`;
}
  return "❌";
}`,
  },
  {
    title: "Constant was exported",
    function: () => Charts.VERY_IMPORTANT_CONSTANT,
    correctOutput: 2,
    functionBody: `Charts.VERY_IMPORTANT_CONSTANT`,
  },
  {
    title: "Native typeOf",
    function: () =>
      `${Charts.typeOf("string")}, ${Charts.typeOf(123)}, ${Charts.typeOf({})}`,
    correctOutput: "string, number, object",
    functionBody: `\`\${Charts.typeOf("string")}, \${Charts.typeOf(123)}, \${Charts.typeOf({})}\``,
  },
  {
    title: "Modifies existing JS object",
    function: () => {
      const jsObject = {};
      Charts.modifyJSObject(jsObject);
      return (jsObject as { expo: string }).expo;
    },
    correctOutput: "is awesome",
    functionBody: `const jsObject = {};
Charts.modifyJSObject(jsObject);
return jsObject.expo;`,
  },
  {
    title: "Calls JS function",
    function: () => Charts.callJSFunction((a, b) => a + b),
    correctOutput: 300,
    functionBody: `Charts.callJSFunction((a, b) => a + b)`,
  },
  {
    title: "Returns object summary",
    function: () => Charts.objectSummary({ foo: "bar", value: 123 }),
    functionBody: `Charts.objectSummary({ foo: "bar", value: 123 })`,
  },
  {
    title: "Wait for native event",
    function: async () => {
      return await new Promise((resolve) => {
        const subsription = Charts.addOnNewDataListener(({ value }) => {
          subsription.remove();
          resolve(value);
        });
        Charts.sendOnNewDataEvent();
      });
    },
    correctOutput: 123,
    functionBody: `return await new Promise((resolve) => {
  const subsription = Charts.addOnNewDataListener(({ value }) => {
    subsription.remove();
    resolve(value);
  });
  Charts.sendOnNewDataEvent();
})`,
  },
  {
    title: "Returns correct distance",
    function: () =>
      Charts.calculateDistance({ x: 1, y: 2 }, { x: 2, y: 3 }).toFixed(2),
    correctOutput: "1.41",
    functionBody: `Charts
  .calculateDistance({ x: 1, y: 2 }, { x: 2, y: 3 })
  .toFixed(2)`,
  },
  {
    title: "Custom property",
    function: () => {
      Charts.x = 20;
      return Charts.x;
    },
    correctOutput: 400,
    functionBody: `Charts.x = 20;
return Charts.x;`,
  },
];

export default function NativeModule() {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [functionBody, setFunctionBody] = React.useState("");
  const [expectedOutput, setExpectedOutput] = React.useState<any | null>(null);

  const showModal = (functionBody: string, expectedOutput: any | null) => {
    setFunctionBody(functionBody);
    setExpectedOutput(expectedOutput);
    setIsModalVisible(true);
  };

  return (
    <View style={{ backgroundColor: Colors.background, flexGrow: 1 }}>
      <TestDetails
        isVisible={isModalVisible}
        functionBody={functionBody}
        expectedOutput={expectedOutput}
        setIsVisible={setIsModalVisible}
      />
      <ScrollView>
        <View>
          {testCases.map((e, index) => (
            <FunctionTestCase
              {...e}
              id={index + 1}
              key={e.title}
              showModal={showModal}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
