import React from "react";
import { useNavigation } from "@react-navigation/native";
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

const PRIMARY = "#13c8ec";
const BG_DARK = "#101f22";
const SURFACE = "#1a2c30";

export default function DashboardScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Chào buổi sáng 👋</Text>
                    <Text style={styles.name}>Nguyễn Văn A</Text>
                </View>

                <TouchableOpacity style={styles.notificationBtn}>
                    <MaterialIcons name="notifications" size={22} color="#ccc" />
                    <View style={styles.notificationDot} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

                {/* REVENUE CARD */}
                <LinearGradient
                    colors={["rgba(19,200,236,0.2)", "#1a2c30"]}
                    style={styles.revenueCard}
                >
                    <Text style={styles.cardLabel}>Doanh thu tháng 10</Text>

                    <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                        <Text style={styles.revenue}>35.000.000</Text>
                        <Text style={styles.currency}>đ</Text>
                    </View>

                    <View style={styles.trend}>
                        <MaterialIcons name="trending-up" size={14} color="#4ade80" />
                        <Text style={styles.trendText}> +12% so với tháng trước</Text>
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
                                <Text style={styles.chartNumber}>50</Text>
                                <Text style={styles.chartLabel}>PHÒNG</Text>
                            </View>

                        </View>

                        {/* LEGEND */}
                        <View style={{ marginLeft: 20, flex: 1 }}>

                            {legend("Đã đóng tiền", "38", "#10b981")}
                            {legend("Nợ tiền", "04", "#ef4444", true)}
                            {legend("Hết hạn/BT", "06", "#f59e0b")}
                            {legend("Phòng trống", "02", "#64748b")}

                        </View>

                    </View>

                </View>

                {/* QUICK ACTIONS */}
                <Text style={styles.sectionTitle}>Lối tắt nhanh</Text>

                <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("GhiDienNuoc")}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="add-home" size={26} color={PRIMARY} />
                        </View>
                        <Text style={styles.actionText}>Ghi Điện/Nước</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="receipt-long" size={26} color="#4ade80" />
                        </View>
                        <Text style={styles.actionText}>Tạo hóa đơn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                        <View style={styles.actionIcon}>
                            <MaterialIcons name="bolt" size={26} color="#facc15" />
                        </View>
                        <Text style={styles.actionText}>Tạo hợp đồng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
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
                    {[1, 2, 3].map((item) => (

                        <PropertyCard
                            key={item}
                            name={`Nhà trọ Xanh ${item}`}
                            address="123 Đường Láng, HN"
                            image="https://images.unsplash.com/photo-1568605114967-8130f3a36994"
                            fillPercent={90}
                            roomCount={12}
                            onPress={() => console.log("Open property", item)}
                        />

                    ))}

                </ScrollView>


                <View style={{ height: 100 }} />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: BG_DARK,
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    greeting: {
        color: "#888",
        fontSize: 13,
        marginBottom: 5,
    },

    name: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },

    notificationBtn: {
        padding: 10,
        backgroundColor: SURFACE,
        borderRadius: 20,
    },

    notificationDot: {
        width: 8,
        height: 8,
        backgroundColor: "red",
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
        color: "#aaa",
        fontSize: 13,
    },

    revenue: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },

    currency: {
        color: PRIMARY,
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
        backgroundColor: SURFACE,
        padding: 15,
        borderRadius: 12,
    },

    statLabel: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 5,
    },

    statValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    statSub: {
        color: "#888",
        fontSize: 13,
    },

    sectionTitle: {
        color: "#fff",
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
        backgroundColor: SURFACE,
        padding: 15,
        borderRadius: 16,
    },

    actionText: {
        color: "#ccc",
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
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 5,
    },
    viewAll: {
        color: PRIMARY,
    },

    fillText: {
        color: PRIMARY,
        marginTop: 10,
    },

    progress: {
        height: 6,
        backgroundColor: "#333",
        borderRadius: 3,
        marginTop: 5,
    },
    card: {
        backgroundColor: SURFACE,
        marginBottom: 16,
        padding: 16,
        borderRadius: 14
    },

    cardTitle: {
        color: "#cbd5e1",
        marginBottom: 10
    },

    chartCenter: {
        position: "absolute",
        top: 30,
        left: 30,
        alignItems: "center"
    },

    chartNumber: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },

    chartLabel: {
        color: "#64748b",
        fontSize: 10
    },
});
