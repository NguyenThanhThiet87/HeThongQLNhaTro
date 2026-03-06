import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function SelectBox({
    value,
    placeholder = "Chọn mục",
    onPress,
    style,
    textStyle,
    iconColor = "#aaa"
}) {
    return (
        <TouchableOpacity style={[styles.box, style]} onPress={onPress}>
            <View style={styles.row}>
                <Text style={[styles.text, textStyle]}>
                    {value ? value : placeholder}
                </Text>
                <MaterialIcons name="expand-more" size={18} color={iconColor} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    box: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: "#1a2e32",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 18,
        marginRight: 6,
    },
});