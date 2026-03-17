import React from "react";
import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useTheme } from "../theme/useTheme";

export default function AppHeader({ left, center, right, style}) {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
            <View style={[styles.header, style]}>
                <View style={styles.left}>{left}</View>
                <View style={styles.center}>{center}</View>
                <View style={styles.right}>{right}</View>
            </View>
        </>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingTop: 40,
        backgroundColor: COLORS.bgLight,
    },
    left: { flex: 1, flexDirection: "row", alignItems: "center" },
    center: { flex: 4, alignItems: "center", justifyContent: "center" },
    right: { flex: 1, alignItems: "flex-end" },
});