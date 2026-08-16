import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme.js";

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
import ActionConfirmModal from "../../../components/ActionConfirmModal.jsx";
import LoadingOverlay from "../../../components/LoadingOverlay.jsx";
import AppHeader from "../../../components/AppHeader.jsx";
import toast from "../../../utils/toast.js";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography.js";

import { deleteThanhVienHopDongApi, huyHopDongApi } from "../../../api/HopDong.js";
import { TRANG_THAI_HOP_DONG, getColorTrangThaiHopDong } from "../../../constants/TRANG_THAI_HOP_DONG.js";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#16292d";
const BORDER = "rgba(19,200,236,0.1)";
const TEXT2 = "#94a3b8";

export default function ChiTietHopDongScreen({ route }) {

    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

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

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedMaNt, setSelectedMaNt] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleCancelContract = async () => {
        setLoading(true);
        const result = await huyHopDongApi(maHopDong);
        if (result.success) {
            toast.success("Hủy hợp đồng thành công. Trạng thái phòng và tài khoản đã được cập nhật.");
            navigation.goBack(); // Quay lại sau khi hủy thành công
        } else {
            toast.error("Hủy hợp đồng thất bại: " + result.message);
        }
        setShowCancelModal(false);
        setLoading(false);
    }

    const handleDelete = (maNt) => {
        setSelectedMaNt(maNt);
        setShowDeleteModal(true);
    }

    const handleConfirmDelete = async (maNt) => {
        // Gọi API xóa loại phòng ở đây
        setLoading(true);
        const result = await deleteThanhVienHopDongApi(maHopDong, maNt);
        if (result.success) {
            toast.success("Xóa thành viên hợp đồng thành công");
            fetchData(); // Tải lại dữ liệu hợp đồng sau khi xóa thành viên
        } else {
            toast.error("Xóa thành viên hợp đồng thất bại");
        }
        setShowDeleteModal(false);
        setLoading(false);
    }

    return (

        <View style={styles.container}>

            {/* HEADER */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={18} color={COLORS.textMain} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={styles.headerTitle}>
                        Chi tiết Hợp đồng
                    </Text>
                }
                right={
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialIcons name="more-vert" size={22} color={PRIMARY} />
                    </TouchableOpacity>
                }
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
                                #{hopDong?.maHopDong || "HĐ #2023-XXX"}
                            </Text>

                        </View>

                        <View style={{ alignItems: "flex-end" }}>

                            <Text style={styles.label}>
                                Trạng thái
                            </Text>

                            <View style={[styles.badgeGeneric, { backgroundColor: `${getColorTrangThaiHopDong(hopDong?.maTthopDong)}20` }]}>
                                <Text style={[styles.badgeGenericText, { color: getColorTrangThaiHopDong(hopDong?.maTthopDong) }]}>
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
                                        uri: hopDong?.hopDongNguoiThues?.[0]?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDYDCAkAa6waKneRhyWrugXwVu-y5ZhEdqoPimHHXiXcZZvagi3UqAYz5Y2q2PHbKOzGFluzxve0v_xxTWQZHZn77bU6kHjrCney7MEEocvn0Aa8ojW0S9LzttiGGkpBksy0o436EaJQ3OQ7pn8x9eehySehQZf8oYWFq-WoOMaewVvJch3LNJl1X9-9AuiMIsec2McDsMUFDtq6LCBQfftGjjvaEo57KTVH5ed5Kdoq1fjZGjG2mLfJH-dR_2ayXolUbGQrEgke9E"
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
                    {
                        hopDong?.maTthopDong == TRANG_THAI_HOP_DONG.DANG_HIEU_LUC ? (
                            <View style={styles.rowBetween}>
                                <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate("ThemThanhVien", { maHopDong, soPhong: hopDong?.soPhong })}>
                                    <MaterialIcons name="add" size={16} color={PRIMARY} />
                                    <Text style={styles.addText}>Thêm</Text>
                                </TouchableOpacity>
                            </View>) : null
                    }
                    {
                        hopDong?.hopDongNguoiThues?.length > 1 ? (
                            hopDong?.hopDongNguoiThues?.map((m, i) => {
                                if (i === 0) return null; // Bỏ qua người đại diện ký hợp đồng
                                return (
                                    <TouchableOpacity key={i} style={styles.member} onPress={() => navigation.navigate("HoSo", { maNd: m.maNt })}>

                                        <View style={styles.row}>
                                            <Image
                                                source={{ uri: m.avatar || "https://i.pravatar.cc/300" }}
                                                style={styles.avatar}
                                            />

                                            <View>
                                                <Text style={styles.memberName}>{m.hoTenNguoiThue}</Text>
                                                <Text style={styles.memberPhone}>{m.soDtNguoiThue}</Text>
                                            </View>

                                        </View>
                                        {
                                            hopDong?.maTthopDong == TRANG_THAI_HOP_DONG.DANG_HIEU_LUC ? (
                                                <TouchableOpacity onPress={() => handleDelete(m.maNt)}>
                                                    <MaterialIcons name="delete-outline" size={20} color="#64748b" />
                                                </TouchableOpacity>
                                            ) : null
                                        }


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
                    {
                        (() => {
                            const isContractActive = hopDong?.maTthopDong == TRANG_THAI_HOP_DONG.DANG_HIEU_LUC;
                            return (
                                <>
                                    <TouchableOpacity style={[styles.btn, !isContractActive && styles.btnDisabled]} disabled={!isContractActive}>
                                        <MaterialIcons name="edit-note" size={18} color={isContractActive ? "#cbd5e1" : "#64748b"} />
                                        <Text style={[styles.btnText, !isContractActive && { color: "#64748b" }]}>Sửa hợp đồng</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.btnDelete, !isContractActive && styles.btnDeleteDisabled]}
                                        onPress={() => setShowCancelModal(true)}
                                        disabled={!isContractActive}
                                    >
                                        <MaterialIcons name="delete-forever" size={18} color={isContractActive ? "#ef4444" : "#64748b"} />
                                        <Text style={[styles.deleteText, !isContractActive && { color: "#64748b" }]}>Hủy hợp đồng</Text>
                                    </TouchableOpacity>
                                </>
                            )
                        })()
                    }
                </View>

            </ScrollView>
            <ActionConfirmModal
                visible={showDeleteModal}
                type="delete"
                title="Xóa thành viên này?"
                message="Hành động này không thể hoàn tác."
                requiredText="destroy"
                yesText="Xóa"
                noText="Hủy"
                onNo={() => setShowDeleteModal(false)}
                onYes={async () => {
                    handleConfirmDelete(selectedMaNt);
                }}
            />
            <ActionConfirmModal
                visible={showCancelModal}
                type="delete"
                title="Hủy hợp đồng này?"
                message="Trạng thái phòng sẽ chuyển sang Trống và các tài khoản thành viên liên kết sẽ bị ngừng kích hoạt. Hành động này không thể hoàn tác."
                requiredText="destroy"
                yesText="Xác nhận Hủy"
                noText="Quay lại"
                onNo={() => setShowCancelModal(false)}
                onYes={handleCancelContract}
            />
            <LoadingOverlay visible={loading} />
        </View>

    );
}

const createStyles = (COLORS) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight
    },

    headerTitle: {
        color: COLORS.textMain,
        fontSize: FONT_SIZES.header,
        fontWeight: FONT_WEIGHTS.bold,
    },

    iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: COLORS.border,
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
        fontSize: FONT_SIZES.caption,
        color: COLORS.textMain,
        marginBottom: 10
    },

    labelPrimary: {
        fontSize: FONT_SIZES.caption,
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.semiBold,
    },

    contractCode: {
        fontSize: FONT_SIZES.section,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.textMain
    },

    value: {
        color: COLORS.textMain,
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.body,
    },

    primaryText: {
        color: COLORS.primary,
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.body,
    },

    badgeGeneric: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 4
    },

    badgeGenericText: {
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.caption,
    },

    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 10
    },

    sectionTitle: {
        color: COLORS.textMain,
        fontWeight: FONT_WEIGHTS.bold,
        fontSize: FONT_SIZES.bodyLarge,
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
        color: COLORS.textMuted
    },

    financeValue: {
        color: COLORS.textMain,
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
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 12
    },

    member: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
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
        color: COLORS.textMain,
        fontWeight: "bold"
    },

    memberPhone: {
        color: COLORS.textMuted,
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
        backgroundColor: COLORS.card,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    btnText: {
        color: COLORS.textMuted,
        fontWeight: "600"
    },

    btnDisabled: {
        opacity: 0.5,
        borderColor: COLORS.border,
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

    btnDeleteDisabled: {
        backgroundColor: "rgba(148,163,184,0.05)",
        borderColor: "rgba(148,163,184,0.1)",
        opacity: 0.6,
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
