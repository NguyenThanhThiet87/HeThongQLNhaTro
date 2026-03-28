import React from "react";
import { useTheme } from "../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


export default function PropertyCard({
    name,
    address,
    image,
    fillPercent = 0,
    roomCount,
    onPress
}) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <TouchableOpacity style={styles.propertyCard} onPress={onPress}>

            <View>
                <Image
                    source={{ uri: image }}
                    style={styles.propertyImage}
                />

                {roomCount && (
                    <View style={styles.roomBadge}>
                        <Text style={styles.roomBadgeText}>
                            {roomCount} Phòng
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.propertyBody}>

                <Text style={styles.propertyName}>
                    {name}
                </Text>

                <View style={styles.locationRow}>
                    <MaterialIcons
                        name="location-on"
                        size={14}
                        color="#aaa"
                    />
                    <Text style={styles.locationText}>
                        {address}
                    </Text>
                </View>

                <Text style={styles.fillText}>
                    Lấp đầy {fillPercent}%
                </Text>

                <View style={styles.progress}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${fillPercent}%` }
                        ]}
                    />
                </View>

            </View>

        </TouchableOpacity>
    );
}

const createStyles = (COLORS) => StyleSheet.create({

    propertyCard: {
        marginTop: 20,
        width: 280,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 15,
        borderColor: COLORS.border,
        borderWidth: 1
    },

    propertyImage: {
        width: "100%",
        height: 120,
    },

    propertyBody: {
        padding: 15,
    },

    propertyName: {
        color: COLORS.textMain,
        fontWeight: "bold",
        fontSize: 15
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },

    locationText: {
        color: COLORS.textMuted,
        marginLeft: 5,
        fontSize: 12,
        flex: 1
    },

    fillText: {
        color: COLORS.primary,
        marginTop: 10,
        fontSize: 12
    },

    progress: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 3,
        marginTop: 5,
    },

    progressFill: {
        height: "100%",
        backgroundColor: COLORS.primary,
        borderRadius: 3
    },

    roomBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: COLORS.buttonBg,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },

    roomBadgeText: {
        color: COLORS.buttonText,
        fontSize: 11
    }

});
