import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Linking } from "react-native";
import { RootStackParamList, screenList } from "./screens/Screens";

import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";

const Stack = createStackNavigator<RootStackParamList>();

import Home from "./screens/Home";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import Colors from "./Colors";

const PERSISTENCE_KEY = "NAVIGATION_STATE";

export default function App() {
  const [isReady, setIsReady] = React.useState(__DEV__ ? false : true);
  const [initialState, setInitialState] = React.useState();

  React.useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();

        if (Platform.OS !== "web" && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;

          if (state !== undefined) {
            setInitialState(state);
          }
        }
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  if (!isReady) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator />
      </View>
    );
  }

  const options = {
    headerStyle: {
      backgroundColor: Colors.background,
    },
    headerTintColor: Colors.text,

    headerTitleStyle: {
      color: Colors.text,
    },
    ...TransitionPresets.SlideFromRightIOS,
  };

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
      }
    >
      <StatusBar style="light" />

      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            ...options,
            title: "🚀 Native modules made easy with Expo",
          }}
        />
        {screenList
          .filter(
            // @ts-ignore
            (screen) => !screen.platform || screen.platform === Platform.OS
          )
          .map((screen) => {
            return (
              <Stack.Screen
                key={screen.name}
                name={screen.name}
                component={screen.component}
                options={{ ...options, title: screen.text }}
              />
            );
          })}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.background,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerView: {
    height: 400,
    width: "100%",
  },
});
