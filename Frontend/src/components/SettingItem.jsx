import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PRIMARY = "#13c8ec";
const BG_DARK = "#101f22";
const SURFACE = "#162a2e";
const BORDER = "#1f3a40";

export const SettingItem = ({
    icon,
    title,
    subtitle,
    color = "#64748b",
    bg = "rgba(255,255,255,0.05)",
    borderBottom = true,
    onHandle,
    colorTitle = "#fff",
    colorBorder = BORDER
}) => (
    <TouchableOpacity
        style={[
            styles.settingItem,
            borderBottom && { borderBottomWidth: 1, borderBottomColor: colorBorder }
        ]}
        activeOpacity={0.7}
        onPress={onHandle}
    >

        <View style={[styles.settingIcon, { backgroundColor: bg }]}>
            <MaterialIcons
                name={icon}
                size={20}
                color={color}
            />
        </View>

        <View style={styles.settingContent}>
            <Text style={[styles.settingTitle, { color: colorTitle }]}>
                {title}
            </Text>

            {subtitle && (
                <Text style={styles.settingSubtitle}>
                    {subtitle}
                </Text>
            )}
        </View>

        <MaterialIcons
            name="chevron-right"
            size={20}
            color="#64748b"
        />

    </TouchableOpacity>
);

const styles = StyleSheet.create({

    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14
    },

    settingBorder: {
        borderBottomWidth: 1,
        borderBottomColor: BORDER
    },

    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    settingContent: {
        flex: 1,
        marginLeft: 12
    },

    settingTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500"
    },

    settingSubtitle: {
        color: "#94a3b8",
        fontSize: 12,
        marginTop: 2
    },
});