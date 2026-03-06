import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PRIMARY = "#13c8ec";
const SURFACE = "#1a2c30";

export default function PropertyCard({
    name,
    address,
    image,
    fillPercent = 0,
    roomCount,
    onPress
}) {

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

const styles = StyleSheet.create({

    propertyCard: {
        marginTop: 20,
        width: 280,
        backgroundColor: SURFACE,
        borderRadius: 12,
        overflow: "hidden",
        marginRight: 15,
    },

    propertyImage: {
        width: "100%",
        height: 120,
    },

    propertyBody: {
        padding: 15,
    },

    propertyName: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 15
    },

    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
    },

    locationText: {
        color: "#aaa",
        marginLeft: 5,
        fontSize: 12,
        flex: 1
    },

    fillText: {
        color: PRIMARY,
        marginTop: 10,
        fontSize: 12
    },

    progress: {
        height: 6,
        backgroundColor: "#333",
        borderRadius: 3,
        marginTop: 5,
    },

    progressFill: {
        height: "100%",
        backgroundColor: PRIMARY,
        borderRadius: 3
    },

    roomBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: "rgba(0,0,0,0.6)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6
    },

    roomBadgeText: {
        color: "#fff",
        fontSize: 11
    }

});
