import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";

export default function RoleCard({
    value,
    title,
    subtitle,
    description,
    icon,
    role,
    setRole
}) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    
    const selected = role === value;

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setRole(value)}
            style={[
                styles.card,
                selected && styles.cardSelected
            ]}
        >
            <View style={styles.cardContent}>

                <View style={{ flex: 1 }}>
                    <View style={[
                        styles.iconBox,
                        selected && styles.iconBoxSelected
                    ]}>
                        <MaterialIcons
                            name={icon}
                            size={26}
                            color={COLORS.primary}
                        />
                    </View>

                    <Text style={[
                        styles.cardTitle,
                        selected && { color: COLORS.primary }
                    ]}>
                        {title}
                    </Text>

                    <Text style={[
                        styles.cardSubtitle,
                        selected && { color: COLORS.primary }
                    ]}>
                        {subtitle}
                    </Text>

                    <Text style={styles.cardDescription}>
                        {description}
                    </Text>
                </View>

                <View style={[
                    styles.radio,
                    selected && styles.radioSelected
                ]}>
                    {selected && (
                        <MaterialIcons
                            name="check"
                            size={16}
                            color={COLORS.primary}
                        />
                    )}
                </View>

            </View>
        </TouchableOpacity>
    );
}

const createStyles = (COLORS) => StyleSheet.create({

    card: {
        backgroundColor: COLORS.cardBg,
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: COLORS.border
    },

    cardSelected: {
        borderColor: COLORS.border,
        backgroundColor: COLORS.cardSelectedBg
    },

    cardContent: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: COLORS.primaryLight,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10
    },

    iconBoxSelected: {
        backgroundColor: COLORS.primaryLight
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: COLORS.textMain
    },

    cardSubtitle: {
        fontSize: 12,
        fontWeight: "600",
        color: COLORS.textMuted,
        marginTop: 2,
        marginBottom: 6
    },

    cardDescription: {
        fontSize: 13,
        color: COLORS.textMuted
    },

    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center"
    },

    radioSelected: {
        backgroundColor: COLORS.primaryLight,
        borderColor: COLORS.border
    }

});
