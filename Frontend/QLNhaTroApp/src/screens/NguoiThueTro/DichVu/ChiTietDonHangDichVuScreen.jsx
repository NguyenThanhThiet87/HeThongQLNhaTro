import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Alert,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getDonHangByIdApi, updateOrderStatusApi } from '../../../api/DonHang';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { formatDate } from '../../../utils/formatNgaySinh';

const COLORS = {
    primary: "#2563eb",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    bgLight: "#f8fafc",
    card: "#ffffff",
    textMain: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
};

const STATUS_CONFIG = {
    "Mới": { color: COLORS.info, icon: "fiber-new", label: "Chờ xác nhận" },
    "Đang xử lý": { color: COLORS.warning, icon: "sync", label: "Đang chuẩn bị" },
    "Đang giao": { color: COLORS.primary, icon: "local-shipping", label: "Đang giao hàng" },
    "Đã giao": { color: COLORS.info, icon: "hail", label: "Đã giao - Chờ bạn xác nhận" },
    "Đã hoàn thành": { color: COLORS.success, icon: "check-circle", label: "Đã nhận hàng" },
    "Đã hủy": { color: COLORS.danger, icon: "cancel", label: "Đơn đã hủy" },
};

const ChiTietDonHangDichVuScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params || {};

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const res = await getDonHangByIdApi(orderId);
            console.log("Order details:", res.data);
            if (res.success) {
                setOrder(res.data);
            }
        } catch (error) {
            console.error("Fetch order details error:", error);
            Alert.alert("Lỗi", "Không thể lấy thông tin đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        console.log("Attempting to update status to:", newStatus); // Debugging log
        const isCancel = newStatus === "Đã hủy";
        const title = isCancel ? "Hủy đơn hàng" : "Xác nhận";
        const message = isCancel
            ? "Bạn có chắc chắn muốn hủy đơn hàng này không?"
            : "Bạn xác nhận đã nhận được đơn hàng này?";

        Alert.alert(
            title,
            message,
            [
                { text: "Để sau", style: "cancel" },
                {
                    text: isCancel ? "Hủy đơn" : "Xác nhận",
                    style: isCancel ? "destructive" : "default",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const res = await updateOrderStatusApi(orderId, newStatus);
                            if (res.success) {
                                Alert.alert("Thành công", isCancel ? "Đã hủy đơn hàng thành công" : "Cập nhật trạng thái đơn hàng thành công");
                                fetchOrderDetails();
                            } else {
                                Alert.alert("Lỗi", res.message || "Không thể thực hiện yêu cầu");
                            }
                        } catch (error) {
                            console.error("Update status error:", error); // Debugging log
                            Alert.alert("Lỗi", "Không thể liên kết với máy chủ");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const statusConfig = React.useMemo(() => {
        return STATUS_CONFIG[order?.trangThaiDh] || { color: COLORS.textSecondary, icon: "help", label: "Không xác định" };
    }, [order?.trangThaiDh]);

    console.log("Current order status:", order?.trangThaiDh); // Debugging log

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={<Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>}
            />

            {
                order && (
                    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                        {/* Status Section */}
                        {order && (
                            <View style={styles.statusSection}>
                                <View style={[styles.statusIconContainer, { backgroundColor: statusConfig.color + '20' }]}>
                                    <MaterialIcons name={statusConfig.icon} size={40} color={statusConfig.color} />
                                </View>
                                <Text style={[styles.statusLabel, { color: statusConfig.color }]}>{statusConfig.label}</Text>
                                <Text style={styles.orderIdText}>Mã đơn hàng: #{order?.maDh}</Text>
                                <Text style={styles.orderTimeText}>Đặt lúc: {formatDate(order?.ngayDat)}</Text>
                            </View>
                        )}

                        {/* Tracking Progress (Simplified) */}
                        {order && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="person" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.infoText}>{order?.hoTen}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="phone" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.infoText}>{order?.soDt}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name="room" size={20} color={COLORS.textSecondary} />
                                    <Text style={styles.infoText}>Phòng {order?.thongTinPhong?.soPhong} - {order?.thongTinPhong?.tenDay}</Text>
                                </View>
                                {order?.ghiChu && (
                                    <View style={styles.noteBox}>
                                        <Text style={styles.noteTitle}>Ghi chú:</Text>
                                        <Text style={styles.noteContent}>{order?.ghiChu}</Text>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Items Section */}
                        {order && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Danh sách dịch vụ</Text>
                                {order?.chiTiet?.map((item, index) => (
                                    <View key={index} style={styles.itemRow}>
                                        <Image
                                            source={{ uri: item.hinhAnh || 'https://via.placeholder.com/100' }}
                                            style={styles.itemImage}
                                        />
                                        <View style={styles.itemInfo}>
                                            <Text style={styles.itemName}>{item.tenDv}</Text>
                                            <Text style={styles.itemQty}>x{item.soLuong}</Text>
                                        </View>
                                        <Text style={styles.itemPrice}>{item.thanhTien?.toLocaleString()}đ</Text>
                                    </View>
                                ))}
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                                    <Text style={styles.totalValue}>{order?.tongTien?.toLocaleString()}đ</Text>
                                </View>
                            </View>
                        )}

                        {/* Actions */}
                        {order?.trangThaiDh === "Đã giao" && (
                            <TouchableOpacity
                                style={styles.receiveBtn}
                                onPress={() => handleUpdateStatus("Đã hoàn thành")}
                            >
                                <MaterialIcons name="check-box" size={24} color="white" />
                                <Text style={styles.receiveBtnText}>Đã nhận được hàng</Text>
                            </TouchableOpacity>
                        )}

                        {order?.trangThaiDh === "Mới" && (
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => handleUpdateStatus("Đã hủy")}
                            >
                                <Text style={styles.cancelBtnText}>Hủy đơn hàng</Text>
                            </TouchableOpacity>
                        )}
                    </ScrollView>
                )
            }

            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    scrollContainer: { padding: 16 },

    statusSection: {
        alignItems: 'center',
        padding: 24,
        backgroundColor: COLORS.card,
        borderRadius: 24,
        marginBottom: 16,
    },
    statusIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusLabel: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    orderIdText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 4 },
    orderTimeText: { fontSize: 12, color: COLORS.textSecondary },

    section: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
    infoText: { fontSize: 14, color: COLORS.textMain },

    noteBox: {
        marginTop: 8,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    noteTitle: { fontSize: 13, fontWeight: 'bold', color: COLORS.textSecondary, marginBottom: 4 },
    noteContent: { fontSize: 13, color: COLORS.textMain, fontStyle: 'italic' },

    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemImage: { width: 50, height: 50, borderRadius: 10 },
    itemInfo: { flex: 1, marginLeft: 12 },
    itemName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
    itemQty: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    itemPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    totalLabel: { fontSize: 15, color: COLORS.textMain },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },

    receiveBtn: {
        backgroundColor: COLORS.success,
        flexDirection: 'row',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        marginBottom: 20,
    },
    receiveBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },

    cancelBtn: {
        height: 50,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.danger,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    cancelBtnText: { color: COLORS.danger, fontSize: 14, fontWeight: '600' },
});

export default ChiTietDonHangDichVuScreen;
