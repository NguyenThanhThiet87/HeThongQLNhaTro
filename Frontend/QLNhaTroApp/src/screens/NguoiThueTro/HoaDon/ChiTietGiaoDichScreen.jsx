import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import { getChiTietGiaoDichApi } from '../../../api/HoaDon';

import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StyleSheet,
    StatusBar,
    Platform
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

export default function ChiTietGiaoDichScreen({ route }) {
    const { maLstt } = route.params.maLstt;
    console.log("Received transactionId:", maLstt);
    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const response = await getChiTietGiaoDichApi(maLstt);
                if (response.success) {
                    console.log("Chi tiết giao dịch:", response.data);
                } else {
                    console.error("Lỗi khi lấy chi tiết giao dịch:", response.message);
                }
            } catch (error) {
            }
        };
        fetchTransactionDetails();
    }, [maLstt]);

    const navigation = useNavigation();
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Chi tiết giao dịch</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Success Status */}
                <View style={styles.statusSection}>
                    <View style={styles.iconCircleSuccess}>
                        <MaterialCommunityIcons name="check-circle" size={52} color="#10b981" />
                    </View>
                    <Text style={styles.statusText}>Thanh toán thành công</Text>
                    <Text style={styles.subStatusText}>Giao dịch đã được xác nhận bởi hệ thống</Text>
                </View>

                {/* Amount */}
                <View style={styles.amountContainer}>
                    <Text style={styles.amountValue}>3.950.000đ</Text>
                </View>

                {/* Sections */}
                <View style={styles.detailsWrapper}>
                    <InfoSection title="THÔNG TIN HÓA ĐƠN">
                        <DetailRow label="Kỳ thanh toán" value="Tháng 09/2023" />
                        <DetailRow label="Phòng" value="302" />
                        <DetailRow label="Dãy nhà" value="Modern Life" />
                    </InfoSection>

                    <InfoSection title="CHI TIẾT THANH TOÁN">
                        <DetailRow label="Phương thức" value="Chuyển khoản" />
                        <DetailRow label="Ngân hàng" value="Vietcombank" />
                        <DetailRow label="Mã giao dịch" value="XT7890BC12" isHighlight />
                        <DetailRow label="Thời gian" value="10:30 - 02/10/2023" />
                    </InfoSection>
                </View>

                {/* Buttons */}
                <View style={styles.buttonFooter}>
                    <TouchableOpacity style={styles.primaryButton}>
                        <MaterialCommunityIcons name="download" size={20} color="white" />
                        <Text style={styles.primaryButtonText}>Tải xuống biên lai</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton}>
                        <Text style={styles.secondaryButtonText}>Chia sẻ giao dịch</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

// Components bổ trợ
const InfoSection = ({ title, children }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <View style={styles.sectionMargin}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.card}>{children}</View>
        </View>
    )
};

const DetailRow = ({ label, value, isHighlight }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <View style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={[styles.rowValue, isHighlight && styles.textPrimary]}>{value}</Text>
        </View>
    )
};

// --- TÁCH RIÊNG STYLE TẠI ĐÂY ---
const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    content: {
        flex: 1,
    },
    statusSection: {
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
    },
    iconCircleSuccess: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ecfdf5',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    },
    subStatusText: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    amountValue: {
        fontSize: 40,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -1,
    },
    detailsWrapper: {
        paddingHorizontal: 16,
    },
    sectionMargin: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    card: {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        borderRadius: 16,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
    },
    rowLabel: {
        fontSize: 14,
        color: '#64748b',
    },
    rowValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    },
    textPrimary: {
        color: '#13c8ec',
    },
    evidenceCard: {
        position: 'relative',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    evidenceImage: {
        width: '100%',
        height: 200,
        backgroundColor: '#f1f5f9',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonFooter: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    primaryButton: {
        backgroundColor: '#13c8ec',
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#13c8ec',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    primaryButtonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: 'white',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: '#475569',
        fontWeight: '600',
        fontSize: 16,
    },
});
