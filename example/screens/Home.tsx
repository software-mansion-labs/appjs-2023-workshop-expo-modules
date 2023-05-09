import { View, FlatList } from "react-native";
import { RootStackParamList, screenList } from "./Screens";
import React from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import ListButton from "../components/ListButton";
import Colors from "../Colors";

type ScreenLinkData = {
  name: keyof RootStackParamList;
  text: string;
};

function ScreenLink({ name, text }: ScreenLinkData) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <View>
      <ListButton
        title={text}
        onPress={() => {
          navigation.navigate(name);
        }}
      />
    </View>
  );
}

export default function Home() {
  const keyExtractor = React.useCallback(
    (item: ScreenLinkData) => item.name,
    []
  );

  return (
    <View style={{ backgroundColor: Colors.background, flexGrow: 1 }}>
      <FlatList<ScreenLinkData>
        data={screenList.map(({ name, text }) => ({ name, text }))}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => {
          return <ScreenLink {...item} />;
        }}
      />
    </View>
  );
}
