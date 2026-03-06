import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
const PasswordRule = ({ valid, text }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
    <MaterialIcons
      name={valid ? "check-circle" : "radio-button-unchecked"}
      size={18}
      color={valid ? "#22c55e" : "#64748b"}
    />
    <Text
      style={{
        marginLeft: 6,
        color: valid ? "#22c55e" : "#64748b",
        fontSize: 13,
      }}
    >
      {text}
    </Text>
  </View>
);
export default PasswordRule;