import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import styles from "./RoleCard.styles";

export default function RoleCard({
    value,
    title,
    subtitle,
    description,
    icon,
    role,
    setRole
}) {

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
                            color={selected ? "#13c8ec" : "#888"}
                        />
                    </View>

                    <Text style={[
                        styles.cardTitle,
                        selected && { color: "#13c8ec" }
                    ]}>
                        {title}
                    </Text>

                    <Text style={[
                        styles.cardSubtitle,
                        selected && { color: "#13c8ec" }
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
                            color="white"
                        />
                    )}
                </View>

            </View>
        </TouchableOpacity>
    );
}
