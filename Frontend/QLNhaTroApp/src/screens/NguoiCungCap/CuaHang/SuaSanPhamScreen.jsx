import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    StatusBar,
    Image,
    KeyboardAvoidingView,
    Platform,
    Switch,
    Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../../components/AppHeader';
import { useProductManagement } from '../../../hooks/product/useProductManagement';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import LoadingOverlay from '../../../components/LoadingOverlay';

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    danger: '#ef4444',
};

const SuaSanPhamScreen = ({ navigation, route }) => {
    const productData = route.params?.product;
    const { user } = useUserProviderProfile();
    const { updateProduct, removeProduct, loading } = useProductManagement(user?.maNcc);

    if (!productData) {
        navigation.goBack();
        return null;
    }

    const [name, setName] = useState(productData.tenDv);
    const [price, setPrice] = useState(new Intl.NumberFormat('vi-VN').format(productData.giaTien));
    const [priceRaw, setPriceRaw] = useState(productData.giaTien.toString());
    const [desc, setDesc] = useState(productData.moTaCt || '');
    const [unit, setUnit] = useState(productData.donViTinh || '');
    const [inStock, setInStock] = useState(productData.ttcungCap === 'Sẵn sàng');
    const [image, setImage] = useState(productData.hinhAnh);
    const [imageNew, setImageNew] = useState(null);

    const formatCurrency = (value) => {
        if (!value) return '';
        const numberString = value.replace(/[^0-9]/g, '');
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const handlePriceChange = (value) => {
        const raw = value.replace(/[^0-9]/g, '');
        setPriceRaw(raw);
        setPrice(formatCurrency(raw));
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setImageNew(result.assets[0].uri);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa sản phẩm này khỏi cửa hàng?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        const success = await removeProduct(productData.maDv);
                        if (success) navigation.goBack();
                    }
                }
            ]
        );
    };

    const handleUpdate = async () => {
        if (!name || !priceRaw) {
            alert("Vui lòng nhập tên và giá sản phẩm");
            return;
        }

        const formData = new FormData();
        formData.append('MaNcc', user.maNcc);
        formData.append('TenDv', name);
        formData.append('MoTaCt', desc || '');
        formData.append('GiaTien', priceRaw);
        formData.append('DonViTinh', unit);
        formData.append('TtcungCap', inStock ? 'Sẵn sàng' : 'Hết hàng');

        if (imageNew) {
            const uri = Platform.OS === 'ios' ? imageNew.replace('file://', '') : imageNew;
            const fileName = imageNew.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('HinhAnhFile', {
                uri: imageNew,
                name: fileName,
                type: type,
            });
        }

        const success = await updateProduct(productData.maDv, formData);
        if (success) {
            navigation.goBack();
        }
    };

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
                    <Text style={styles.headerTitle}>Sửa sản phẩm</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle} onPress={handleDelete}>
                        <MaterialIcons name="delete-outline" size={24} color={COLORS.danger} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Image Section */}
                    <View style={styles.imageSection}>
                        <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.image} />
                            ) : (
                                <View style={styles.emptyImageIcon}>
                                    <MaterialIcons name="add-a-photo" size={40} color={COLORS.textSecondary} />
                                </View>
                            )}
                            <View style={styles.editBadge}>
                                <MaterialIcons name="edit" size={14} color="white" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Form Section */}
                    <View style={styles.section}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Tên sản phẩm / Dịch vụ</Text>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                                placeholder="Tên sản phẩm"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Giá bán (VNĐ)</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={handlePriceChange}
                                placeholder="Nhập giá bán"
                                keyboardType="numeric"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Đơn vị tính</Text>
                            <TextInput
                                style={styles.input}
                                value={unit}
                                onChangeText={setUnit}
                                placeholder="Ví dụ: Bình, Cái, Thùng..."
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mô tả chi tiết</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={desc}
                                onChangeText={setDesc}
                                placeholder="Mô tả sản phẩm..."
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <View>
                                <Text style={styles.switchLabel}>Đang kinh doanh</Text>
                                <Text style={styles.switchSubLabel}>Hiện sản phẩm cho khách hàng</Text>
                            </View>
                            <Switch
                                trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
                                thumbColor="white"
                                onValueChange={setInStock}
                                value={inStock}
                            />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Action */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate} disabled={loading}>
                    <Text style={styles.saveBtnText}>{loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}</Text>
                </TouchableOpacity>
            </View>
            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 20, fontWeight: 'bold', color: COLORS.textMain },
    iconCircle: { padding: 8, borderRadius: 20 },
    scrollContent: { padding: 20, paddingBottom: 40 },

    imageSection: { alignItems: 'center', marginBottom: 24 },
    imagePlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    image: { width: '100%', height: '100%' },
    editBadge: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: COLORS.primary,
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },

    section: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, marginLeft: 4 },
    inputGroup: { marginBottom: 20 },
    input: {
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 15,
        color: COLORS.textMain,
    },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },
    pickerSim: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    pickerText: { fontSize: 15, color: COLORS.textMain },

    switchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 8,
    },
    switchLabel: { fontSize: 15, fontWeight: 'bold', color: COLORS.textMain },
    switchSubLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

    footer: {
        padding: 20,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    },
    saveBtn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
    },
    saveBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default SuaSanPhamScreen;
