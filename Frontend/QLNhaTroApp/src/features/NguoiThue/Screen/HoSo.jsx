import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getNguoiThueApi } from '../../../api/NguoiDung';
import { getTenGioiTinhByValue } from '../../../constants/GIOI_TINH';
import { getTenTrangThaiHopDongByValue } from "../../../constants/TRANG_THAI_HOP_DONG";
import { getTenVaiTroNguoiThueByValue } from "../../../constants/VAI_TRO_NGUOI_THUE";

import { InfoCard } from '../../../components/InfoCard';
import { InfoRow } from '../../../components/InfoRow';

// Bảng màu từ Tailwind Config của bạn
const COLORS = {
    primary: '#13c8ec',
    backgroundDark: '#101f22',
    surfaceDark: '#1a2e32',
    danger: '#ff4d4f',
    textLight: '#f1f5f9',
    textMuted: '#94a3b8',
};
const PRIMARY = "#13c8ec";
const BORDER = "rgba(19,200,236,0.1)";

const HoSo = ({ route }) => {
    const { maNd } = route.params;
    const navigation = useNavigation();

    const [nguoiThue, setNguoiThue] = React.useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await getNguoiThueApi(maNd);
            if (response.success) {
                setNguoiThue(response.data);
                console.log("Thông tin người thuê:", response.data);
            } else {
                console.error("Lỗi khi lấy thông tin người thuê:", response.message);
            }
        }
        fetchData();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back-ios" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Hồ sơ người thuê
                </Text>

                <TouchableOpacity style={styles.iconBtn}>
                    <MaterialIcons name="more-vert" size={22} color={PRIMARY} />
                </TouchableOpacity>

            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Header */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarRing}>
                            <Image
                                source={{ uri: nguoiThue?.avatar || 'https://i.pravatar.cc/100' }}
                                style={styles.avatar}
                            />
                        </View>
                        <View style={styles.statusDot} />
                    </View>
                    <Text style={styles.userName}>{nguoiThue?.hoTen}</Text>
                    <Text style={styles.userRoom}>Phòng {nguoiThue?.soPhong} - Nhà trọ {nguoiThue?.dayNhaTro}</Text>
                </View>

                {/* Quick Actions */}
                <View style={styles.actionGrid}>
                    <ActionButton icon="chat-bubble" label="Nhắn tin" onHandle={()=> navigation.navigate("TinNhan")} />
                    <ActionButton icon="call" label="Gọi điện" />
                    <ActionButton icon="notifications" label="Thông báo" />
                </View>

                {/* Personal Info Card */}
                <InfoCard title="THÔNG TIN CÁ NHÂN">
                    <InfoRow label="Số điện thoại" value={nguoiThue?.soDt} />
                    <InfoRow label="Số CCCD" value={nguoiThue?.soCccd} />
                    <InfoRow label="Ngày sinh" value={nguoiThue?.ngaySinh} />
                    <InfoRow label="Giới tính" value={getTenGioiTinhByValue(nguoiThue?.gioiTinh)} />
                    <InfoRow label="Nghề nghiệp" value={nguoiThue?.ngheNghiep} />
                    <InfoRow label="Địa chỉ" value={nguoiThue?.diaChi} />
                </InfoCard>

                {/* Residency Info Card */}
                <InfoCard title="THÔNG TIN CƯ TRÚ">
                    <InfoRow label="Dãy trọ" value={nguoiThue?.dayNhaTro} />
                    <InfoRow
                        label="Số phòng"
                        value={nguoiThue?.soPhong}
                        highlight
                    />
                    <InfoRow label="Ngày vào ở" value={nguoiThue?.ngayVaoO} />
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Trạng thái</Text>
                        {
                            nguoiThue?.trangThaiTamTru ? (
                                <View style={styles.statusBadge}>
                                    <MaterialIcons name="verified" size={14} color="#22c55e" />
                                    <Text style={styles.statusText}>Đã đăng ký</Text>
                                </View>
                            ) : (
                                <View style={styles.statusBadge}>
                                    <MaterialIcons name="verified" size={14} color="#4b524e" />
                                    <Text style={styles.statusText}>Chưa đăng ký</Text>
                                </View>
                            )
                        }

                    </View>
                </InfoCard>

                <InfoCard title="LIÊN HỆ KHẨN CẤP">
                    <InfoRow label="Họ tên người thân" value={nguoiThue?.hoTenNguoiLienHe || "Chưa cập nhật"} />
                    <InfoRow label="Số điện thoại người thân" value={nguoiThue?.sdtNguoiLienHe || "Chưa cập nhật"} />
                    <InfoRow label="Quan hệ người thân" value={nguoiThue?.quanHeNguoiLienHe || "Chưa cập nhật"} />
                </InfoCard>

                {/* Document Preview */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>HỢP ĐỒNG THUÊ</Text>
                    <View style={styles.card}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Trạng thái hợp đồng</Text>
                            <Text style={styles.infoValue}>{getTenTrangThaiHopDongByValue(nguoiThue?.trangThaiHopDong) || "Chưa cập nhật"}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Vai trò</Text>
                            <Text style={styles.infoValue}>{getTenVaiTroNguoiThueByValue(nguoiThue?.vaiTroNguoiThue) || "Chưa cập nhật"}</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.infoRow, { display: "flex", flexDirection: "row", gap: "10", alignSelf: "flex-end", alignItems: "center", padding: 8 }]}
                            onPress={() => navigation.navigate("ChiTietHopDong", { maHopDong: nguoiThue?.maHopDong })}
                        >
                            <Text style={{ color: "#fff" }}>Xem chi tiết</Text>
                            <MaterialIcons name="arrow-forward-ios" size={15} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Administrative Actions */}
                <View style={styles.footerActions}>
                    <TouchableOpacity style={styles.btnEdit}>
                        <MaterialIcons name="edit" size={20} color={COLORS.backgroundDark} />
                        <Text style={styles.btnEditText}>Sửa thông tin hồ sơ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnDelete}>
                        <MaterialIcons name="person-remove" size={20} color={COLORS.danger} />
                        <Text style={styles.btnDeleteText}>Xóa người thuê này</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// --- Sub-components để code gọn hơn ---

const ActionButton = ({ icon, label, onHandle }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onHandle}>
        <MaterialIcons name={icon} size={24} color={COLORS.primary} />
        <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101f22"
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
    scrollContent: {
        paddingBottom: 100, // Space for tab bar
        paddingHorizontal: 16,
    },
    profileSection: {
        alignItems: 'center',
        marginVertical: 24,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: 'rgba(19, 200, 236, 0.2)',
        padding: 4,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    statusDot: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#22c55e',
        borderWidth: 3,
        borderColor: COLORS.backgroundDark,
    },
    userName: {
        color: COLORS.textLight,
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 12,
    },
    userRoom: {
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 4,
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    actionButton: {
        flex: 1,
        backgroundColor: 'rgba(19, 200, 236, 0.1)',
        marginHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    actionLabel: {
        color: COLORS.primary,
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginLeft: 4,
        marginBottom: 8,
    },
    card: {
        backgroundColor: COLORS.surfaceDark,
        borderRadius: 16,
        overflow: 'hidden',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(19, 200, 236, 0.05)',
    },
    infoLabel: {
        color: COLORS.textMuted,
    },
    infoValue: {
        color: COLORS.textLight,
        fontWeight: '500',
    },
    highlightBadge: {
        backgroundColor: 'rgba(19, 200, 236, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        color: '#22c55e',
        fontWeight: '600',
        marginLeft: 4,
    },
    documentGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    docImagePlaceholder: {
        flex: 1,
        aspectRatio: 1.58,
        backgroundColor: 'rgba(19, 200, 236, 0.05)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(19, 200, 236, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerActions: {
        marginTop: 20,
        gap: 12,
    },
    btnEdit: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    btnEditText: {
        color: COLORS.backgroundDark,
        fontWeight: 'bold',
        fontSize: 16,
    },
    btnDelete: {
        borderWidth: 2,
        borderColor: COLORS.danger,
        flexDirection: 'row',
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    btnDeleteText: {
        color: COLORS.danger,
        fontWeight: 'bold',
        fontSize: 16,
    },
    tabBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 80,
        backgroundColor: 'rgba(16, 31, 34, 0.95)',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: 'rgba(19, 200, 236, 0.1)',
    },
    tabItem: {
        alignItems: 'center',
    },
    tabLabel: {
        fontSize: 10,
        color: COLORS.textMuted,
        marginTop: 4,
    },
});

export default HoSo;