import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PRIMARY = "#13c8ec";
const BG = "#0a1113";
const CARD = "#1a2e32";
const NEUTRAL = "#16282c";

export default function LichSuDienNuocScreen() {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.back}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#aaa" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Lịch Sử Điện Nước</Text>

                <TouchableOpacity style={styles.searchBtn}>
                    <MaterialIcons name="search" size={22} color="#ccc" />
                </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
                <View style={styles.filterBox}>
                    <View>
                        <Text style={styles.filterLabel}>THÁNG/NĂM</Text>
                        <Text style={styles.filterValue}>10/2023</Text>
                    </View>
                    <MaterialIcons name="calendar-today" size={18} color="#888" />
                </View>

                <View style={styles.filterBox}>
                    <View>
                        <Text style={styles.filterLabel}>DÃY TRỌ</Text>
                        <Text style={styles.filterValue}>Tất cả</Text>
                    </View>
                    <MaterialIcons name="filter-list" size={18} color="#888" />
                </View>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 220 }}
            >
                <View style={{ padding: 16 }}>
                    <MeterItem
                        room="101"
                        name="Nguyễn Văn An"
                        contract="HD-001"
                        electric="1,325"
                        water="458"
                        total="1,450,000đ"
                    />

                    <MeterItem
                        room="102"
                        name="Lê Thị Bình"
                        contract="HD-002"
                        electric="2,110"
                        water="892"
                        total="2,320,000đ"
                    />

                    <MeterItem
                        room="103"
                        name="Trần Cảnh"
                        contract="HD-003"
                        electric="540"
                        water="125"
                        total="890,000đ"
                    />
                </View>
            </ScrollView>

            <BottomSection />
        </SafeAreaView>
    );
}
function MeterItem({ room, name, contract, electric, water, total }) {
    return (
        <View style={styles.card}>
            {/* Top Row */}
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={styles.roomBadge}>
                        <Text style={styles.roomText}>{room}</Text>
                    </View>

                    <View>
                        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                            <Text style={styles.name}>{name}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>ĐÃ CHỐT</Text>
                            </View>
                        </View>
                        <Text style={styles.contract}>Hợp đồng: {contract}</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.imageBtn}>
                    <MaterialIcons name="image" size={22} color="#777" />
                </TouchableOpacity>
            </View>

            {/* Electric + Water */}
            <View style={styles.meterBox}>
                <View style={{ flex: 1 }}>
                    <View style={styles.meterLabelRow}>
                        <MaterialIcons name="bolt" size={14} color="#facc15" />
                        <Text style={styles.meterLabel}>ĐIỆN (SỐ MỚI)</Text>
                    </View>
                    <Text style={styles.meterValue}>
                        {electric} <Text style={styles.unit}>kWh</Text>
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={{ flex: 1 }}>
                    <View style={styles.meterLabelRow}>
                        <MaterialIcons name="water-drop" size={14} color="#60a5fa" />
                        <Text style={styles.meterLabel}>NƯỚC (SỐ MỚI)</Text>
                    </View>
                    <Text style={styles.meterValue}>
                        {water} <Text style={styles.unit}>m³</Text>
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.cardFooter}>
                <Text style={styles.totalText}>
                    Tạm tính: <Text style={{ color: "#fff" }}>{total}</Text>
                </Text>
                <MaterialIcons name="chevron-right" size={18} color="#555" />
            </View>
        </View>
    );
}
function BottomSection() {
    return (
        <View style={styles.bottomContainer}>
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.exportBtn}>
                    <MaterialIcons name="description" size={18} color="#ccc" />
                    <Text style={styles.exportText}>Xuất báo cáo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.invoiceBtn}>
                    <MaterialIcons name="receipt-long" size={18} color="#000" />
                    <Text style={styles.invoiceText}>Tạo hóa đơn</Text>
                </TouchableOpacity>
            </View>
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
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff10",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: PRIMARY + "20",
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#fff",
    },

    searchBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: NEUTRAL,
        alignItems: "center",
        justifyContent: "center",
    },

    filterRow: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingBottom: 12,
        paddingTop: 8,
    },

    filterBox: {
        flex: 1,
        backgroundColor: NEUTRAL,
        borderRadius: 14,
        padding: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ffffff10",
    },

    filterLabel: {
        fontSize: 10,
        color: "#666",
        fontWeight: "bold",
    },

    filterValue: {
        color: PRIMARY,
        fontWeight: "600",
    },

    card: {
        backgroundColor: CARD,
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#ffffff10",
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    roomBadge: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: PRIMARY + "30",
        alignItems: "center",
        justifyContent: "center",
    },

    roomText: {
        color: PRIMARY,
        fontWeight: "bold",
        fontSize: 18,
    },

    name: { color: "#fff", fontWeight: "bold" },

    contract: { color: "#666", fontSize: 12 },

    statusBadge: {
        backgroundColor: "#22c55e20",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 999,
    },

    statusText: {
        fontSize: 10,
        color: "#22c55e",
        fontWeight: "bold",
    },

    imageBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ffffff10",
        alignItems: "center",
        justifyContent: "center",
    },

    meterBox: {
        flexDirection: "row",
        backgroundColor: "#00000040",
        borderRadius: 14,
        padding: 12,
        borderWidth: 1,
        borderColor: "#ffffff10",
    },

    meterLabelRow: {
        flexDirection: "row",
        gap: 4,
        alignItems: "center",
    },

    meterLabel: {
        fontSize: 10,
        color: "#aaa",
        fontWeight: "bold",
    },

    meterValue: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },

    unit: {
        fontSize: 10,
        color: "#777",
    },

    divider: {
        width: 1,
        backgroundColor: "#ffffff10",
        marginHorizontal: 12,
    },

    cardFooter: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    totalText: {
        fontSize: 12,
        color: "#aaa",
    },

    bottomContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: BG,
        borderTopWidth: 1,
        borderTopColor: "#ffffff10",
    },

    actionRow: {
        flexDirection: "row",
        gap: 12,
        padding: 10,
    },

    exportBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        padding: 12,
        borderRadius: 14,
        backgroundColor: "#ffffff10",
    },

    exportText: { color: "#aaa", fontWeight: "600" },

    invoiceBtn: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
        padding: 12,
        borderRadius: 14,
        backgroundColor: PRIMARY,
    },

    invoiceText: { color: "#000", fontWeight: "bold" },
});
