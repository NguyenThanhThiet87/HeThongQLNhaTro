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
import { getHopDongApi } from "../../../api/HopDong";
import {formatCurrency} from "../../../utils/formatCurrency";
import { getMonthDiff } from "../../../utils/formatNgaySinh";

import { InfoCard } from "../../../components/InfoCard";
import { InfoRow } from "../../../components/InfoRow";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#16292d";
const BORDER = "rgba(19,200,236,0.1)";
const TEXT2 = "#94a3b8";

export default function ChiTietHopDongScreen({ route }) {
    const navigation = useNavigation();
    const { maHopDong } = route.params;
    const [hopDong, setHopDong] = useState(null); // Nhận đối tượng hopDong từ navigation params
    console.log("Mã hợp đồng nhận được:", maHopDong);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getHopDongApi(maHopDong);
            if (response.success) {
                setHopDong(response.data);
                console.log("Chi tiết hợp đồng:", response.data);
            } else {
                console.error("Lỗi từ API:", response.message);
            }
        };
        fetchData();
    }, []);
    
    return (

        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Chi tiết Hợp đồng
                </Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="more-vert" size={22} color={PRIMARY} />
                </TouchableOpacity>

            </View>

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
                                #{hopDong?.maHopDong || "HĐ #2023-XXX"}
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

                            <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("HoSo", { maNd: hopDong?.hopDongNguoiThues?.[0]?.maNt })}>
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
                        <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("ThemThanhVien", { maHopDong, soPhong: hopDong?.soPhong })}>
                            <MaterialIcons name="add" size={16} color={PRIMARY} />
                            <Text style={styles.addText}>Thêm</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        hopDong?.hopDongNguoiThues?.length > 1 ? (
                            hopDong?.hopDongNguoiThues?.map((m, i) => {
                                if (i === 0) return null; // Bỏ qua người đại diện ký hợp đồng
                                return (
                                    <TouchableOpacity key={i} style={styles.member} onPress={() => navigation.navigate("HoSo", { maNd: m.maNt })}>

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

                                        <TouchableOpacity>
                                            <MaterialIcons name="delete-outline" size={20} color="#64748b" />
                                        </TouchableOpacity>

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

                {/* BUTTONS */}
                <View style={styles.buttonGrid}>

                    <TouchableOpacity style={styles.btn}>
                        <MaterialIcons name="edit-note" size={18} color="#cbd5e1" />
                        <Text style={styles.btnText}>Sửa hợp đồng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btn}>
                        <MaterialIcons name="image" size={18} color="#cbd5e1" />
                        <Text style={styles.btnText}>Ảnh hợp đồng</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnDelete}>
                        <MaterialIcons name="delete-forever" size={18} color="#ef4444" />
                        <Text style={styles.deleteText}>Xóa hợp đồng</Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>

        </View>

    );
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: BG
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingHorizontal: 10,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderColor: BORDER
    },

    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold"
    },

    iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    card: {
        backgroundColor: "#1a2e32",
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
        color: "#fff"
    },

    value: {
        color: "#fff",
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
        color: "#fff",
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
        color: "#fff",
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
        color: "#fff",
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
        color: "#e2e8f0",
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
