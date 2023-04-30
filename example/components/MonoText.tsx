import { Code } from "@expo/html-elements";
import React, { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle, TextStyle } from "react-native";
import Colors from "../Colors";

type Props = PropsWithChildren<{
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}>;

const MonoText = ({ children, containerStyle, textStyle }: Props) => (
  <View style={[styles.container, containerStyle]}>
    <Code style={[styles.monoText, textStyle]} lineBreakMode="tail">
      {children}
    </Code>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    padding: 6,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.secondBackground,
  },
  monoText: {
    fontSize: 12,
    color: Colors.text,
  },
});

export default MonoText;
