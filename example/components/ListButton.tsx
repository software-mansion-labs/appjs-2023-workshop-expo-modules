import React from "react";
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
  View,
} from "react-native";
import Colors from "../Colors";

type Props = TouchableHighlightProps & {
  title: string;
};

const ListButton = ({ disabled, onPress, style, title }: Props) => {
  const buttonStyles = [disabled && styles.disabledButton];
  const labelStyles = [styles.label, disabled && styles.disabledLabel];
  return (
    <View style={[buttonStyles]}>
      <TouchableHighlight
        style={[style, styles.touchable]}
        disabled={disabled}
        onPress={onPress}
        underlayColor={Colors.secondary}
      >
        <Text style={labelStyles}>{title}</Text>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    paddingVertical: 20,
  },
  disabledButton: {},
  label: {
    color: Colors.text,
    fontWeight: "700",
    paddingLeft: 20,
  },
  disabledLabel: {
    color: "#999999",
  },
});

export default ListButton;
