import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    Linking,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getDonHangByIdService, updateOrderStatusService } from '../../../services/donHangService';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { formatDate } from "../../../utils/formatNgaySinh";
import toast from '../../../utils/toast';

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    amber: '#d97706',
    amberLight: '#fef3c7',
    blue: '#2563eb',
    blueLight: '#dbeafe',
    green: '#10b981',
    greenLight: '#ecfdf5',
    red: '#ef4444',
    redLight: '#fef2f2',
};

const ChiTietDonHangScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params;

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrderDetail();
    }, [orderId]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        const res = await getDonHangByIdService(orderId);
        console.log("Order details:", res.data);
        if (res.success) {
            setOrder(res.data);
        } else {
            Alert.alert("Lỗi", res.message || "Không thể lấy thông tin đơn hàng", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        }
        setLoading(false);
    };

    const handleUpdateStatus = async (newStatus) => {
        Alert.alert(
            "Xác nhận",
            `Bạn có chắc muốn chuyển trạng thái đơn hàng sang "${newStatus}"?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const res = await updateOrderStatusService(orderId, newStatus);
                            if (res.success) {
                                Alert.alert("Thành công", "Cập nhật trạng thái thành công");
                                fetchOrderDetail();
                            } else {
                                Alert.alert("Lỗi", res.message || "Không thể cập nhật trạng thái");
                            }
                        } catch (error) {
                            Alert.alert("Lỗi", "Có lỗi xảy ra");
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleCall = () => {
        if (order?.soDt) {
            Linking.openURL(`tel:${order.soDt}`);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Mới': return { bg: COLORS.amberLight, text: COLORS.amber };
            case 'Đang xử lý': return { bg: COLORS.blueLight, text: COLORS.blue };
            case 'Đang giao': return { bg: COLORS.primaryLight, text: COLORS.primary };
            case 'Đã giao': return { bg: COLORS.blueLight, text: COLORS.blue };
            case 'Đã hoàn thành': return { bg: COLORS.greenLight, text: COLORS.green };
            case 'Đã hủy': return { bg: COLORS.redLight, text: COLORS.red };
            default: return { bg: COLORS.border, text: COLORS.textSecondary };
        }
    };

    if (loading && !order) return <LoadingOverlay visible={true} />;

    const statusStyle = getStatusColor(order?.trangThaiDh);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppHeader
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={<Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>}
                isDark={false}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Section */}
                <View style={styles.section}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.orderId}>#ORD-{order?.maDh}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                            <Text style={[styles.statusText, { color: statusStyle.text }]}>{order?.trangThaiDh}</Text>
                        </View>
                    </View>
                    <Text style={styles.orderDate}>Đặt lúc: {formatDate(order?.ngayDat)}</Text>
                </View>

                {/* Customer Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                    <View style={styles.customerCard}>
                        <View style={styles.customerInfo}>
                            <Text style={styles.customerName}>{order?.hoTen}</Text>
                            <Text style={styles.customerPhone}>{order?.soDt}</Text>
                            <Text style={styles.customerAddress}>
                                {order?.thongTinPhong?.tenDay} - Phòng {order?.thongTinPhong?.soPhong}
                            </Text>
                            <Text style={styles.customerAddress}>{order?.thongTinPhong?.diaChi}</Text>
                        </View>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Ionicons name="call" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Items Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Danh sách món</Text>
                    {order?.chiTiet?.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Image
                                source={{ uri: item.hinhAnh || 'https://via.placeholder.com/150' }}
                                style={styles.itemImg}
                            />
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemName}>{item.tenDv}</Text>
                                <Text style={styles.itemPrice}>{item.giaTien?.toLocaleString()}đ x {item.soLuong}</Text>
                            </View>
                            <Text style={styles.itemTotal}>{item.thanhTien?.toLocaleString()}đ</Text>
                        </View>
                    ))}

                    <View style={styles.divider} />

                    {order?.ghiChu && (
                        <View style={styles.noteBox}>
                            <Text style={styles.noteTitle}>Ghi chú:</Text>
                            <Text style={styles.noteText}>{order.ghiChu}</Text>
                        </View>
                    )}

                    <View style={styles.priceSummary}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tổng tiền hàng</Text>
                            <Text style={styles.summaryValue}>{order?.tongTien?.toLocaleString()}đ</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, styles.totalLabel]}>Tổng cộng</Text>
                            <Text style={[styles.summaryValue, styles.totalValue]}>{order?.tongTien?.toLocaleString()}đ</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.footer}>
                {order?.trangThaiDh === 'Mới' && (
                    <View style={styles.footerRow}>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnOutline]}
                            onPress={() => handleUpdateStatus('Đã hủy')}
                        >
                            <Text style={styles.btnOutlineText}>Hủy đơn</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnPrimary]}
                            onPress={() => handleUpdateStatus('Đang xử lý')}
                        >
                            <Text style={styles.btnText}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {order?.trangThaiDh === 'Đang xử lý' && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary, { width: '100%' }]}
                        onPress={() => handleUpdateStatus('Đang giao')}
                    >
                        <Text style={styles.btnText}>Bắt đầu giao</Text>
                    </TouchableOpacity>
                )}

                {order?.trangThaiDh === 'Đang giao' && (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnPrimary, { width: '100%' }]}
                        onPress={() => handleUpdateStatus('Đã giao')}
                    >
                        <MaterialIcons name="done-all" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text style={styles.btnText}>Hoàn thành giao hàng</Text>
                    </TouchableOpacity>
                )}
            </View>

            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 16, paddingBottom: 100 },
    section: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    orderId: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    orderDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },

    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
    customerCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    customerInfo: { flex: 1 },
    customerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    customerPhone: { fontSize: 14, color: COLORS.textSecondary, marginVertical: 2 },
    customerAddress: { fontSize: 14, color: COLORS.textSecondary },
    callBtn: {
        backgroundColor: COLORS.primary,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },

    itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    itemImg: { width: 50, height: 50, borderRadius: 8 },
    itemInfo: { flex: 1, marginHorizontal: 12 },
    itemName: { fontSize: 14, fontWeight: '600', color: COLORS.textMain },
    itemPrice: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    itemTotal: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },

    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
    noteBox: { backgroundColor: COLORS.bgLight, padding: 10, borderRadius: 8, marginBottom: 16 },
    noteTitle: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 4 },
    noteText: { fontSize: 13, color: COLORS.textMain, fontStyle: 'italic' },

    priceSummary: { gap: 8 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
    summaryLabel: { fontSize: 14, color: COLORS.textSecondary },
    summaryValue: { fontSize: 14, color: COLORS.textMain },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    footerRow: { flexDirection: 'row', gap: 12 },
    btn: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    btnPrimary: { flex: 2, backgroundColor: COLORS.primary },
    btnOutline: { flex: 1, borderWidth: 1, borderColor: COLORS.red },
    btnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
    btnOutlineText: { color: COLORS.red, fontWeight: 'bold', fontSize: 16 },
});

export default ChiTietDonHangScreen;
