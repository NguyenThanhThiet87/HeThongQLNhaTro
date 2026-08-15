import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Dimensions,
    Platform,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/useTheme';
import { getAllBaoCaoSuCoApi } from "../../../api/SuCo";
import { getCurrentUser } from '../../../utils/decodeToken';
import { ActivityIndicator } from 'react-native';
import { formatDate } from '../../../utils/formatNgaySinh';

const { width } = Dimensions.get('window');

const BaoCaoSuCoScreen = ({ navigation }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    const [activeTab, setActiveTab] = useState('all');

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusConfig = (maTtxuLy) => {
        switch (maTtxuLy) {
            case 1: return { status: 'Chờ xử lý', color: '#ef4444', statusId: 'pending', icon: 'alert-circle' };
            case 2: return { status: 'Đang sửa', color: '#3b82f6', statusId: 'processing', icon: 'wrench' };
            case 3: return { status: 'Hoàn thành', color: '#22c55e', statusId: 'completed', icon: 'check-circle' };
            default: return { status: 'Chờ xử lý', color: '#64748b', statusId: 'pending', icon: 'clock-outline' };
        }
    };

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                setLoading(true);
                try {
                    const user = await getCurrentUser();
                    if (user && user.maNd) {
                        const res = await getAllBaoCaoSuCoApi(user.maNd);
                        console.log("DS", res);

                        if (res.success && res.data) {
                            const mappedData = res.data.map(item => {
                                const config = getStatusConfig(item.maTtxuLy);
                                return {
                                    id: item.maSuCo,
                                    type: 'General',
                                    icon: config.icon,
                                    room: item.soPhong,
                                    building: item.tenDayNt,
                                    title: item.moTaSuCo || 'Báo cáo sự cố',
                                    status: config.status,
                                    time: formatDate(item.thoiGian) || 'Vừa xong',
                                    color: config.color,
                                    statusId: config.statusId,
                                    rawData: item
                                };
                            });
                            setIncidents(mappedData);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching incidents:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, [])
    );

    const filteredIncidents = activeTab === 'all'
        ? incidents
        : incidents.filter(item => item.statusId === activeTab);

    const pendingCount = incidents.filter(i => i.statusId === 'pending').length;
    const processingCount = incidents.filter(i => i.statusId === 'processing').length;
    const totalToProcess = pendingCount + processingCount;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* HEADER GHI TRỰC TIẾP */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Quản lý sự cố</Text>
                    <Text style={styles.headerSubtitle}>{totalToProcess} báo cáo mới cần xử lý</Text>
                </View>
            </View>

            {/* TABS GHI TRỰC TIẾP */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScroll}>
                    {['all', 'pending', 'processing', 'completed'].map((tabId) => {
                        const labels = { all: 'Tất cả', pending: 'Chờ xử lý', processing: 'Đang sửa', completed: 'Hoàn thành' };
                        const isActive = activeTab === tabId;
                        return (
                            <TouchableOpacity
                                key={tabId}
                                style={[styles.tabItem, isActive && { backgroundColor: COLORS.primary }]}
                                onPress={() => setActiveTab(tabId)}
                            >
                                <Text style={[styles.tabLabel, isActive && { color: 'white' }]}>{labels[tabId]}</Text>
                                {tabId === 'pending' && pendingCount > 0 && (
                                    <View style={[styles.countBadge, isActive && { backgroundColor: 'white' }]}>
                                        <Text style={[styles.countText, isActive && { color: COLORS.primary }]}>{pendingCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* LIST DANH SÁCH GHI TRỰC TIẾP */}
            {loading ? (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.emptyText}>Đang tải danh sách sự cố...</Text>
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                    {filteredIncidents.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.incidentCard}
                            activeOpacity={0.7}
                            onPress={() => navigation.navigate('ChiTietBaoCaoSuCo', { maBasc: item.id })}
                        >
                            <View style={styles.cardTop}>
                                <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                                    <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
                                </View>
                                <View style={styles.cardInfo}>
                                    <View style={styles.tagRow}>
                                        <View style={styles.roomTag}>
                                            <Text style={styles.roomText}>{item.room} • {item.building}</Text>
                                        </View>
                                        <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
                                            <View style={[styles.dot, { backgroundColor: item.color }]} />
                                            <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.incidentTitle} numberOfLines={1}>{item.title}</Text>
                                    <View style={styles.cardFooter}>
                                        <View style={styles.timeInfo}>
                                            <MaterialIcons name="access-time" size={14} color={COLORS.textMuted} />
                                            <Text style={styles.timeText}>{item.time}</Text>
                                        </View>
                                        <Text style={styles.detailLink}>Chi tiết →</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {filteredIncidents.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="assignment-turned-in" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>Tuyệt vời! Không có sự cố nào cần xử lý.</Text>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 10 : 40,
        paddingBottom: 15,
    },
    backBtn: {
        padding: 8,
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        marginRight: 15,
    },
    headerTitleContainer: { flex: 1 },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    headerSubtitle: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },

    tabContainer: { marginVertical: 10 },
    tabScroll: { paddingHorizontal: 20, gap: 10 },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: COLORS.bgLight,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tabLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
    countBadge: {
        backgroundColor: COLORS.danger,
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 1,
        marginLeft: 6,
    },
    countText: { fontSize: 10, color: 'white', fontWeight: 'bold' },

    listContent: { padding: 20, paddingBottom: 100 },
    incidentCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 15,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 3 },
        }),
    },
    cardTop: { flexDirection: 'row', gap: 15 },
    iconBox: {
        width: 54,
        height: 54,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1 },
    tagRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    roomTag: {
        backgroundColor: COLORS.bgLight,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    roomText: { fontSize: 11, fontWeight: '700', color: COLORS.primary },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    incidentTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textMain, marginVertical: 8 },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    timeInfo: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timeText: { fontSize: 12, color: COLORS.textMuted },
    detailLink: { fontSize: 12, color: COLORS.primary, fontWeight: '700' },

    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        backgroundColor: COLORS.primary,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 6 },
    },
    emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
    emptyText: { color: COLORS.textMuted, marginTop: 15, fontSize: 14, textAlign: 'center' },
});

export default BaoCaoSuCoScreen;
