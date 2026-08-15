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
    Linking,
} from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getDichVuByIdService } from '../../../services/dichVuService';
import LoadingOverlay from '../../../components/LoadingOverlay';

const COLORS = {
    primary: "#2563eb",
    secondary: "#f97316",
    success: "#10b981",
    bgLight: "#f8fafc",
    textMain: "#0f172a",
    textSecondary: "#64748b",
    white: "#ffffff",
    border: "#e2e8f0",
};

const ChiTietDichVu = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { serviceId } = route.params;
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchServiceDetails();
    }, [serviceId]);

    const fetchServiceDetails = async () => {
        setLoading(true);
        const res = await getDichVuByIdService(serviceId);
        if (res.success) {
            setService(res.data);
        }
        setLoading(false);
    };

    const handleCall = () => {
        if (service?.provider?.soDt) {
            Linking.openURL(`tel:${service.provider.soDt}`);
        }
    };

    const handleOrder = () => {
        // Chuyển sang màn hình xác nhận đặt đơn
        navigation.navigate("XacNhanDatDichVu", { service });
    };

    if (!service && !loading) {
        return (
            <SafeAreaView style={styles.container}>
                <AppHeader
                    left={<TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color="black" /></TouchableOpacity>}
                    center={<Text>Lỗi</Text>}
                />
                <View style={styles.center}>
                    <Text>Không tìm thấy dịch vụ</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={<Text style={styles.headerTitle}>Chi tiết dịch vụ</Text>}
                isDark={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <Image
                    source={{ uri: service?.hinhAnh || 'https://via.placeholder.com/400' }}
                    style={styles.mainImage}
                />

                <View style={styles.infoSection}>
                    <View style={styles.titleRow}>
                        <Text style={styles.serviceTitle}>{service?.tenDv}</Text>
                        <View style={styles.priceTag}>
                            <Text style={styles.priceValue}>{service?.giaTien?.toLocaleString()}đ</Text>
                            <Text style={styles.unitText}>/{service?.donViTinh}</Text>
                        </View>
                    </View>

                    <View style={styles.statusBadge}>
                        <View style={[styles.dot, { backgroundColor: service?.ttcungCap === 'Sẵn sàng' ? COLORS.success : COLORS.textSecondary }]} />
                        <Text style={styles.statusText}>{service?.ttcungCap}</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Mô tả chi tiết</Text>
                    <Text style={styles.description}>
                        {service?.moTaCt || 'Không có mô tả chi tiết cho dịch vụ này.'}
                    </Text>

                    <View style={styles.divider} />

                    {/* Provider Info */}
                    <Text style={styles.sectionTitle}>Nhà cung cấp</Text>
                    <View style={styles.providerCard}>
                        <Image source={{ uri: service?.provider?.avatar || 'https://i.pravatar.cc/100' }} style={styles.providerAvatar} />
                        <View style={styles.providerInfo}>
                            <Text style={styles.providerName}>{service?.provider?.hoTen}</Text>
                            <View style={styles.ratingRow}>
                                <MaterialIcons name="star" size={16} color="#fbbf24" />
                                <Text style={styles.ratingText}>{service?.provider?.danhGiaTb || '5.0'}</Text>
                                <Text style={styles.subText}> • {service?.provider?.khuVucPv || 'Khu vực lân cận'}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
                            <Ionicons name="call" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    {/* Features/Policies */}
                    <View style={styles.policySection}>
                        <View style={styles.policyItem}>
                            <MaterialIcons name="verified" size={20} color={COLORS.success} />
                            <Text style={styles.policyText}>Đã được xác thực</Text>
                        </View>
                        <View style={styles.policyItem}>
                            <MaterialIcons name="timer" size={20} color={COLORS.primary} />
                            <Text style={styles.policyText}>Giao nhanh 15-30p</Text>
                        </View>
                        <View style={styles.policyItem}>
                            <MaterialIcons name="security" size={20} color={COLORS.secondary} />
                            <Text style={styles.policyText}>Bảo hành chính hãng</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action */}
            <View style={styles.bottomAction}>
                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Tạm tính</Text>
                    <Text style={styles.totalValue}>{service?.giaTien?.toLocaleString()}đ</Text>
                </View>
                <TouchableOpacity style={styles.orderBtn} onPress={handleOrder}>
                    <Text style={styles.orderBtnText}>Đặt dịch vụ ngay</Text>
                    <MaterialIcons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>

            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    iconCircle: { padding: 8 },
    scrollContent: { paddingBottom: 20 },
    mainImage: { width: '100%', height: 300, backgroundColor: COLORS.border },

    infoSection: { padding: 20, marginTop: -20, backgroundColor: COLORS.white, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
    titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    serviceTitle: { flex: 1, fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginRight: 10 },
    priceTag: { alignItems: 'flex-end' },
    priceValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    unitText: { fontSize: 12, color: COLORS.textSecondary },

    statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
    statusText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
    description: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 22 },

    providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgLight, padding: 12, borderRadius: 16 },
    providerAvatar: { width: 50, height: 50, borderRadius: 25 },
    providerInfo: { flex: 1, marginLeft: 12 },
    providerName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    ratingText: { fontSize: 13, fontWeight: 'bold', color: COLORS.textMain, marginLeft: 4 },
    subText: { fontSize: 12, color: COLORS.textSecondary },
    callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', elevation: 2 },

    policySection: { marginTop: 20, gap: 12 },
    policyItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    policyText: { fontSize: 14, color: COLORS.textSecondary },

    bottomAction: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        elevation: 10,
    },
    totalSection: { flex: 1 },
    totalLabel: { fontSize: 12, color: COLORS.textSecondary },
    totalValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    orderBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    orderBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default ChiTietDichVu;
