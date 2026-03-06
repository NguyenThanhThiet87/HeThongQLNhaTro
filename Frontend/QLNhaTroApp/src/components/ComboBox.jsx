import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";

export default function ComboBox({
  style,
  data,
  labelField = "label",
  valueField = "value",
  placeholder = "Chọn",
  value,
  onChange,
  rightIconColor = "#666",
  rightIconSize = 16,
  width,
  height = 40,
  textColor = "#222", // màu văn bản
  placeholderColor = "#888", // màu placeholder
  itemTextColor = "#222", // màu text trong dropdown
  ...props
}) {
  return (
    <Dropdown
      style={[styles.dropdown, style, width && { width }, height && { height }]}
      data={data}
      labelField={labelField}
      valueField={valueField}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      selectedTextStyle={{ color: textColor, fontSize: 14 }}
      placeholderStyle={{ color: placeholderColor, fontSize: 14 }}
      itemTextStyle={{ color: itemTextColor, fontSize: 14 }}
      renderRightIcon={() => (
        <MaterialIcons name="expand-more" size={rightIconSize} color={rightIconColor} />
      )}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});