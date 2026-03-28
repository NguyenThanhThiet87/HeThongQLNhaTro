import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import { useProductManagement } from '../../../hooks/product/useProductManagement';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { createManualDonHangService } from '../../../services/donHangService';
import { Alert } from 'react-native';
import toast from '../../../utils/toast';
import formatPhoneNumber from '../../../utils/formatPhoneNumber';

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    success: '#10b981',
    danger: '#ef4444',
};

const LapDonHangScreen = ({ navigation }) => {
    const { user } = useUserProviderProfile();
    const { products: availableProducts, loading: productsLoading } = useProductManagement(user?.maNcc);

    const [customerName, setCustomerName] = useState('');
    const [roomNo, setRoomNo] = useState('');
    const [phone, setPhone] = useState('');
    const [note, setNote] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [selectedProducts, setSelectedProducts] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const handleAddProduct = (product) => {
        setSelectedProducts(prev => {
            const existing = prev.find(p => p.maDv === product.maDv);
            if (existing) {
                return prev.map(p => p.maDv === product.maDv ? { ...p, quantity: p.quantity + 1 } : p);
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (maDv, delta) => {
        setSelectedProducts(prev => prev.map(p =>
            p.maDv === maDv ? { ...p, quantity: Math.max(1, p.quantity + delta) } : p
        ));
    };

    const removeProduct = (maDv) => {
        setSelectedProducts(prev => prev.filter(p => p.maDv !== maDv));
    };

    const handleSubmit = async () => {
        if (!customerName || !roomNo || !phone) {
            toast.error("Vui lòng nhập đầy đủ thông tin khách hàng");
            return;
        }

        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm");
            return;
        }

        Alert.alert(
            "Xác nhận",
            "Bạn có chắc chắn muốn lập đơn hàng này không?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xác nhận",
                    onPress: async () => {
                        setSubmitting(true);
                        try {
                            const data = {
                                hoTen: customerName,
                                soDt: formatPhoneNumber(phone),
                                soPhong: roomNo,
                                ghiChu: note,
                                chiTiet: selectedProducts.map(p => ({
                                    maDv: p.maDv,
                                    soLuong: p.quantity
                                }))
                            };

                            const res = await createManualDonHangService(data);
                            if (res.success) {
                                Alert.alert("Thành công", "Lập đơn hàng thành công!");
                                // Reset form
                                setCustomerName('');
                                setRoomNo('');
                                setPhone('');
                                setNote('');
                                setSelectedProducts([]);
                                navigation.goBack();
                            } else {
                                toast.error(res.message || "Lỗi khi lập đơn hàng");
                            }
                        } catch (error) {
                            toast.error("Có lỗi xảy ra: " + error.message);
                        } finally {
                            setSubmitting(false);
                        }
                    }
                }
            ]
        );
    };

    const totalPrice = selectedProducts.reduce((sum, item) => sum + (item.giaTien * item.quantity), 0);

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
                    <Text style={styles.headerTitle}>Lập đơn hàng</Text>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Customer Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
                        <View style={styles.card}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Họ và tên</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập tên khách hàng"
                                    value={customerName}
                                    onChangeText={setCustomerName}
                                />
                            </View>
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                                    <Text style={styles.label}>Số phòng</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: 101"
                                        value={roomNo}
                                        onChangeText={setRoomNo}
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1.5 }]}>
                                    <Text style={styles.label}>Số điện thoại</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập SĐT"
                                        keyboardType="phone-pad"
                                        value={phone}
                                        onChangeText={setPhone}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Products Selection Section */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Sản phẩm đã chọn</Text>
                            <TouchableOpacity style={styles.addBtn} onPress={() => setIsModalVisible(true)}>
                                <MaterialIcons name="add-shopping-cart" size={20} color={COLORS.primary} />
                                <Text style={styles.addBtnText}>Thêm món</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.selectedList}>
                            {selectedProducts.length > 0 ? (
                                selectedProducts.map(item => (
                                    <View key={item.maDv} style={styles.productItem}>
                                        <View style={styles.productMain}>
                                            <Text style={styles.productName}>{item.tenDv}</Text>
                                            <Text style={styles.productPrice}>{item.giaTien.toLocaleString()}đ</Text>
                                        </View>
                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity onPress={() => item.quantity > 1 ? updateQuantity(item.maDv, -1) : removeProduct(item.maDv)} style={styles.qtyBtn}>
                                                <MaterialIcons name={item.quantity > 1 ? "remove" : "delete-outline"} size={20} color={item.quantity > 1 ? COLORS.textSecondary : COLORS.danger} />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyValue}>{item.quantity}</Text>
                                            <TouchableOpacity onPress={() => updateQuantity(item.maDv, 1)} style={styles.qtyBtn}>
                                                <MaterialIcons name="add" size={20} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptySelected}>
                                    <MaterialIcons name="shopping-basket" size={40} color={COLORS.border} />
                                    <Text style={styles.emptySelectedText}>Chưa chọn món nào</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* Note Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ghi chú</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Ghi chú thêm cho đơn hàng..."
                            multiline
                            numberOfLines={4}
                            value={note}
                            onChangeText={setNote}
                        />
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Summary & Action */}
            <View style={styles.bottomBar}>
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Tổng cộng:</Text>
                    <Text style={styles.summaryTotal}>{totalPrice.toLocaleString()}đ</Text>
                </View>
                <TouchableOpacity
                    style={[styles.submitBtn, (selectedProducts.length === 0 || submitting) && { opacity: 0.5 }]}
                    onPress={handleSubmit}
                    disabled={selectedProducts.length === 0 || submitting}
                >
                    <Text style={styles.submitBtnText}>{submitting ? 'Đang xử lý...' : 'Xác nhận lập đơn'}</Text>
                </TouchableOpacity>
            </View>

            {/* Product Selection Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Chọn sản phẩm</Text>
                            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={COLORS.textMain} />
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={availableProducts?.filter(p => p.ttcungCap === 'Sẵn sàng')}
                            keyExtractor={item => item.maDv.toString()}
                            contentContainerStyle={styles.productList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.availableItem}
                                    onPress={() => handleAddProduct(item)}
                                >
                                    <Image
                                        source={{ uri: item.hinhAnh || 'https://via.placeholder.com/150' }}
                                        style={styles.availableImg}
                                    />
                                    <View style={styles.availableInfo}>
                                        <Text style={styles.availableName}>{item.tenDv}</Text>
                                        <Text style={styles.availablePrice}>{item.giaTien.toLocaleString()}đ / {item.donViTinh}</Text>
                                    </View>
                                    <View style={styles.addCircle}>
                                        <MaterialIcons name="add" size={20} color="white" />
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <MaterialIcons name="inventory-2" size={48} color={COLORS.border} />
                                    <Text style={styles.emptyText}>Cửa hàng hiện không có món nào sẵn sàng</Text>
                                </View>
                            }
                        />

                        <TouchableOpacity
                            style={styles.doneBtn}
                            onPress={() => setIsModalVisible(false)}
                        >
                            <Text style={styles.doneBtnText}>Xong</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <LoadingOverlay visible={productsLoading || submitting} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    iconCircle: { padding: 8, borderRadius: 20 },
    scrollContent: { padding: 16, paddingBottom: 40 },
    section: { marginBottom: 24 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 6, fontWeight: '500' },
    input: {
        backgroundColor: COLORS.bgLight,
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: COLORS.border,
        color: COLORS.textMain,
    },
    row: { flexDirection: 'row' },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    addBtnText: { color: COLORS.primary, fontWeight: 'bold' },

    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    productMain: { flex: 1 },
    productName: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    productPrice: { fontSize: 14, color: COLORS.primary, marginTop: 4, fontWeight: '600' },
    quantityControl: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.bgLight, borderRadius: 20, padding: 4 },
    qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', elevation: 1 },
    qtyValue: { marginHorizontal: 12, fontWeight: 'bold', minWidth: 20, textAlign: 'center' },

    bottomBar: {
        backgroundColor: 'white',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    summaryLabel: { fontSize: 16, color: COLORS.textSecondary },
    summaryTotal: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary },
    submitBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        elevation: 6,
    },
    submitBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    productList: {
        paddingBottom: 20,
    },
    availableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: COLORS.bgLight,
        borderRadius: 16,
        marginBottom: 12,
        gap: 12,
    },
    availableImg: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'white',
    },
    availableInfo: {
        flex: 1,
    },
    availableName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textMain,
    },
    availablePrice: {
        fontSize: 13,
        color: COLORS.primary,
        marginTop: 2,
    },
    addCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    doneBtn: {
        backgroundColor: COLORS.textMain,
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    doneBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        marginTop: 20,
    },
    emptyText: {
        marginTop: 12,
        color: COLORS.textSecondary,
        textAlign: 'center',
    },
    emptySelected: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    emptySelectedText: {
        marginTop: 8,
        color: COLORS.textSecondary,
        fontSize: 14,
    },
});

export default LapDonHangScreen;
