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
    title: "Exports simple class",
    function: () => new Charts.Class().constructor.name,
    correctOutput: "Class",
    functionBody: `new Charts.Class().constructor.name`,
  },
  {
    title: "Run native constructor with parameter",
    function: () => {
      const obj = new Charts.Class(123);
      return obj.property;
    },
    correctOutput: 123,
    functionBody: `const obj = new Charts.Class(123);
return obj.property;`,
  },
  {
    title: "Exports sync function",
    function: () => {
      const obj = new Charts.Class();
      obj.modifyProperty();
      return obj.property;
    },
    correctOutput: 100,
    functionBody: `const obj = new Charts.Class();
obj.modifyProperty();
return obj.property;`,
  },
  {
    title: "Exports async function",
    function: async () => {
      const obj = new Charts.Class();
      await obj.modifyPropertyAsync();
      return obj.property;
    },
    correctOutput: 100,
    functionBody: `const obj = new Charts.Class();
await obj.modifyPropertyAsync();
return obj.property;`,
  },
  {
    title: "Creates anonymous object",
    function: async () => {
      const obj = new Charts.Class();
      const result = obj.createAnonymousObject();
      return result.calculate(10, 20, 30);
    },
    correctOutput: 60,
    functionBody: `const obj = new Charts.Class();
const result = obj.createAnonymousObject();
return result.calculate(10, 20, 30);`,
  },
  {
    title: "Creates SharedList",
    function: async () => {
      const list = new Charts.SharedList();
      list.add(10);
      list.add(20);

      return list.get(0) + list.get(1);
    },
    correctOutput: 30,
    functionBody: `const list = new Charts.SharedList();
list.add(10);
list.add(20);
return list.get(0) + list.get(1);`,
  },
  {
    title: "Iterates over SharedList",
    function: async () => {
      const list = new Charts.SharedList();
      for (let i = 0; i < 10; i++) {
        list.add(i);
      }

      var sum = 0;
      for (let i = 0; i < list.size(); i++) {
        sum += list.get(i);
      }

      return sum;
    },
    correctOutput: 45,
  },
  {
    title: "Iterates over SharedList using async functions",
    function: async () => {
      const list = new Charts.SharedList();
      for (let i = 0; i < 10; i++) {
        await list.addAsync(i);
      }

      var sum = 0;
      const size = await list.sizeAsync();
      for (let i = 0; i < size; i++) {
        sum += await list.getAsync(i);
      }

      return sum;
    },
    correctOutput: 45,
  },
];

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
