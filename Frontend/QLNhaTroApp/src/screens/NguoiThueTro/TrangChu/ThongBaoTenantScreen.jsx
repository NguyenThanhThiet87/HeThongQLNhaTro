import React, { useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/useTheme";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getNotifications, markAsReadApi } from "../../../api/ThongBao";

export default function ThongBaoTenantScreen({ navigation }) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        const user = await getCurrentUser();
        if (user) {
            const res = await getNotifications(user.maNd);
            console.log("thong bao", res.data)
            if (res.success) {
                setNotifications(res.data);
            }
        }
        setLoading(false);
        setRefreshing(false);
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [fetchNotifications])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const handlePressNotification = async (item) => {
        if (!item.daDoc) {
            await markAsReadApi(item.maTb);
            setNotifications(prev => prev.map(n => n.maTb === item.maTb ? { ...n, daDoc: true } : n));
        }

        if (item.loaiTb == "TienPhong") {
            navigation.navigate("Bill", { screen: "ThanhToanHoaDon", params: { maHd: item.maThucThe } });
        } else if (item.loaiTb == "SuCo") {
            navigation.navigate("ChiTietBaoCaoSuCo", { maHd: item.maThucThe });
        } else if (item.loaiTb == "DonHang") {
            navigation.navigate("Tenant", { screen: "ChiTietDonHangDichVu", params: { orderId: item.maThucThe } })
        }
    };

    const renderItem = ({ item }) => {
        const isRead = item.daDoc;
        return (
            <TouchableOpacity
                style={[styles.notiItem, !isRead && styles.unreadItem]}
                onPress={() => handlePressNotification(item)}
            >
                <View style={styles.iconContainer}>
                    <MaterialIcons
                        name={item.tieuDe?.includes("Thanh Toan") ? "payment" : "notifications"}
                        size={24}
                        color={!isRead ? COLORS.primary : "#94a3b8"}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.title, !isRead && styles.unreadTitle]}>{item.tieuDe}</Text>
                        <Text style={styles.time}>{new Date(item.ngayTao).toLocaleDateString("vi-VN")}</Text>
                    </View>
                    <Text style={styles.message} numberOfLines={2}>{item.noiDung}</Text>
                </View>
                {!isRead && <View style={styles.dot} />}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.center}>
                    <MaterialIcons name="notifications-none" size={60} color="#cbd5e1" />
                    <Text style={styles.emptyText}>Chưa có thông báo nào</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.maTb?.toString()}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: COLORS.card,
    },
    headerTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textMain },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    notiItem: {
        flexDirection: "row",
        padding: 16,
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
    },
    unreadItem: { backgroundColor: COLORS.primary + "08" }, // Rất nhạt
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.bgLight,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    contentContainer: { flex: 1 },
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    title: { fontSize: 15, fontWeight: "600", color: "#64748b" },
    unreadTitle: { color: COLORS.textMain, fontWeight: "700" },
    time: { fontSize: 12, color: "#94a3b8" },
    message: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, marginLeft: 8 },
    emptyText: { marginTop: 16, fontSize: 16, color: "#94a3b8" },
});
