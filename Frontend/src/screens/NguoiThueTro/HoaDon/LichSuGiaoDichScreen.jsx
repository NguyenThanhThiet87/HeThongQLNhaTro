import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    FlatList,
    Platform,
    ActivityIndicator,
    RefreshControl,
    Image,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import { getLichSuThanhToanGanApi } from '../../../api/HoaDon';
import { getCurrentUser } from '../../../utils/decodeToken';
import { formatDate } from '../../../utils/formatNgaySinh';
import { formatCurrency } from '../../../utils/formatCurrency';
import AppHeader from '../../../components/AppHeader';
import { FONT_SIZES, FONT_WEIGHTS } from '../../../theme/typography';

const LichSuGiaoDichScreen = () => {
    const { COLORS } = useTheme();
    const navigation = useNavigation();
    const styles = createStyles(COLORS);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const [user, setUser] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const currentUser = await getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
                const res = await getLichSuThanhToanGanApi(currentUser.maNd);
                if (res.success) {
                    console.log(res.data)
                    setTransactions(res.data);
                }
            }
        } catch (error) {
            console.error("Lỗi lấy lịch sử giao dịch:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getStatusInfo = (status) => {
        switch (status?.toLowerCase()) {
            case 'thành công':
            case 'success':
                return { color: '#10b981', bg: '#ecfdf5', icon: 'check-circle' };
            case 'chờ thanh toán':
            case 'pending':
                return { color: '#f59e0b', bg: '#fffbeb', icon: 'clock-outline' };
            case 'thất bại':
            case 'failed':
                return { color: '#ef4444', bg: '#fef2f2', icon: 'close-circle' };
            default:
                return { color: '#64748b', bg: '#f1f5f9', icon: 'help-circle' };
        }
    };

    const renderItem = ({ item }) => {
        const statusInfo = getStatusInfo(item.trangThai || 'Thành công');
        return (
            <TouchableOpacity
                style={[styles.historyCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}
                onPress={() => navigation.navigate('ChiTietGiaoDich', { maLstt: item.maLstt })}
            >
                <View style={styles.cardLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: statusInfo.bg }]}>
                        <MaterialCommunityIcons name={statusInfo.icon} size={24} color={statusInfo.color} />
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={[styles.transactionTitle, { color: COLORS.textMain }]}>Thanh toán hóa đơn</Text>
                        <Text style={styles.dateText}>{formatDate(item.ngayThanhToan)}</Text>
                        {item.ghiChu && <Text style={styles.noteText} numberOfLines={1}>{item.ghiChu}</Text>}
                    </View>
                </View>
                <View style={styles.cardRight}>
                    <Text style={[styles.amountText, { color: COLORS.textMain }]}>-{formatCurrency(item.soTien)}đ</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: statusInfo.color }]}>{(item.trangThai || 'Thành công').toUpperCase()}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const EmptyComponent = () => (
        <View style={styles.emptyContainer}>
            <Image
                source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6598/6598519.png' }}
                style={styles.emptyImage}
            />
            <Text style={[styles.emptyText, { color: COLORS.textMuted }]}>Bạn chưa có giao dịch nào</Text>
            <TouchableOpacity
                style={[styles.refreshBtn, { backgroundColor: COLORS.primary }]}
                onPress={fetchData}
            >
                <Text style={styles.refreshBtnText}>Tải lại</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: COLORS.bgLight }]}>
            {/* Header */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={18} color={COLORS.textMain} style={{ marginLeft: 6 }} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Lịch sử giao dịch</Text>
                }
                right={<View style={styles.headerIcon} />}
            />

            {loading && !refreshing ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={[styles.loadingText, { color: COLORS.textMuted }]}>Đang tải giao dịch...</Text>
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={item => item.maLstt?.toString() || Math.random().toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                    ListEmptyComponent={EmptyComponent}
                />
            )}
        </View>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: {
        flex: 1,
    },
    headerIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: FONT_SIZES.header,
        fontWeight: FONT_WEIGHTS.bold,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 40,
        paddingTop: 16,
    },
    historyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        borderWidth: 1,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    cardLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transactionTitle: {
        fontSize: 15,
        fontWeight: '700',
    },
    dateText: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 2,
    },
    noteText: {
        fontSize: 11,
        color: '#64748b',
        fontStyle: 'italic',
        marginTop: 2,
    },
    cardRight: {
        alignItems: 'flex-end',
        marginLeft: 12,
    },
    amountText: {
        fontSize: 16,
        fontWeight: '800',
    },
    statusBadge: {
        marginTop: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyImage: {
        width: 120,
        height: 120,
        opacity: 0.5,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
    },
    refreshBtn: {
        marginTop: 24,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    refreshBtnText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 14,
    },
});

export default LichSuGiaoDichScreen;