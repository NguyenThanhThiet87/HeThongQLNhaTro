import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/useTheme";
import { getPhongThietBiApi, getThietBisApi, updatePhongThietBiApi, updatePhongThietBiAllApi } from "../../../api/SuCo";
import AppHeader from "../../../components/AppHeader";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";

export default function PhongThietBiScreen({ route, navigation }) {
    const { maPhong, maDayNt } = route.params;
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const [thietBis, setThietBis] = useState([]);
    const [selected, setSelected] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedScope, setSelectedScope] = useState("room");

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Lấy toàn bộ thiết bị và thiết bị hiện tại của phòng
                const [resAll, resRoom] = await Promise.all([
                    getThietBisApi(),
                    getPhongThietBiApi(maPhong)
                ]);

                console.log("resAll", resAll)
                console.log("resRoom", resRoom)
                if (resAll.success) {
                    let allDevices = resAll.data;
                    const roomDeviceIds = (resRoom.data || []).map(d => d.maThBi);

                    // 2. Đánh dấu selected theo danh sách phòng đang có
                    const selectedMap = {};
                    allDevices.forEach(d => {
                        selectedMap[d.maThBi] = roomDeviceIds.includes(d.maThBi);
                    });

                    setThietBis(allDevices);
                    setSelected(selectedMap);
                }
            } catch (error) {
                console.error("Lỗi API thiết bị:", error);
            }
            setLoading(false);
        };
        loadData();
    }, [maPhong]);

    const handleToggle = (id) => {
        setSelected(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleSave = async () => {
        // 1. Lọc ra danh sách các thiết bị được chọn (true)
        const listSelectedDevices = Object.keys(selected).filter(key => selected[key]);

        console.log("Dữ liệu gửi lên Backend:", listSelectedDevices);

        try {
            setLoading(true);
            // 2. Gọi API để cập nhật
            let res;
            if (selectedScope === "room") {
                res = await updatePhongThietBiApi(maPhong, listSelectedDevices);
            } else {
                res = await updatePhongThietBiAllApi(maDayNt, listSelectedDevices);
            }

            if (res.success) {
                // Hiển thị thông báo và quay lại
                alert("Cập nhật thiết bị thành công!");
                navigation.goBack();
            } else {
                alert("Cập nhật thất bại: " + res.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            {/* Header */}
            <AppHeader
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <MaterialIcons name="arrow-back-ios" size={18} color={COLORS.textMain} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={styles.headerTitle}>Thiết bị phòng</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="more-vert" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                }
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.content}>
                    {/* Section: Chọn thiết bị */}
                    <Text style={styles.sectionLabel}>CUSTODIAN ACTIONS</Text>
                    <Text style={styles.sectionTitle}>Chọn thiết bị</Text>
                    <View style={{ height: 12 }} />

                    {thietBis.map((item) => (
                        <TouchableOpacity
                            key={item.maThBi}
                            style={[
                                styles.assetItem,
                                { borderColor: selected[item.maThBi] ? COLORS.primary : COLORS.border },
                            ]}
                            onPress={() => handleToggle(item.maThBi)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.assetIconBg, { backgroundColor: selected[item.maThBi] ? COLORS.primary + "15" : "#f1f5f9" }]}>
                                <MaterialIcons
                                    name={selected[item.maThBi] ? "check-circle" : "inventory-2"}
                                    size={28}
                                    color={selected[item.maThBi] ? COLORS.primary : "#94a3b8"}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.assetLabel}>{item.tenThBi}</Text>
                                <Text style={styles.assetSub}>Thiết bị hệ thống</Text>
                            </View>
                            <View style={[styles.checkbox, selected[item.maThBi] && styles.checkboxActive]}>
                                {selected[item.maThBi] && (
                                    <MaterialIcons name="check" size={20} color="#fff" />
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* Section: Áp dụng cho */}
                    <View style={{ height: 32 }} />
                    <Text style={styles.sectionLabel}>SCOPE SELECTION</Text>
                    <Text style={styles.sectionTitle}>Áp dụng cho</Text>
                    <View style={{ height: 12 }} />
                    <View style={styles.scopeRow}>
                        <TouchableOpacity
                            style={[
                                styles.scopeCard,
                                { borderColor: selectedScope === "room" ? COLORS.primary : COLORS.border }
                            ]}
                            onPress={() => setSelectedScope("room")}
                        >
                            <View style={styles.scopeCardTop}>
                                <MaterialIcons name="meeting-room" size={32} color={selectedScope === "room" ? COLORS.primary : COLORS.textMuted} />
                                {selectedScope === "room" ? (
                                    <View style={styles.scopeCheck}>
                                        <MaterialIcons name="check" size={18} color="#fff" />
                                    </View>
                                ) : (
                                    <View style={styles.scopeCheckEmpty} />
                                )}
                            </View>
                            <Text style={[styles.scopeTitle, { color: selectedScope === "room" ? COLORS.primary : COLORS.textMuted }]}>
                                Phòng hiện tại
                            </Text>
                            <Text style={styles.scopeSub}>Mã phòng: {maPhong}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.scopeCard,
                                { borderColor: selectedScope === "all" ? COLORS.primary : COLORS.border }
                            ]}
                            onPress={() => setSelectedScope("all")}
                        >
                            <View style={styles.scopeCardTop}>
                                <MaterialIcons name="domain" size={32} color={selectedScope === "all" ? COLORS.primary : COLORS.textMuted} />
                                {selectedScope === "all" ? (
                                    <View style={styles.scopeCheck}>
                                        <MaterialIcons name="check" size={18} color="#fff" />
                                    </View>
                                ) : (
                                    <View style={styles.scopeCheckEmpty} />
                                )}
                            </View>
                            <Text style={[styles.scopeTitle, { color: selectedScope === "all" ? COLORS.primary : COLORS.textMuted }]}>
                                Tất cả các phòng
                            </Text>
                            <Text style={styles.scopeSub}>Cùng dãy nhà</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Bottom Action */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleSave}>
                    <MaterialIcons name="published-with-changes" size={24} color="#fff" />
                    <Text style={styles.confirmText}>Xác nhận &amp; Cập nhật</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    iconBtn: { padding: 8 },
    headerTitle: { fontSize: FONT_SIZES.header, fontWeight: FONT_WEIGHTS.bold, color: COLORS.textMain },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    content: { padding: 16, paddingBottom: 120 },
    sectionLabel: { fontSize: 11, fontWeight: "700", color: COLORS.textMuted, letterSpacing: 1.5, marginBottom: 4 },
    sectionTitle: { fontSize: 22, fontWeight: "800", color: COLORS.primary, marginBottom: 16 },
    assetItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 10,
        borderWidth: 1,
    },
    assetIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
    },
    assetLabel: { fontSize: 16, fontWeight: "700", color: COLORS.textMain },
    assetSub: { fontSize: 12, color: COLORS.textMuted },
    checkbox: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
    },
    checkboxActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    scopeRow: { flexDirection: "row", gap: 16, marginTop: 8 },
    scopeCard: {
        flex: 1,
        backgroundColor: COLORS.card,
        borderRadius: 20,
        borderWidth: 2,
        padding: 18,
        alignItems: "flex-start",
    },
    scopeCardTop: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
    scopeCheck: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    scopeCheckEmpty: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.border,
    },
    scopeTitle: { fontSize: 16, fontWeight: "700", marginTop: 8 },
    scopeSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        padding: 16,
        backgroundColor: COLORS.card,
        borderTopWidth: 1,
        borderColor: COLORS.border,
    },
    confirmBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        height: 56,
        width: "100%",
        gap: 8,
    },
    confirmText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});