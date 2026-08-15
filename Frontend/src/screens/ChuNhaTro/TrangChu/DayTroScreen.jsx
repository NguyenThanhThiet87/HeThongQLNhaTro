import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    TextInput,
    StatusBar,
    ScrollView
} from "react-native";

import AppHeader from "../../../components/AppHeader";

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTrosApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";

export default function PropertyListScreen({ navigation }) {
    const { COLORS, isDark } = useTheme();
    const styles = createStyles(COLORS);

    const [dayNhaTro, setDayNhaTro] = useState([]);
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const user = await getCurrentUser();
                const result = await getDayNhaTrosApi(user.maNd);
                if (result.success) {
                    setDayNhaTro(result.data);
                }
            };
            fetchData();
        }, [])
    );

    return (
        <View style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Dãy nhà trọ</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            {/* SEARCH */}
            <View style={styles.searchBox}>
                <MaterialIcons name="search" size={20} color={COLORS.textMain} />
                <TextInput
                    placeholder="Tìm kiếm dãy trọ, địa chỉ..."
                    style={styles.searchInput}
                />
                <MaterialIcons name="tune" size={20} color={COLORS.textMain} />
            </View>

            {/* LIST */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}>
                {dayNhaTro.length > 0 ? (
                    dayNhaTro.map((item) => (
                        <View key={item.maDayNt} style={{ marginBottom: 12 }}>
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
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <View style={{ alignItems: "center", marginTop: 50 }}>
                        <MaterialIcons name="home" size={64} color="#94a3b8" />
                        <Text style={{ marginTop: 16, color: "#94a3b8", fontSize: 16 }}>
                            Chưa có dãy nhà trọ nào. Hãy tạo dãy trọ đầu tiên!
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("TaoDayNhaTroB1")}>
                <MaterialIcons name="add" size={28} color="#101f22" />
            </TouchableOpacity>
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.inputBg,
        padding: 10,
        borderRadius: 12,
        marginBottom: 16,
        marginHorizontal: 16,
        marginTop: 12,
    },

    searchInput: {
        flex: 1,
        marginHorizontal: 8,
    },

    card: {
        flexDirection: "row",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        borderColor: COLORS.border,
        borderWidth: 1,
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
        color: COLORS.textMain,
    },

    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 4,
        paddingRight: 2,
    },

    address: {
        marginLeft: 4,
        color: COLORS.textMuted,
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
        color: COLORS.textMuted,
    },

    divider: {
        width: 1,
        height: 12,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: 8,
    },

    emptyText: {
        color: COLORS.textMuted,
        fontWeight: "600",
    },

    fullText: {
        color: COLORS.textMuted,
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
