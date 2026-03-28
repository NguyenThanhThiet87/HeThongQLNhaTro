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
    Platform,
    Share,
    Alert
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getMonthFromDate, getYearFromDate } from '../../../utils/formatNgaySinh';
import { getTenPhuongThucThanhToan, getIconPhuongThucThanhToan } from '../../../constants/PHUONG_THUC_THANH_TOAN';

export default function ChiTietGiaoDichScreen({ route }) {
    const { maLstt } = route.params;
    const [transactionDetails, setTransactionDetails] = React.useState(null);

    useEffect(() => {
        const fetchTransactionDetails = async () => {
            try {
                const response = await getChiTietGiaoDichApi(maLstt);
                if (response.success) {
                    console.log("Chi tiết giao dịch:", response.data);
                    setTransactionDetails(response.data);
                } else {
                    console.error("Lỗi khi lấy chi tiết giao dịch:", response.message);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };
        fetchTransactionDetails();
    }, [maLstt]);

    const navigation = useNavigation();
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const handleDownloadReceipt = async () => {
        if (!transactionDetails) return;

        const receiptMessage = `
--- BIÊN LAI THANH TOÁN ---
Mã giao dịch: ${transactionDetails.maGiaoDich}
Số tiền: ${formatCurrency(transactionDetails.soTien)}
Kỳ thanh toán: Tháng ${getMonthFromDate(transactionDetails.ngayThanhToan)}/${getYearFromDate(transactionDetails.ngayThanhToan)}
Phòng: ${transactionDetails.soPhong}
Dãy nhà: ${transactionDetails.tenDayNhaTro}
Phương thức: ${transactionDetails.phuongThuc}
Thời gian: ${transactionDetails.ngayThanhToan}
---
Cảm ơn quý khách!
        `.trim();

        try {
            await Share.share({
                message: receiptMessage,
                title: 'Biên lai giao dịch',
            });
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể tải biên lai.');
        }
    };

    const handleShareTransaction = async () => {
        handleDownloadReceipt();
    };

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
                    <Text style={styles.amountValue}>{transactionDetails ? formatCurrency(transactionDetails.soTien) : '0'}đ</Text>
                </View>

                {/* Sections */}
                <View style={styles.detailsWrapper}>
                    <InfoSection title="THÔNG TIN HÓA ĐƠN">
                        <DetailRow label="Kỳ thanh toán" value={transactionDetails ? `Tháng ${getMonthFromDate(transactionDetails.ngayThanhToan)}/${getYearFromDate(transactionDetails.ngayThanhToan)}` : 'N/A'} />
                        <DetailRow label="Phòng" value={transactionDetails ? transactionDetails.soPhong : 'N/A'} />
                        <DetailRow label="Dãy nhà" value={transactionDetails ? transactionDetails.tenDayNhaTro : 'N/A'} />
                    </InfoSection>

                    <InfoSection title="CHI TIẾT THANH TOÁN">
                        <DetailRow label="Phương thức" value={transactionDetails ? getTenPhuongThucThanhToan(transactionDetails.maPhuongThuc) : 'N/A'} />
                        <DetailRow label="Ngân hàng" value="Vietcombank" />
                        <DetailRow label="Mã giao dịch" value={transactionDetails ? transactionDetails.maGiaoDich : 'N/A'} isHighlight />
                        <DetailRow label="Thời gian" value={transactionDetails ? `${transactionDetails.ngayThanhToan}` : 'N/A'} />
                    </InfoSection>
                </View>

                {/* Buttons */}
                <View style={styles.buttonFooter}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleDownloadReceipt}>
                        <MaterialCommunityIcons name="download" size={20} color="white" />
                        <Text style={styles.primaryButtonText}>Tải xuống biên lai</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleShareTransaction}>
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
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.textMain },
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
        backgroundColor: COLORS.success + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statusText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textMain,
        marginBottom: 4,
    },
    subStatusText: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
    },
    amountContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    amountValue: {
        fontSize: 40,
        fontWeight: '800',
        color: COLORS.textMain,
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
        color: COLORS.textMuted,
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    card: {
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border + '50',
    },
    rowLabel: {
        fontSize: 14,
        color: COLORS.textMuted,
    },
    rowValue: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textMain,
    },
    textPrimary: {
        color: COLORS.primary,
    },
    buttonFooter: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: COLORS.primary,
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
        backgroundColor: 'transparent',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: COLORS.textMain,
        fontWeight: '600',
        fontSize: 16,
    },
});
