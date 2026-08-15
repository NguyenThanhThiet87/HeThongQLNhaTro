import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    TextInput,
    Alert,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { createDonHangApi } from '../../../api/DonHang';
import { getTenantHomeService } from '../../../services/dichVuService';
import { useAuth } from '../../../context/AuthContext';
import LoadingOverlay from '../../../components/LoadingOverlay';
import toast from '../../../utils/toast';

const COLORS = {
    primary: "#2563eb",
    bgLight: "#f8fafc",
    card: "#ffffff",
    textMain: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
};

const XacNhanDatDichVuScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useAuth();
    const { service } = route.params;

    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [note, setNote] = useState('');
    const [address, setAddress] = useState('Đang tải địa chỉ...');
    const [homeInfo, setHomeInfo] = useState(null);

    useEffect(() => {
        fetchHomeAddress();
    }, []);

    const fetchHomeAddress = async () => {
        try {
            const res = await getTenantHomeService(user.maNd);
            if (res.success) {
                setHomeInfo(res.data);
                setAddress(res.data.diaChi || "Chưa cập nhật địa chỉ nhà trọ");
            } else {
                setAddress("Không tìm thấy địa chỉ nhà trọ");
            }
        } catch (error) {
            setAddress("Lỗi khi tải địa chỉ");
        }
    };

    const handleIncrease = () => setQuantity(prev => prev + 1);
    const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const totalAmount = (service?.giaTien || 0) * quantity;

    const handleConfirmBooking = async () => {
        setLoading(true);
        try {
            const orderData = {
                MaNt: user.maNd,
                GhiChu: note,
                ChiTiet: [
                    {
                        MaDv: service.maDv,
                        SoLuong: quantity
                    }
                ]
            };

            const response = await createDonHangApi(orderData);
            console.log(response)
            if (response.success) {
                Alert.alert(
                    "Thành công",
                    "Đặt dịch vụ thành công! Bạn có thể theo dõi tiến độ đơn hàng trong phần Lịch sử.",
                    [{ text: "OK", onPress: () => navigation.navigate("LichSuDatDichVu") }]
                );
            } else {
                Alert.alert("Lỗi", response.message || "Không thể đặt hàng");
            }
        } catch (error) {
            console.error("Booking error:", error);
            Alert.alert("Lỗi", "Có lỗi xảy ra trong quá trình đặt hàng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={<Text style={styles.headerTitle}>Xác nhận đặt lịch</Text>}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                {/* Tóm tắt dịch vụ */}
                <View style={styles.card}>
                    <View style={styles.serviceRow}>
                        <Image source={{ uri: service?.hinhAnh || 'https://via.placeholder.com/100' }} style={styles.serviceImage} />
                        <View style={styles.serviceInfo}>
                            <Text style={styles.serviceName}>{service?.tenDv}</Text>
                            <Text style={styles.providerName}>Cung cấp bởi: {service?.provider?.hoTen}</Text>
                            <Text style={styles.price}>{service?.giaTien?.toLocaleString()}đ / {service?.donViTinh}</Text>
                        </View>
                    </View>
                </View>

                {/* Chọn số lượng */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="shopping-cart" size={20} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Số lượng</Text>
                    </View>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity style={styles.quantityBtn} onPress={handleDecrease}>
                            <MaterialIcons name="remove" size={20} color={COLORS.textMain} />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{quantity}</Text>
                        <TouchableOpacity style={styles.quantityBtn} onPress={handleIncrease}>
                            <MaterialIcons name="add" size={20} color={COLORS.textMain} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Địa chỉ nhận dịch vụ */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="location-on" size={20} color="#ef4444" />
                        <Text style={styles.sectionTitle}>Địa chỉ nhận dịch vụ</Text>
                    </View>
                    <View style={styles.addressBox}>
                        <Text style={styles.addressText}>{address}</Text>
                    </View>
                    <Text style={styles.addressHint}>* Dịch vụ sẽ được thực hiện tại địa chỉ nhà trọ bạn đang thuê.</Text>
                </View>

                {/* Ghi chú */}
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <MaterialIcons name="note-add" size={20} color="#f59e0b" />
                        <Text style={styles.sectionTitle}>Ghi chú thêm</Text>
                    </View>
                    <TextInput
                        style={styles.noteInput}
                        placeholder="VD: Mang thêm đá, gọi trước khi đến..."
                        placeholderTextColor={COLORS.textSecondary}
                        multiline
                        numberOfLines={4}
                        value={note}
                        onChangeText={setNote}
                    />
                </View>

                {/* Chi tiết thanh toán */}
                <View style={styles.card}>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Giá dịch vụ</Text>
                        <Text style={styles.paymentValue}>{service?.giaTien?.toLocaleString()}đ</Text>
                    </View>
                    <View style={styles.paymentRow}>
                        <Text style={styles.paymentLabel}>Số lượng</Text>
                        <Text style={styles.paymentValue}>x{quantity}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.paymentRow}>
                        <Text style={styles.totalLabel}>Tổng cộng</Text>
                        <Text style={styles.totalAmount}>{totalAmount.toLocaleString()}đ</Text>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking}>
                    <Text style={styles.confirmBtnText}>XÁC NHẬN ĐẶT DỊCH VỤ</Text>
                </TouchableOpacity>
            </View>

            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
    content: { padding: 16 },
    card: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    serviceRow: { flexDirection: 'row', alignItems: 'center' },
    serviceImage: { width: 80, height: 80, borderRadius: 12 },
    serviceInfo: { flex: 1, marginLeft: 12 },
    serviceName: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    providerName: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
    price: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary, marginTop: 6 },

    sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 8 },
    sectionTitle: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },

    quantityContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
    quantityBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.bgLight, justifyContent: 'center', alignItems: 'center' },
    quantityText: { fontSize: 18, fontWeight: 'bold', marginHorizontal: 24, minWidth: 20, textAlign: 'center' },

    addressBox: { backgroundColor: COLORS.bgLight, padding: 12, borderRadius: 12, borderLeftWidth: 4, borderLeftColor: "#ef4444" },
    addressText: { fontSize: 14, color: COLORS.textMain, lineHeight: 20 },
    addressHint: { fontSize: 11, color: COLORS.textSecondary, marginTop: 8, fontStyle: 'italic' },

    noteInput: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 12,
        padding: 12,
        color: COLORS.textMain,
        textAlignVertical: 'top',
        fontSize: 14,
    },

    paymentRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    paymentLabel: { fontSize: 14, color: COLORS.textSecondary },
    paymentValue: { fontSize: 14, color: COLORS.textMain, fontWeight: '500' },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
    totalLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain },
    totalAmount: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.card,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    confirmBtn: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    confirmBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default XacNhanDatDichVuScreen;
