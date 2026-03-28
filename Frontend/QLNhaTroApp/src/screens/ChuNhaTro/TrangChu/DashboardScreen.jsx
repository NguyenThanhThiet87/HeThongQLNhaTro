import React, { useEffect, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";
import legend from "../../../components/Legend";
import PropertyCard from "../../../components/PropertyCard";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getDayNhaTrosApi, getThongKePhongApi } from "../../../api/PhongTro";
import { getDoanhThuApi } from "../../../api/HoaDon";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function DashboardScreen() {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [dayNhaTros, setDayNhaTros] = useState([]);
    const [doanhThu, setDoanhThu] = useState();
    const [thongKePhong, setThongKePhong] = useState();

    const fetchData = useCallback(async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            // Fetch DayNhaTros
            const dayResult = await getDayNhaTrosApi(currentUser.maNd);
            if (dayResult.success) {
                setDayNhaTros(dayResult.data);
            }

            // Fetch DoanhThu
            const doanhThuResult = await getDoanhThuApi(currentUser.maNd);
            if (doanhThuResult.success) {
                setDoanhThu(doanhThuResult.data);
            }

            // Fetch ThongKePhong
            const thongKeResult = await getThongKePhongApi(currentUser.maNd);
            if (thongKeResult.success) {
                setThongKePhong(thongKeResult.data);
            }
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Chào buổi sáng 👋</Text>
                    <Text style={styles.name}>{user?.hoTen}</Text>
                </View>

                <TouchableOpacity
                    style={styles.notificationBtn}
                    onPress={() => navigation.navigate("ThongBao")}
                >
                    <MaterialIcons name="notifications" size={24} color={COLORS.primary} />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* REVENUE CARD */}
                <LinearGradient
                    colors={[COLORS.primaryLight, COLORS.primary]}
                    style={styles.revenueCard}
                >
                    <Text style={styles.cardLabel}>Doanh thu tháng {new Date().getMonth() + 1}</Text>

                    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                        <Text style={styles.revenue}>{formatCurrency(doanhThu?.tongTien || 0)}</Text>
                        <Text style={styles.currency}>đ</Text>
                    </View>

                    <View style={styles.trend}>
                        <MaterialIcons name="trending-up" size={14} color="#4ade80" />
                        <Text style={styles.trendText}> +{doanhThu?.tyLeTangTruong || 0}% so với tháng trước</Text>
                    </View>
                </LinearGradient>

                {/* ROOM STATUS */}
                <View style={styles.card}>

                    <Text style={styles.cardTitle}>
                        Trạng thái phòng
                    </Text>

                    <View style={{ flexDirection: "row", alignItems: "center" }}>

                        {/* CHART */}
                        <View style={{ width: 100, height: 100 }}>

                            <Svg width="100" height="100" viewBox="0 0 36 36">
                                <Circle
                                    cx="18"
                                    cy="18"
                                    r="15.915"
                                    stroke="#475569"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                />

                                <Circle
                                    cx="18"
                                    cy="18"
                                    r="15.915"
                                    stroke="#10b981"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    strokeDasharray="76 24"
                                />

                                <Circle
                                    cx="18"
                                    cy="18"
                                    r="15.915"
                                    stroke="#f59e0b"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    strokeDasharray="12 88"
                                    strokeDashoffset="-76"
                                />

                                <Circle
                                    cx="18"
                                    cy="18"
                                    r="15.915"
                                    stroke="#ef4444"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    strokeDasharray="8 92"
                                    strokeDashoffset="-88"
                                />

                            </Svg>

                            <View style={styles.chartCenter}>
                                <Text style={styles.chartNumber}>{thongKePhong?.tongSoPhong || 0}</Text>
                                <Text style={styles.chartLabel}>PHÒNG</Text>
                            </View>

                        </View>

                        {/* LEGEND */}
                        <View style={{ marginLeft: 20, flex: 1 }}>
                            {
                                thongKePhong?.thongKeTrangThai.map((item, index) => (
                                    legend(index, item.tenTrangThai, item.soLuong, item.mauSac)
                                ))
                            }
                        </View>
                    </View>

                </View>

                {/* QUICK ACTIONS */}
                <Text style={styles.sectionTitle}>Lối tắt nhanh</Text>

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Bill", { screen: "GhiDienNuoc", params: { id: null } })}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="add-home" size={26} color={COLORS.primary} />
                        </View>
                        <Text style={styles.actionText}>Ghi Điện/Nước</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="receipt-long" size={26} color="#4ade80" />
                        </View>
                        <Text style={styles.actionText}>Tạo hóa đơn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("Contract", { screen: "TaoHopDongB1", params: { id: null } })}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="bolt" size={26} color="#facc15" />
                        </View>
                        <Text style={styles.actionText}>Tạo hợp đồng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("BaoCaoSuCo")}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="warning" size={26} color="#ef4444" />
                        </View>
                        <Text style={styles.actionText}>Sự cố</Text>
                    </TouchableOpacity>
                </View>


                {/* PROPERTY LIST */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitleHeader}>Danh sách dãy trọ</Text>
                    <Text style={styles.viewAll} onPress={() => navigation.navigate("PropertyDetail")}>Xem tất cả</Text>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {dayNhaTros.map((item) => (
                        <PropertyCard
                            key={item?.maDayNt}
                            name={`Nhà trọ Xanh ${item?.tenDayNt}`}
                            address={item?.diaChi}
                            image={item?.urlAnh}
                            fillPercent={item?.tyLeLapDay}
                            roomCount={item?.slphong}
                            onPress={() => navigation.navigate("ChiTietDayTro", { id: item?.maDayNt })}
                        />
                    ))}

                </ScrollView>


                <View style={{ height: 100 }} />

            </ScrollView>
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    greeting: {
        color: COLORS.textMuted,
        fontSize: 13,
        marginBottom: 5,
    },

    name: {
        color: COLORS.textMain,
        fontSize: 22,
        fontWeight: "bold",
    },

    notificationBtn: {
        padding: 10,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    notificationDot: {
        width: 8,
        height: 8,
        backgroundColor: COLORS.danger,
        borderRadius: 4,
        position: "absolute",
        top: 6,
        right: 6,
    },

    revenueCard: {
        marginVertical: 20,
        padding: 20,
        borderRadius: 16,
    },

    cardLabel: {
        color: COLORS.textMain,
        fontSize: 13,
    },

    revenue: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.textMain,
    },

    currency: {
        color: COLORS.primary,
        marginLeft: 5,
    },

    trend: {
        flexDirection: "row",
        marginTop: 10,
    },

    trendText: {
        color: "#4ade80",
    },

    statsRow: {
        flexDirection: "row",
        gap: 10,
    },

    statCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 12,
    },

    statLabel: {
        color: COLORS.textMain,
        fontSize: 12,
        marginTop: 5,
    },

    statValue: {
        color: COLORS.textMuted,
        fontSize: 18,
        fontWeight: "bold",
    },

    statSub: {
        color: COLORS.textMuted,
        fontSize: 13,
    },

    sectionTitle: {
        color: COLORS.textMain,
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 5,
        marginLeft: 5,
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 15,
    },

    actionBtn: {
        alignItems: "center",
    },

    actionIcon: {
        backgroundColor: COLORS.card,
        padding: 15,
        borderRadius: 16,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    actionText: {
        color: COLORS.textMuted,
        fontSize: 11,
        marginTop: 5,
        textAlign: "center",
    },

    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 20,
    },
    sectionTitleHeader: {
        color: COLORS.textMain,
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 5,
    },
    viewAll: {
        color: COLORS.primary,
    },

    fillText: {
        color: COLORS.primary,
        marginTop: 10,
    },

    progress: {
        height: 6,
        backgroundColor: "#333",
        borderRadius: 3,
        marginTop: 5,
    },
    card: {
        backgroundColor: COLORS.card,
        marginBottom: 16,
        padding: 16,
        borderRadius: 14,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    cardTitle: {
        color: COLORS.textMain,
        marginBottom: 10
    },

    chartCenter: {
        position: "absolute",
        top: 30,
        left: 30,
        alignItems: "center"
    },

    chartNumber: {
        color: COLORS.textMain,
        fontWeight: "bold",
        fontSize: 16
    },

    chartLabel: {
        color: COLORS.textMuted,
        fontSize: 10
    },
});
