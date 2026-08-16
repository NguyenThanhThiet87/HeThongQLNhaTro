import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "../../../components/AppHeader";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";

const PRIMARY = "#13c8ec";
const BG = "#0a1113";
const CARD = "#1a2e32";
const NEUTRAL = "#16282c";

export default function LichSuDienNuocScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <AppHeader
                left={
                    <TouchableOpacity
                        style={styles.back}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back-ios" size={18} color="#aaa" style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={styles.headerTitle}>Lịch Sử Điện Nước</Text>
                }
                right={
                    <TouchableOpacity style={styles.searchBtn}>
                        <MaterialIcons name="search" size={22} color="#ccc" />
                    </TouchableOpacity>
                }
            />
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
        </View>
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
                                <Text style={styles.statusText}>ĐÃ THU</Text>
                            </View>
                        </View>
                        <Text style={styles.subText}>{contract} • Hạn: 15/10</Text>
                    </View>
                </View>

                <TouchableOpacity>
                    <MaterialIcons name="edit" size={20} color="#888" />
                </TouchableOpacity>
            </View>

            {/* Indexes */}
            <View style={styles.indexRow}>
                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <MaterialIcons name="bolt" size={18} color={PRIMARY} />
                    <Text style={{ color: "#aaa" }}>
                        Điện: <Text style={{ color: "#fff" }}>{electric} kWh</Text>
                    </Text>
                </View>

                <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                    <MaterialIcons name="water-drop" size={18} color="#00e5ff" />
                    <Text style={{ color: "#aaa" }}>
                        Nước: <Text style={{ color: "#fff" }}>{water} m³</Text>
                    </Text>
                </View>
            </View>

            {/* Total */}
            <View style={styles.totalRow}>
                <Text style={{ color: "#888" }}>Tổng tiền</Text>
                <Text style={styles.totalText}>{total}</Text>
            </View>
        </View>
    );
}
function BottomSection() {
    return (
        <View style={styles.bottom}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                    <Text style={{ color: "#888", fontSize: FONT_SIZES.caption }}>TỔNG THU DỰ KIẾN</Text>
                    <Text style={styles.totalAll}>28,450,000đ</Text>
                </View>

                <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ color: "#888", fontSize: FONT_SIZES.caption }}>TIẾN ĐỘ THU</Text>
                    <Text style={{ color: PRIMARY, fontWeight: FONT_WEIGHTS.bold }}>18/20 Phòng</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.exportBtn}>
                <MaterialIcons name="file-download" size={20} color="#000" />
                <Text style={styles.exportText}>XUẤT BÁO CÁO (EXCEL)</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101f22",
    },

    headerTitle: {
        fontSize: FONT_SIZES.header,
        fontWeight: FONT_WEIGHTS.bold,
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
