import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { getDonHangStatsService, getRevenueChartService } from '../../../services/donHangService';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import LoadingOverlay from '../../../components/LoadingOverlay';

const { width } = Dimensions.get('window');

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    success: '#10b981',
    info: '#3b82f6',
};

const DoanhThuScreen = () => {
    const navigation = useNavigation();
    const { user } = useUserProviderProfile();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ newOrders: 0, todayRevenue: 0 });
    const [chartData, setChartData] = useState([]);
    const [selectedDays, setSelectedDays] = useState(7);

    useEffect(() => {
        if (user?.maNcc) {
            fetchData();
        }
    }, [user?.maNcc, selectedDays]);

    const fetchData = async () => {
        setLoading(true);
        const [statsRes, chartRes] = await Promise.all([
            getDonHangStatsService(user.maNcc),
            getRevenueChartService(user.maNcc, selectedDays)
        ]);

        if (statsRes.success) setStats(statsRes.data);
        if (chartRes.success) setChartData(chartRes.data);
        setLoading(false);
    };

    const maxRevenue = Math.max(...chartData.map(d => d.value), 1);

    const formatPrice = (price) => {
        if (price >= 1000000) return (price / 1000000).toFixed(1) + 'M';
        if (price >= 1000) return (price / 1000).toFixed(0) + 'K';
        return price.toString();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <AppHeader
                left={<></>}
                center={<Text style={styles.headerTitle}>Thống kê doanh thu</Text>}
                isDark={false}
            />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Summary Cards */}
                <View style={styles.summaryRow}>
                    <View style={[styles.summaryCard, { backgroundColor: COLORS.primary }]}>
                        <Ionicons name="cash" size={24} color="white" />
                        <Text style={styles.summaryLabel}>Doanh thu hôm nay</Text>
                        <Text style={styles.summaryValue}>{stats.todayRevenue?.toLocaleString()}đ</Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.summaryCard, { backgroundColor: COLORS.info }]}
                        onPress={() => navigation.navigate("DonHang")}
                    >
                        <Ionicons name="receipt" size={24} color="white" />
                        <Text style={styles.summaryLabel}>Đơn hàng mới</Text>
                        <Text style={styles.summaryValue}>{stats.newOrders} đơn</Text>
                    </TouchableOpacity>
                </View>

                {/* Chart Section */}
                <View style={styles.chartSection}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Biểu đồ tăng trưởng</Text>
                        <View style={styles.daysFilter}>
                            {[7, 30].map(d => (
                                <TouchableOpacity
                                    key={d}
                                    style={[styles.dayBtn, selectedDays === d && styles.dayBtnActive]}
                                    onPress={() => setSelectedDays(d)}
                                >
                                    <Text style={[styles.dayBtnText, selectedDays === d && styles.dayBtnTextActive]}>{d} ngày</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.chartWrapper}>
                        <View style={styles.yAxis}>
                            {[maxRevenue, maxRevenue / 2, 0].map((val, i) => (
                                <Text key={i} style={styles.axisText}>{formatPrice(val)}</Text>
                            ))}
                        </View>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.barContent}>
                                {chartData.map((item, index) => (
                                    <View key={index} style={styles.barItem}>
                                        <View style={styles.barTrack}>
                                            <View
                                                style={[
                                                    styles.barFill,
                                                    { height: `${(item.value / maxRevenue) * 100}%` }
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.barLabel}>{item.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>

                {/* Insight Section */}
                <View style={styles.insightSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.chartTitle}>Phân tích chi tiết</Text>
                        <TouchableOpacity onPress={fetchData}>
                            <MaterialIcons name="refresh" size={20} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.insightItem}>
                        <View style={[styles.iconBox, { backgroundColor: COLORS.primaryLight }]}>
                            <MaterialIcons name="trending-up" size={20} color={COLORS.primary} />
                        </View>
                        <View style={styles.insightText}>
                            <Text style={styles.insightLabel}>Số đơn hàng trung bình</Text>
                            <Text style={styles.insightValue}>{(chartData.length > 0 ? (stats.todayRevenue / 50000).toFixed(0) : 0)} đơn / ngày</Text>
                        </View>
                    </View>

                    <View style={styles.insightItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
                            <MaterialIcons name="account-balance-wallet" size={20} color={COLORS.success} />
                        </View>
                        <View style={styles.insightText}>
                            <Text style={styles.insightLabel}>Dự kiến tháng này</Text>
                            <Text style={styles.insightValue}>{(stats.todayRevenue * 30).toLocaleString()}đ</Text>
                        </View>
                    </View>

                    <View style={styles.insightItem}>
                        <View style={[styles.iconBox, { backgroundColor: '#dbeafe' }]}>
                            <MaterialIcons name="assessment" size={20} color={COLORS.info} />
                        </View>
                        <View style={styles.insightText}>
                            <Text style={styles.insightLabel}>Trạng thái cửa hàng</Text>
                            <Text style={[styles.insightValue, { color: user?.sanSang ? COLORS.success : COLORS.textSecondary }]}>
                                {user?.sanSang ? 'Đang hoạt động' : 'Tạm nghỉ'}
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 20, fontWeight: 'bold' },
    content: { padding: 16 },
    summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    summaryCard: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    summaryLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600' },
    summaryValue: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 8 },

    chartSection: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    chartTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    daysFilter: { flexDirection: 'row', backgroundColor: COLORS.bgLight, borderRadius: 10, padding: 4 },
    dayBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
    dayBtnActive: { backgroundColor: 'white', elevation: 3, shadowColor: '#000', shadowOpacity: 0.1 },
    dayBtnText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
    dayBtnTextActive: { color: COLORS.primary, fontWeight: 'bold' },

    chartWrapper: { flexDirection: 'row', height: 220, alignItems: 'flex-end' },
    yAxis: { height: '100%', justifyContent: 'space-between', paddingRight: 10, paddingBottom: 30 },
    axisText: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '500' },
    barContent: { flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 30 },
    barItem: { width: 50, alignItems: 'center' },
    barTrack: { width: 14, height: '100%', backgroundColor: COLORS.bgLight, borderRadius: 7, justifyContent: 'flex-end' },
    barFill: { width: '100%', backgroundColor: COLORS.primary, borderRadius: 7 },
    barLabel: { fontSize: 11, color: COLORS.textSecondary, marginTop: 12, transform: [{ rotate: '-45deg' }], fontWeight: '500' },

    insightSection: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
    },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    insightItem: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    insightText: { marginLeft: 16, flex: 1 },
    insightLabel: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '500' },
    insightValue: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginTop: 4 },
});

export default DoanhThuScreen;