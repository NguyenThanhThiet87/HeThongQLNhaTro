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
    Platform,
    ActivityIndicator,
    Modal,
    Dimensions,
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../../theme/useTheme';
import AppHeader from '../../../components/AppHeader';
import { makeCall } from '../../../utils/linking';
import { getChiTietBaoCaoApi } from '../../../api/SuCo';
import { formatDate } from '../../../utils/formatNgaySinh';

const { width, height } = Dimensions.get('window');

const ChiTietBaoCaoTenantScreen = ({ route, navigation }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);
    const { maBasc } = route.params || {};

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);

    // States dành cho chức năng xem ảnh
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            if (!maBasc) return;
            setLoading(true);
            try {
                const res = await getChiTietBaoCaoApi(maBasc);
                if (res.success) {
                    setReportData(res.data);
                }
            } catch (error) {
                console.error("Lỗi fetch detail:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [maBasc]);

    const handleViewImage = (url) => {
        setSelectedImage(url);
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10, color: COLORS.textMuted }}>Đang tải thông tin...</Text>
            </View>
        );
    }

    if (!reportData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: COLORS.textMuted }}>Không tìm thấy dữ liệu báo cáo</Text>
            </View>
        );
    }

    const getStatusInfo = (maTtxuLy) => {
        switch (maTtxuLy) {
            case 1: return { label: 'Đã tiếp nhận', color: '#0ea5e9', icon: 'check-circle' };
            case 2: return { label: 'Đang sửa chữa', color: '#f59e0b', icon: 'wrench' };
            case 3: return { label: 'Đã hoàn thành', color: '#22c55e', icon: 'checkbox-marked-circle' };
            default: return { label: 'Mới gửi', color: '#ef4444', icon: 'clock-outline' };
        }
    };

    const statusInfo = getStatusInfo(reportData.maTtxuLy);

    const timeline = [
        { title: 'Gửi yêu cầu', time: formatDate(reportData.thoiGian), completed: true },
        { title: 'Chủ nhà đã tiếp nhận', time: reportData.maTtxuLy >= 1 ? 'Vừa xong' : 'Chờ duyệt', completed: reportData.maTtxuLy >= 1 },
        { title: 'Đang sửa chữa', time: reportData.maTtxuLy == 2 ? 'Đang thực hiện...' : (reportData.maTtxuLy > 2 ? 'Hoàn tất' : ''), completed: reportData.maTtxuLy >= 2, active: reportData.maTtxuLy === 2 },
        { title: 'Hoàn thành', time: reportData.maTtxuLy === 3 ? 'Kết thúc' : '', completed: reportData.maTtxuLy === 3 },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Chi tiết sự cố #{reportData.maSuCo}</Text>
                }
                right={<View style={{ width: 40 }} />}
                isDark={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={[styles.statusBanner, { backgroundColor: statusInfo.color + '15' }]}>
                    <MaterialCommunityIcons name={statusInfo.icon} size={22} color={statusInfo.color} />
                    <Text style={[styles.statusText, { color: statusInfo.color }]}>
                        Trạng thái: {statusInfo.label}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}> TIẾN ĐỘ XỬ LÝ</Text>
                    <View style={styles.timelineContainer}>
                        {timeline.map((step, index) => (
                            <View key={index} style={styles.timelineItem}>
                                <View style={styles.timelineLeft}>
                                    <View style={[
                                        styles.timelineDot,
                                        step.completed && { backgroundColor: '#22c55e' },
                                        step.active && { backgroundColor: COLORS.primary }
                                    ]} >
                                        {step.completed && <MaterialIcons name="check" size={12} color="white" />}
                                    </View>
                                    {index !== timeline.length - 1 && (
                                        <View style={[styles.timelineLine, step.completed && { backgroundColor: '#22c55e' }]} />
                                    )}
                                </View>
                                <View style={styles.timelineRight}>
                                    <Text style={[styles.stepTitle, step.active && { color: COLORS.primary, fontWeight: '700' }]}>{step.title}</Text>
                                    <Text style={styles.stepTime}>{step.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>NỘI DUNG CHI TIẾT ({reportData.details?.length || 0})</Text>
                    {reportData.details?.map((device, index) => (
                        <View key={index} style={[styles.deviceCard, { marginBottom: 15 }]}>
                            <View style={styles.deviceHeader}>
                                <MaterialCommunityIcons name="tools" size={20} color={COLORS.primary} />
                                <Text style={styles.deviceName}>{device.tenThietBi}</Text>
                            </View>
                            <Text style={styles.descText}>{device.moTa}</Text>

                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
                                <TouchableOpacity
                                    onPress={() => handleViewImage(device.images)}
                                    activeOpacity={0.8}
                                >
                                    <Image
                                        source={{ uri: device.images }}
                                        style={styles.evidenceImg}
                                    />
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    ))}
                </View>

                <View style={styles.landlordCard}>
                    <View style={styles.landlordInfo}>
                        <View style={styles.avatar}>
                            <MaterialIcons name="person" size={24} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.landlordName}>Chủ nhà hỗ trợ</Text>
                            <Text style={styles.landlordSub}>Sẽ liên lạc cho bạn sớm nhất</Text>
                        </View>
                    </View>
                    <View style={styles.contactActions}>
                        <TouchableOpacity
                            style={[styles.contactBtn, { backgroundColor: '#22c55e15' }]}
                            onPress={() => makeCall("0868642533")}
                        >
                            <MaterialIcons name="phone" size={20} color="#22c55e" />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* MODAL PHÓNG TO ẢNH */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <TouchableOpacity
                        style={styles.closeModalBtn}
                        onPress={() => setModalVisible(false)}
                    >
                        <MaterialIcons name="close" size={32} color="white" />
                    </TouchableOpacity>

                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />
                    )}
                </View>
            </Modal>

        </SafeAreaView>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scrollContent: { padding: 20 },
    statusBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 15,
        marginBottom: 20,
        gap: 10,
    },
    statusText: { fontSize: 15, fontWeight: 'bold' },

    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 12, fontWeight: 'bold', color: COLORS.textMuted, marginBottom: 15, letterSpacing: 1 },

    timelineContainer: { backgroundColor: 'white', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    timelineItem: { flexDirection: 'row' },
    timelineLeft: { alignItems: 'center', marginRight: 15 },
    timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
    timelineLine: { width: 2, flex: 1, backgroundColor: '#e2e8f0', marginVertical: 4 },
    timelineRight: { paddingBottom: 20 },
    stepTitle: { fontSize: 15, color: COLORS.textMain, fontWeight: '600' },
    stepTime: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

    deviceCard: { backgroundColor: 'white', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    deviceHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
    deviceName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    descText: { fontSize: 14, color: COLORS.textMuted, lineHeight: 22 },
    evidenceImg: { width: 140, height: 140, borderRadius: 15, marginRight: 12 },

    landlordCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 10,
    },
    landlordInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.bgLight, justifyContent: 'center', alignItems: 'center' },
    landlordName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    landlordSub: { fontSize: 12, color: COLORS.textMuted },
    contactActions: { flexDirection: 'row', gap: 10 },
    contactBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },

    // Modal styles
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullImage: {
        width: width,
        height: height * 0.8,
    },
    closeModalBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 30,
        right: 20,
        zIndex: 100,
        padding: 5,
    },
});

export default ChiTietBaoCaoTenantScreen;
