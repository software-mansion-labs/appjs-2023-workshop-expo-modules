import { Modal, Pressable, View, StyleSheet, Text } from "react-native";
import Colors from "../Colors";
import MonoText from "./MonoText";
import { Dispatch, SetStateAction } from "react";

type Props = {
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
  functionBody: string;
  expectedOutput?: any;
};

export default function ({
  isVisible,
  setIsVisible,
  functionBody,
  expectedOutput,
}: Props) {
  return (
    <Modal
      animationType="slide"
      statusBarTranslucent
      transparent={true}
      visible={isVisible}
      onRequestClose={() => {
        setIsVisible(!isVisible);
      }}
    >
      <Pressable
        style={{ flexGrow: 1 }}
        onPress={() => setIsVisible(!isVisible)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalHeader}>Test Details</Text>

            <Text style={styles.modalTest}>Body:</Text>
            <MonoText
              containerStyle={{
                backgroundColor: Colors.secondary,
              }}
              textStyle={{ fontSize: 10 }}
            >
              {functionBody}
            </MonoText>

            {expectedOutput && (
              <View>
                <Text style={styles.modalTest}>Expected output:</Text>
                <MonoText
                  containerStyle={{ backgroundColor: Colors.secondary }}
                >
                  {expectedOutput}
                </MonoText>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",

    marginTop: 22,
    backgroundColor: Colors.transparentBackground,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors.secondBackground,
    borderRadius: 10,
    padding: 20,

    shadowColor: Colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: "95%",
    // minHeight: "40%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
  },
  modalHeader: {
    marginBottom: 15,
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  modalTest: {
    color: Colors.text,
  },
});
