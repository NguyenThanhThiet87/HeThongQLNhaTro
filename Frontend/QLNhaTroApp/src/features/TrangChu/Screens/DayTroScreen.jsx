import React from "react";
import { useState, useEffect } from "react";

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTrosApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";

export default function PropertyListScreen({ navigation }) {
    const [dayNhaTro, setDayNhaTro] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            const result = await getDayNhaTrosApi(user.maNd);
            if (result.success) {
                setDayNhaTro(result.data);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item }) => {
        const emptyText =
            item.empty === 0 ? (
                <Text style={styles.fullText}>Full</Text>
            ) : (
                <Text style={styles.emptyText}>{item.empty} Trống</Text>
            );

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("ChiTietDayTro", { id: item.maDayNt })}
            >
                <Image source={{ uri: item.urlAnh }} style={styles.image} />

                <View style={styles.cardContent}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <Text style={styles.title}>{item.tenDayNt}</Text>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {item.trangThaiNt === true ? "Hoạt động" : "Tạm ngưng"}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.addressRow}>
                        <MaterialIcons name="location-on" size={16} color="#13c8ec" />
                        <Text style={styles.address}>{item.diaChi}</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statsLeft}>
                            <View style={styles.roomRow}>
                                <MaterialIcons name="meeting-room" size={16} color="#94a3b8" />
                                <Text style={styles.roomText}>
                                    {item.slphong} Phòng
                                </Text>
                            </View>

                            <View style={styles.divider} />

                            {emptyText}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* HEADER */}
            <View style={styles.header}>
                {/* Back */}
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color="#aaa" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>
                        Dãy Trọ Của Tôi
                    </Text>
                </View>
            </View>

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <MaterialIcons name="search" size={20} color="#94a3b8" />
                <TextInput
                    placeholder="Tìm kiếm dãy trọ, địa chỉ..."
                    style={styles.searchInput}
                />
                <MaterialIcons name="tune" size={20} color="#94a3b8" />
            </View>

            {/* LIST */}
            <FlatList
                data={dayNhaTro}
                keyExtractor={(item) => item.maDayNt.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 120 }}
            />

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("TaoDayNhaTroB1")}>
                <MaterialIcons name="add" size={28} color="#101f22" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101f22",
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    header: {
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

        borderBottomWidth: 1,
        borderBottomColor: "#1f2937",

        backgroundColor: "#101f22"
    },

    back: {
        position: "absolute",
        left: 16,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",

        paddingRight: 10,
        zIndex: 10
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center"
    },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#182b2f",
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
    },

    searchInput: {
        flex: 1,
        marginHorizontal: 8,
    },

    card: {
        flexDirection: "row",
        backgroundColor: "#182b2f",
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
    },

    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
    },

    cardContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: "space-between",
    },

    title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#ffffff",
    },

    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        paddingRight: 2,
    },

    address: {
        marginLeft: 4,
        color: "#ffffff",
        fontSize: 12,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    statsLeft: {
        flexDirection: "row",
        alignItems: "center",
    },

    roomRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    roomText: {
        marginLeft: 4,
        color: "#cbd5e1",
    },

    divider: {
        width: 1,
        height: 12,
        backgroundColor: "#cbd5e1",
        marginHorizontal: 8,
    },

    emptyText: {
        color: "#13c8ec",
        fontWeight: "600",
    },

    fullText: {
        color: "#fb7185",
        fontWeight: "600",
    },

    badge: {
        backgroundColor: "#dcfce7",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },

    badgeText: {
        color: "#16a34a",
        fontSize: 11,
        fontWeight: "600",
    },

    fab: {
        position: "absolute",
        bottom: 30,
        right: 20,
        backgroundColor: "#13c8ec",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
    },
});
