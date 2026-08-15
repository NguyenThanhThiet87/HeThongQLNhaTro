/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Image,
    Dimensions,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/useTheme';
import { getChiTietBaoCaoApi, updateTrangThaiSuCoApi } from '../../../api/SuCo';
import AppHeader from '../../../components/AppHeader';
import { formatDate } from '../../../utils/formatNgaySinh';
import { makeCall } from '../../../utils/linking';

const { width } = Dimensions.get('window');

const ChiTietSuCoScreen = ({ route, navigation }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    const { maBasc } = route.params || {};

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    // FIX: Đưa hàm này ra ngoài để handleExecuteAction có thể gọi được
    const fetchData = async () => {
        if (!maBasc) return;
        setLoading(true);
        const res = await getChiTietBaoCaoApi(maBasc);
        if (res.success) {
            setReportData(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [maBasc]);

    const getStatusInfo = (maTtxuLy) => {
        if (!maTtxuLy) return { color: '#64748b', label: 'Chờ xử lý', icon: 'clock-outline' };
        switch (maTtxuLy) {
            case 1: return { color: '#0ea5e9', label: 'Mới tiếp nhận', icon: 'new-box' };
            case 2: return { color: '#f59e0b', label: 'Đang sửa chữa', icon: 'wrench' };
            case 3: return { color: '#22c55e', label: 'Đã hoàn thành', icon: 'check-circle' };
            default: return { color: '#64748b', label: 'Chờ xử lý', icon: 'clock-outline' };
        }
    };

    const handleExecuteAction = async () => {
        const nextStatus = reportData.maTtxuLy === 1 ? 2 : 3;
        const actionLabel = nextStatus === 2 ? "Tiến hành sửa chữa" : "Xác nhận hoàn thành";

        Alert.alert(
            "Xác nhận hành động",
            `Bạn có chắc chắn muốn chuyển trạng thái thành "${actionLabel}"?`,
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        setLoading(true);
                        const res = await updateTrangThaiSuCoApi(reportData.maSuCo, nextStatus);
                        if (res.success) {
                            fetchData(); // Gọi hàm fetchData đã đưa ra ngoài
                        } else {
                            Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
                        }
                        setLoading(false);
                    }
                }
            ]
        );
    };

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    if (!reportData) return <View style={styles.center}><Text>Không tìm thấy dữ liệu.</Text></View>;

    const statusInfo = getStatusInfo(reportData.maTtxuLy);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={<TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} /></TouchableOpacity>}
                center={<Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Chi tiết sự cố</Text>}
                right={<View style={{ width: 40 }} />}
                isDark={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '15' }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusInfo.color }]} />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>Trạng thái: {statusInfo.label}</Text>
                </View>

                {/* INFO SECTION */}
                <View style={styles.section}>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="meeting-room" size={20} color={COLORS.primary} />
                            <Text style={styles.infoLabel}>Phòng:</Text>
                            <Text style={styles.infoValue}>{reportData.tenPhong} - {reportData.tenDayNt}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="person" size={20} color={COLORS.primary} />
                            <Text style={styles.infoLabel}>Người báo:</Text>
                            <Text style={styles.infoValue}>{reportData.hoTenNt}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <MaterialIcons name="access-time" size={20} color={COLORS.primary} />
                            <Text style={styles.infoLabel}>Thời gian:</Text>
                            <Text style={styles.infoValue}>{formatDate(reportData.thoiGian)}</Text>
                        </View>
                        <TouchableOpacity style={styles.callBtn} onPress={() => makeCall(reportData.sdtNt)}>
                            <MaterialIcons name="phone" size={18} color="white" />
                            <Text style={styles.callBtnText}>Gọi cho {reportData.hoTenNt}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* DEVICE LIST */}
                <Text style={styles.sectionTitle}>DANH SÁCH THIẾT BỊ ({reportData.details?.length || 0})</Text>
                {reportData.details?.map((device, index) => (
                    <View key={index} style={styles.deviceCard}>
                        <View style={styles.deviceHeader}>
                            <MaterialCommunityIcons name="tools" size={22} color={COLORS.primary} />
                            <Text style={styles.deviceName}>{device.tenThietBi}</Text>
                        </View>
                        <Text style={styles.descriptionLabel}>Mô tả chi tiết:</Text>
                        <Text style={styles.descriptionText}>{device.moTa}</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                            <Image source={{ uri: device.image }} style={styles.evidenceImage} />
                        </ScrollView>
                    </View>
                ))}
            </ScrollView>

            {/* FOOTER ACTIONS */}
            <View style={styles.footer}>
                {reportData.maTtxuLy < 3 ? (
                    <>
                        <TouchableOpacity
                            style={[styles.primaryBtn, { flex: reportData.maTtxuLy === 2 ? 1 : 2 }]}
                            onPress={handleExecuteAction}
                        >
                            <MaterialIcons name={reportData.maTtxuLy === 1 ? "build" : "done-all"} size={20} color="white" />
                            <Text style={styles.primaryBtnText}>
                                {reportData.maTtxuLy === 1 ? "Tiến hành sửa" : "Sửa thành công"}
                            </Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.doneBanner}>
                        <MaterialIcons name="verified" size={24} color="#22c55e" />
                        <Text style={styles.doneText}>Sự cố này đã được xử lý xong</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },
    scrollContent: { paddingBottom: 120 },
    statusBanner: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginVertical: 10, padding: 12, borderRadius: 12 },
    statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
    statusText: { fontSize: 14, fontWeight: 'bold' },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    infoCard: { backgroundColor: COLORS.bgLight, borderRadius: 20, padding: 15, borderWidth: 1, borderColor: COLORS.border },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoLabel: { fontSize: 14, color: COLORS.textMuted, marginLeft: 10, width: 80 },
    infoValue: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, flex: 1 },
    callBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 5 },
    callBtnText: { color: 'white', fontWeight: 'bold', marginLeft: 8 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, marginHorizontal: 20, marginBottom: 10, letterSpacing: 1 },
    deviceCard: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 20, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, elevation: 3 },
    deviceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    deviceName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    descriptionLabel: { fontSize: 12, fontWeight: '700', color: COLORS.textMuted, marginBottom: 4 },
    descriptionText: { fontSize: 14, color: COLORS.textMain, lineHeight: 22 },
    imageScroll: { marginTop: 10 },
    evidenceImage: { width: 120, height: 120, borderRadius: 12, marginRight: 10 },
    footer: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: 'white', flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: COLORS.border, gap: 12 },
    secondaryBtn: { flex: 1, height: 50, borderRadius: 12, borderWidth: 1, borderColor: COLORS.danger, justifyContent: 'center', alignItems: 'center' },
    secondaryBtnText: { color: COLORS.danger, fontWeight: 'bold' },
    primaryBtn: { flex: 2, height: 50, backgroundColor: COLORS.primary, borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    primaryBtnText: { color: 'white', fontWeight: 'bold' },
    doneBanner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 10 },
    doneText: { color: '#22c55e', fontWeight: 'bold', fontSize: 16 },
});

export default ChiTietSuCoScreen;
