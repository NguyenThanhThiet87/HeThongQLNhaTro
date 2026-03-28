import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    RefreshControl,
    Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getDonHangsByTenantApi } from '../../../api/DonHang';
import { useAuth } from '../../../context/AuthContext';
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
    "Mới": { color: COLORS.info, icon: "fiber-new" },
    "Đang xử lý": { color: COLORS.warning, icon: "sync" },
    "Đang giao": { color: COLORS.primary, icon: "local-shipping" },
    "Đã hoàn thành": { color: COLORS.success, icon: "check-circle" },
    "Đã hủy": { color: COLORS.danger, icon: "cancel" },
};

const LichSuDatDichVuScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const fetchOrders = async () => {
        try {
            const res = await getDonHangsByTenantApi(user.maNd);
            if (res.success) {
                const statusPriority = {
                    "Đang giao": 1,
                    "Đang xử lý": 2,
                    "Mới": 3,
                    "Đã hoàn thành": 4,
                    "Đã hủy": 5
                };

                const sortedOrders = res.data.sort((a, b) => {
                    const priorityA = statusPriority[a.trangThaiDh] || 10;
                    const priorityB = statusPriority[b.trangThaiDh] || 10;

                    if (priorityA !== priorityB) {
                        return priorityA - priorityB;
                    }
                    // Nếu cùng trạng thái, sắp xếp theo ngày mới nhất lên trên
                    return new Date(b.ngayDat) - new Date(a.ngayDat);
                });

                setOrders(sortedOrders);
            }
        } catch (error) {
            console.error("Fetch orders error:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const onRefresh = React.useCallback(() => {
        fetchOrders();
    }, [user?.maNd]);

    const renderOrderItem = React.useCallback(({ item }) => {
        const id = item.maDh || item.MaDh;
        const config = STATUS_CONFIG[item.trangThaiDh] || { color: COLORS.textSecondary, icon: "help" };

        return (
            <TouchableOpacity
                style={styles.orderCard}
                activeOpacity={0.7}
                onPress={() => {
                    console.log("Navigating to detail with ID:", id);
                    if (id) {
                        navigation.navigate("ChiTietDonHangDichVu", { orderId: id });
                    }
                }}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.orderMeta}>
                        <Text style={styles.orderId}>Đơn hàng #{id}</Text>
                        <Text style={styles.orderDate}>
                            {formatDate(item.ngayDat)}
                        </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.color + '20' }]}>
                        <MaterialIcons name={config.icon} size={14} color={config.color} />
                        <Text style={[styles.statusText, { color: config.color }]}>{item.trangThaiDh}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {item.chiTiet?.map((ct, idx) => (
                    <View key={idx} style={styles.serviceItem}>
                        <Image source={{ uri: ct.hinhAnh || 'https://via.placeholder.com/100' }} style={styles.serviceImage} />
                        <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{ct.tenDv}</Text>
                            <Text style={styles.nccName}>NCC: {ct.hoTenNcc}</Text>
                            <Text style={styles.quantityText}>Số lượng: {ct.soLuong}</Text>
                        </View>
                        <Text style={styles.itemPrice}>{ct.thanhTien?.toLocaleString()}đ</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.cardFooter}>
                    <Text style={styles.totalLabel}>Tổng cộng:</Text>
                    <Text style={styles.totalAmount}>{item.tongTien?.toLocaleString()}đ</Text>
                </View>
            </TouchableOpacity>
        );
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={<Text style={styles.headerTitle}>Lịch sử đặt dịch vụ</Text>}
            />

            <FlatList
                data={orders}
                renderItem={renderOrderItem}
                keyExtractor={(item, index) => (item.maDh || item.MaDh || index).toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="receipt-outline" size={80} color={COLORS.border} />
                            <Text style={styles.emptyText}>Bạn chưa có đơn hàng nào</Text>
                            <TouchableOpacity
                                style={styles.bookNowBtn}
                                onPress={() => navigation.navigate("DichVu")}
                            >
                                <Text style={styles.bookNowText}>Khám phá dịch vụ ngay</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            />

            <LoadingOverlay visible={loading && !refreshing} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    listContainer: { padding: 16, paddingBottom: 100 },
    orderCard: {
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
    orderId: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    orderDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 4 },
    statusText: { fontSize: 12, fontWeight: 'bold' },

    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },

    serviceItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    serviceImage: { width: 50, height: 50, borderRadius: 10 },
    serviceInfo: { flex: 1, marginLeft: 12 },
    serviceName: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },
    nccName: { fontSize: 11, color: COLORS.textSecondary, marginTop: 2 },
    quantityText: { fontSize: 11, color: COLORS.textSecondary },
    itemPrice: { fontSize: 14, fontWeight: 'bold', color: COLORS.textMain },

    cardFooter: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 8 },
    totalLabel: { fontSize: 14, color: COLORS.textSecondary },
    totalAmount: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

    emptyContainer: { alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, color: COLORS.textSecondary, marginTop: 12, marginBottom: 20 },
    bookNowBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    bookNowText: { color: 'white', fontWeight: 'bold' },
});

export default LichSuDatDichVuScreen;
