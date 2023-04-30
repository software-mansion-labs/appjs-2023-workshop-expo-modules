import { TouchableOpacity, Text } from "react-native";
import Colors from "../Colors";

type Props = {
  title: string;
  onPress: () => void;
};

export default function ({ title, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: Colors.secondBackground,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 4,
      }}
    >
      <Text style={{ textAlign: "center", color: Colors.text }}>{title}</Text>
    </TouchableOpacity>
  );
}
