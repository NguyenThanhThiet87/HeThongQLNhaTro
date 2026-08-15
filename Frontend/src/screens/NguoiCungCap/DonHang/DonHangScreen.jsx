import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getTrangThaiDonHangService, getDonHangsByStatusService, updateOrderStatusService } from '../../../services/donHangService';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { formatDate } from "../../../utils/formatNgaySinh"
const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    bgDark: '#221610',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    amber: '#d97706',
    amberLight: '#fef3c7',
    blue: '#2563eb',
    blueLight: '#dbeafe',
};

const DonHangScreen = () => {
    const navigation = useNavigation();
    const { user } = useUserProviderProfile();
    const [statuses, setStatuses] = useState([]);
    const [activeTab, setActiveTab] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStatuses();
    }, []);

    const fetchStatuses = async () => {
        const res = await getTrangThaiDonHangService();
        if (res.success) {
            setStatuses(res.data);
            if (res.data.length > 0 && !activeTab) setActiveTab(res.data[0]);
        }
    };

    const fetchOrders = async () => {
        if (!user?.maNcc || !activeTab) return;
        setLoading(true);
        const res = await getDonHangsByStatusService(user.maNcc, activeTab);
        if (res.success) {
            setOrders(res.data);
        }
        setLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
            console.log(orders)
        }, [activeTab, user])
    );

    // Lắng nghe thông báo real-time để tự động cập nhật danh sách
    useEffect(() => {
        const subscription = DeviceEventEmitter.addListener("ON_NOTIFICATION_RECEIVED", (data) => {
            console.log("Order Screen received notification:", data);
            if (data.type === "NEW_ORDER") {
                // Nếu đang ở tab "Mới", tự động load lại danh sách
                if (activeTab === "Mới") {
                    fetchOrders();
                } else {
                    // Nếu ở tab khác, chuyển sang tab "Mới" để xem đơn mới nhất
                    setActiveTab("Mới");
                }
            }
        });

        return () => subscription.remove();
    }, [activeTab]);

    const OrderCard = ({ order }) => {
        const itemsSummary = order.chiTiet?.map(ct => `${ct.soLuong}x ${ct.tenDv}`).join(', ');

        const handleStatusUpdate = (newStatus) => {
            const actionText = newStatus === "Đã hủy" ? "từ chối" : "xác nhận";

            Alert.alert(
                "Xác nhận",
                `Bạn có chắc chắn muốn ${actionText} đơn hàng này không?`,
                [
                    { text: "Hủy", style: "cancel" },
                    {
                        text: "Đồng ý",
                        onPress: async () => {
                            setLoading(true);
                            try {
                                const res = await updateOrderStatusService(order.maDh, newStatus);
                                if (res.success) {
                                    Alert.alert("Thành công", `Đã ${actionText} đơn hàng #${order.maDh}`);
                                    fetchOrders();
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

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('ChiTietDonHang', { orderId: order.maDh })}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.orderIdText}>MÃ ĐH: #{order.maDh}</Text>
                    <View style={[styles.statusBadge, order.trangThaiDh === 'Mới' ? styles.badgeAmber : styles.badgeBlue]}>
                        <Text style={[styles.statusText, order.trangThaiDh === 'Mới' ? styles.textAmber : styles.textBlue]}>
                            {order.trangThaiDh}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    {order.chiTiet?.[0]?.hinhAnh ? (
                        <Image source={{ uri: order.chiTiet[0].hinhAnh }} style={styles.productImg} />
                    ) : (
                        <View style={styles.productImgPlaceholder}>
                            <MaterialIcons name="local-shipping" size={30} color={COLORS.textSecondary} />
                        </View>
                    )}
                    <View style={styles.productInfo}>
                        <Text style={styles.customerName}>{order.hoTen} - {order.soPhong || 'Khác'}</Text>
                        <Text style={styles.itemsText} numberOfLines={2}>{itemsSummary}</Text>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Ngày đặt: {formatDate(order.ngayDat)}</Text>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Tổng tiền:</Text>
                            <Text style={styles.priceValue}>{order.tongTien?.toLocaleString()}đ</Text>
                        </View>
                        {order.ghiChu && (
                            <View style={styles.noteContainer}>
                                <Text style={styles.noteText} numberOfLines={1}>📝 {order.ghiChu}</Text>
                            </View>
                        )}
                    </View>
                </View>

                {order.trangThaiDh === 'Mới' && (
                    <View style={styles.cardActions}>
                        <TouchableOpacity
                            style={styles.btnSecondary}
                            onPress={() => handleStatusUpdate('Đã hủy')}
                        >
                            <Text style={styles.btnSecondaryText}>Từ chối</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.btnPrimary}
                            onPress={() => handleStatusUpdate('Đang xử lý')}
                        >
                            <MaterialIcons name="check-circle" size={18} color="white" />
                            <Text style={styles.btnPrimaryText}>Xác nhận đơn</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const filteredOrders = orders.filter(order => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;

        const maDhMatch = order.maDh.toString().includes(query);
        const hoTenMatch = order.hoTen?.toLowerCase().includes(query);
        const soDtMatch = order.soDt?.toLowerCase().includes(query);
        const soPhongMatch = order.soPhong?.toString().toLowerCase().includes(query);
        const serviceMatch = order.chiTiet?.some(ct => ct.tenDv?.toLowerCase().includes(query));

        return maDhMatch || hoTenMatch || soDtMatch || soPhongMatch || serviceMatch;
    });

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={<></>}
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Đơn hàng</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => fetchOrders()}>
                        <MaterialIcons name="refresh" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            {/* Tabs */}
            <View style={styles.tabWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {statuses.map((status, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.tabItem, activeTab === status && styles.tabActive]}
                            onPress={() => setActiveTab(status)}
                        >
                            <Text style={[styles.tabText, activeTab === status && styles.tabTextActive]}>
                                {status}
                            </Text>
                            {status === 'Mới' && filteredOrders.length > 0 && activeTab === 'Mới' && (
                                <View style={styles.tabBadge}>
                                    <Text style={styles.tabBadgeText}>{filteredOrders.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBox}>
                    <MaterialIcons name="search" size={20} color={COLORS.textSecondary} style={{ marginLeft: 12 }} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm mã đơn, tên khách..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons name="cancel" size={20} color={COLORS.textSecondary} style={{ marginRight: 8 }} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={styles.listContainer}>
                {filteredOrders.map(order => (
                    <OrderCard key={order.maDh} order={order} />
                ))}

                {!loading && filteredOrders.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <MaterialIcons name="receipt-long" size={80} color={COLORS.border} />
                        <Text style={styles.emptyText}>Không có đơn hàng nào ở trạng thái này</Text>
                    </View>
                )}
            </ScrollView>

            <LoadingOverlay visible={loading} />

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate("LapDonHang")}
            >
                <MaterialIcons name="add" size={32} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },
    tabWrapper: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: COLORS.border },
    tabScroll: { paddingHorizontal: 12 },
    tabItem: {
        paddingVertical: 14,
        paddingHorizontal: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        flexDirection: 'row',
        gap: 6,
    },
    tabActive: { borderBottomColor: COLORS.primary },
    tabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
    tabTextActive: { color: COLORS.primary },
    tabBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 10,
    },
    tabBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
    searchContainer: { padding: 16 },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        height: 46,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    searchInput: { flex: 1, paddingHorizontal: 10, fontSize: 14, color: COLORS.textMain },
    filterBtn: { paddingRight: 16, color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
    listContainer: { padding: 16, gap: 16, paddingBottom: 100 },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    orderIdText: { fontSize: 11, fontWeight: 'bold', color: COLORS.textSecondary },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    badgeAmber: { backgroundColor: COLORS.amberLight },
    badgeBlue: { backgroundColor: COLORS.blueLight },
    statusText: { fontSize: 11, fontWeight: '600' },
    textAmber: { color: COLORS.amber },
    textBlue: { color: COLORS.blue },
    cardBody: { flexDirection: 'row', padding: 12, gap: 12 },
    productImg: { width: 64, height: 64, borderRadius: 8 },
    productImgPlaceholder: { width: 64, height: 64, borderRadius: 8, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    productInfo: { flex: 1 },
    customerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    itemsText: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8, gap: 4 },
    priceLabel: { fontSize: 12, color: COLORS.textSecondary },
    priceValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    cardActions: { flexDirection: 'row', padding: 12, gap: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
    btnSecondary: { flex: 1, height: 40, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
    btnSecondaryText: { fontWeight: '600', color: COLORS.textMain },
    btnPrimary: { flex: 2, height: 40, borderRadius: 8, backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
    btnPrimaryText: { color: 'white', fontWeight: 'bold' },
    noteContainer: {
        marginTop: 6,
        backgroundColor: COLORS.bgLight,
        padding: 6,
        borderRadius: 4,
    },
    noteText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 10,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 85,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
});

export default DonHangScreen;