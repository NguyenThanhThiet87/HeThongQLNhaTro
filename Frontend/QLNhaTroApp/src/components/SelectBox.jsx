import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";

export default function SelectBox({
    value,
    placeholder = "Chọn mục",
    onPress,
    style,
    textStyle,
    iconColor = "#aaa"
}) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

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

const createStyles = (COLORS) => StyleSheet.create({
    box: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: COLORS.inputText,
        fontWeight: "600",
        fontSize: 18,
        marginRight: 6,
    },
});