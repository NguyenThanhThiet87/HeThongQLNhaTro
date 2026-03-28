import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getHopDongApi } from "../../../api/HopDong.js";
import { formatCurrency } from "../../../utils/formatCurrency.js";
import { getMonthDiff } from "../../../utils/formatNgaySinh.js";

import { InfoCard } from "../../../components/InfoCard.jsx";
import { InfoRow } from "../../../components/InfoRow.jsx";
import AppHeader from "../../../components/AppHeader.jsx";

const PRIMARY = "#13c8ec";
const BG = "#f8fafc";
const CARD = "#ffffff";
const BORDER = "#e2e8f0";
const TEXT2 = "#94a3b8";

export default function XemChiTietHopDongScreen({ route }) {
    const navigation = useNavigation();
    const { maHopDong } = route.params;
    const [hopDong, setHopDong] = useState(null); // Nhận đối tượng hopDong từ navigation params
    console.log("Mã hợp đồng nhận được:", maHopDong);

    const fetchData = async () => {
        const response = await getHopDongApi(maHopDong);
        if (response.success) {
            setHopDong(response.data);
            console.log("Chi tiết hợp đồng:", response.data);
        } else {
            console.error("Lỗi từ API:", response.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (maNt) => {
        setSelectedMaNt(maNt);
        setShowDeleteModal(true);
    }

    return (

        <View style={styles.container}>

            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: "#0f172a" }]}>Thông Tin hợp đồng</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color="#0f172a" />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            {/* CONTENT */}
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >
                {/* CARD INFO */}
                <InfoCard title="THÔNG TIN HỢP ĐỒNG">
                    <View style={styles.rowBetween}>
                        <View>
                            <Text style={styles.labelPrimary}>
                                Mã hợp đồng
                            </Text>

                            <Text style={styles.contractCode}>
                                #{hopDong?.maHopDong}
                            </Text>

                        </View>

                        <View style={{ alignItems: "flex-end" }}>

                            <Text style={styles.label}>
                                Trạng thái
                            </Text>

                            <View style={styles.badgeGreen}>
                                <Text style={styles.badgeGreenText}>
                                    {hopDong?.tenTrangThaiHopDong}
                                </Text>
                            </View>
                        </View>

                    </View>
                    <View style={styles.grid}>
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View>
                                <Text style={styles.label}>Phòng</Text>
                                <Text style={styles.value}>{hopDong?.soPhong} - {hopDong?.tenDayNhaTro}</Text>
                            </View>

                            <View>
                                <Text style={styles.label}>Chủ sở hữu</Text>
                                <Text style={styles.value}>{hopDong?.tenChuNhaTro || "Nguyễn Văn Chủ"}</Text>
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }}>

                            <Text style={styles.label}>
                                Người đại diện ký
                            </Text>

                            <TouchableOpacity style={styles.row}>
                                <Image
                                    source={{
                                        uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYDCAkAa6waKneRhyWrugXwVu-y5ZhEdqoPimHHXiXcZZvagi3UqAYz5Y2q2PHbKOzGFluzxve0v_xxTWQZHZn77bU6kHjrCney7MEEocvn0Aa8ojW0S9LzttiGGkpBksy0o436EaJQ3OQ7pn8x9eehySehQZf8oYWFq-WoOMaewVvJch3LNJl1X9-9AuiMIsec2McDsMUFDtq6LCBQfftGjjvaEo57KTVH5ed5Kdoq1fjZGjG2mLfJH-dR_2ayXolUbGQrEgke9E"
                                    }}
                                    style={styles.avatarSmall}
                                />

                                <Text style={styles.primaryText}>
                                    {hopDong?.hopDongNguoiThues?.[0]?.hoTenNguoiThue}
                                </Text>

                                <MaterialIcons name="arrow-forward" size={16} color="#22c55e" />
                            </TouchableOpacity>

                        </View>

                    </View>
                </InfoCard>

                {/* TIME */}
                <InfoCard title="THỜI HẠN HỢP ĐỒNG">
                    <View style={[styles.rowBetween, { paddingBottom: 10 }]}>

                        <View style={styles.center}>
                            <Text style={styles.label}>
                                Ngày bắt đầu
                            </Text>
                            <Text style={styles.value}>
                                {hopDong?.ngayBdhl}
                            </Text>
                        </View>

                        <View style={styles.progressContainer}>

                            <View style={styles.progressBg}>
                                <View style={styles.progressFill} />
                            </View>

                            <Text style={styles.progressText}>
                                {getMonthDiff(hopDong?.ngayBdhl, hopDong?.ngayKthl)} tháng
                            </Text>

                        </View>


                        <View style={styles.center}>
                            <Text style={styles.label}>
                                Ngày kết thúc
                            </Text>
                            <Text style={styles.value}>
                                {hopDong?.ngayKthl}
                            </Text>
                        </View>
                    </View>
                </InfoCard>

                {/* FINANCE */}
                <InfoCard title="THÔNG TIN TÀI CHÍNH">
                    <InfoRow label="Giá thuê phòng" value={`${formatCurrency(hopDong?.giaThue)} đ/tháng` || "Chưa cập nhật"} />
                    <InfoRow label="Đơn giá điện" value={`${formatCurrency(hopDong?.giaDien)} đ/${hopDong?.donViDien}` || "Chưa cập nhật"} />
                    <InfoRow label="Đơn giá nước" value={`${formatCurrency(hopDong?.giaNuoc)} đ/${hopDong?.donViNuoc}` || "Chưa cập nhật"} />
                    <InfoRow label="Tiền cọc" value={`${formatCurrency(hopDong?.tienDatCoc)} đ` || "Chưa cập nhật"} />
                </InfoCard>

                {/* MEMBERS */}
                <InfoCard title="THÀNH VIÊN CÙNG PHÒNG">
                    <View style={styles.rowBetween}>
                    </View>
                    {
                        hopDong?.hopDongNguoiThues?.length > 1 ? (
                            hopDong?.hopDongNguoiThues?.map((m, i) => {
                                if (i === 0) return null; // Bỏ qua người đại diện ký hợp đồng
                                return (
                                    <TouchableOpacity key={i} style={styles.member}>

                                        <View style={styles.row}>
                                            <Image
                                                source={{ uri: "https://i.pravatar.cc/150?img=" + (i + 10) }}
                                                style={styles.avatar}
                                            />

                                            <View>
                                                <Text style={styles.memberName}>{m.hoTenNguoiThue}</Text>
                                                <Text style={styles.memberPhone}>{m.soDtNguoiThue}</Text>
                                            </View>

                                        </View>

                                    </TouchableOpacity>
                                );
                            })) :
                            (
                                <Text style={{ color: TEXT2, fontStyle: "italic", textAlign: "center", margin: 20 }}>
                                    Chưa có thành viên nào khác ngoài người đại diện ký hợp đồng
                                </Text>
                            )
                    }
                </InfoCard>

            </ScrollView>
        </View>

    );
}



const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    card: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 14
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        paddingBottom: 0
    },

    grid: {
        marginTop: 12,
        gap: 8,
        padding: 15,
    },

    label: {
        fontSize: 12,
        color: TEXT2,
        marginBottom: 10
    },

    labelPrimary: {
        fontSize: 12,
        color: PRIMARY,
        fontWeight: "600"
    },

    contractCode: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f172a" // Đổi từ #fff sang màu đậm
    },

    value: {
        color: "#0f172a", // Đổi từ #fff sang màu đậm
        fontWeight: "bold"
    },

    primaryText: {
        color: PRIMARY,
        fontWeight: "bold"
    },

    badgeGreen: {
        backgroundColor: "rgba(16,185,129,0.2)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 4
    },

    badgeGreenText: {
        color: "#22c55e",
        fontWeight: "bold",
        fontSize: 12
    },

    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10
    },

    sectionTitle: {
        color: "#0f172a", // Đổi từ #fff sang màu đậm
        fontWeight: "bold"
    },

    progressContainer: {
        flex: 1,
        alignItems: "center"
    },

    progressBg: {
        width: "80%",
        height: 4,
        backgroundColor: "rgba(19,200,236,0.2)",
        borderRadius: 10
    },

    progressFill: {
        width: "65%",
        height: 4,
        backgroundColor: PRIMARY
    },

    progressText: {
        color: PRIMARY,
        fontSize: 10,
        marginTop: 4
    },

    financeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6
    },

    financeLabel: {
        color: "#cbd5e1"
    },

    financeValue: {
        color: "#0f172a", // Đổi từ #fff sang màu đậm
        fontWeight: "bold"
    },

    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "rgba(19,200,236,0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    addText: {
        color: PRIMARY,
        fontWeight: "bold",
        fontSize: 12
    },

    member: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: CARD,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER,
        margin: 10
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20
    },

    avatarSmall: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 6
    },

    memberName: {
        color: "#0f172a", // Đổi từ #fff sang màu đậm
        fontWeight: "bold"
    },

    memberPhone: {
        color: TEXT2,
        fontSize: 12
    },

    buttonGrid: {
        gap: 10,
        marginTop: 10
    },

    btn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: CARD,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: BORDER
    },

    btnText: {
        color: "#334155", // Đổi từ #e2e8f0 hoặc #fff sang màu đậm
        fontWeight: "600"
    },

    btnDelete: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        backgroundColor: "rgba(239,68,68,0.1)",
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(239,68,68,0.3)"
    },

    deleteText: {
        color: "#ef4444",
        fontWeight: "bold"
    },

    nav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: BG,
        borderTopWidth: 1,
        borderColor: BORDER,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    navItem: {
        alignItems: "center"
    },

    navText: {
        fontSize: 11,
        color: "#64748b"
    },

    center: {
        alignItems: "center"
    }
});