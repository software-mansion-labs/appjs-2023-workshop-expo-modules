import { Dispatch, SetStateAction, useState } from "react";
import DropDownPicker, {
  ItemType,
  ValueType,
} from "react-native-dropdown-picker";
import Colors from "../Colors";

export default function <T extends ValueType>({
  items,
  current,
  setValue,
}: {
  items: ItemType<T>[];
  current: T;
  setValue: Dispatch<SetStateAction<T>>;
}): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <DropDownPicker
      open={open}
      value={current}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      listMode="SCROLLVIEW"
      dropDownDirection="TOP"
      labelStyle={{ color: Colors.text }}
      listItemContainerStyle={{ backgroundColor: Colors.secondBackground }}
      listItemLabelStyle={{ color: Colors.text }}
      style={{ backgroundColor: Colors.secondBackground }}
    />
  );
}
