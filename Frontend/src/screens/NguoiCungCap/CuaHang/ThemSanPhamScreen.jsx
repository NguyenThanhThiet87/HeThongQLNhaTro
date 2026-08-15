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
    Image,
    KeyboardAvoidingView,
    Platform,
    Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AppHeader from '../../../components/AppHeader';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import { useProductManagement } from '../../../hooks/product/useProductManagement';
import LoadingOverlay from '../../../components/LoadingOverlay';
import ComboBox from '../../../components/ComboBox';

const COLORS = {
    primary: '#ec5b13',
    primaryLight: '#fdf0e8',
    bgLight: '#f8f6f6',
    textMain: '#0f172a',
    textSecondary: '#64748b',
    border: '#e2e8f0',
    white: '#ffffff',
    success: '#10b981',
};

const DANH_MUC = [
    { label: 'Nước uống', value: 'Nước uống' },
    { label: 'Gas & Bếp', value: 'Gas & Bếp' },
    { label: 'Điện & Nước', value: 'Điện & Nước' },
    { label: 'Sửa chữa', value: 'Sửa chữa' },
    { label: 'Khác', value: 'Khác' },
];

const ThemSanPhamScreen = ({ navigation }) => {
    const { user } = useUserProviderProfile();
    const { addProduct, loading } = useProductManagement(user?.maNcc);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Khác');
    const [unit, setUnit] = useState('Bình');
    const [inStock, setInStock] = useState(true);
    const [image, setImage] = useState(null);
    const [priceRaw, setPriceRaw] = useState('');

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
        }
    };

    const handleAdd = async () => {
        if (!name || !priceRaw) {
            alert("Vui lòng nhập tên và giá sản phẩm");
            return;
        }

        if (!image) {
            alert("Vui lòng chọn ảnh cho sản phẩm");
            return;
        }

        const formData = new FormData();
        formData.append('MaNcc', user.maNcc);
        formData.append('TenDv', name);
        formData.append('MoTaCt', desc || '');
        formData.append('GiaTien', price.replace(/[^0-9]/g, ''));
        formData.append('DonViTinh', unit);
        formData.append('TtcungCap', inStock ? 'Sẵn sàng' : 'Hết hàng');

        if (image) {
            const uri = Platform.OS === 'ios' ? image.replace('file://', '') : image;
            const fileName = image.split('/').pop();
            const match = /\.(\w+)$/.exec(fileName);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('HinhAnhFile', {
                uri: image,
                name: fileName,
                type: type,
            });
        }

        const success = await addProduct(formData);
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
                    <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
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
                                    <Text style={styles.emptyImageText}>Thêm ảnh sản phẩm</Text>
                                </View>
                            )}
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
                                placeholder="Ví dụ: Bình nước Vĩnh Hảo 20L"
                            />
                        </View>

                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 2 }]}>
                                <Text style={styles.label}>Giá bán (VNĐ)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={price}
                                    onChangeText={handlePriceChange}
                                    placeholder="Nhập giá bán"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, { flex: 1, marginLeft: 12 }]}>
                                <Text style={styles.label}>Đơn vị</Text>
                                <TextInput
                                    style={styles.input}
                                    value={unit}
                                    onChangeText={setUnit}
                                    placeholder="Ví dụ: Bình, Cái..."
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Mô tả chi tiết</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={desc}
                                onChangeText={setDesc}
                                placeholder="Mô tả về sản phẩm, dịch vụ của bạn..."
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <View>
                                <Text style={styles.switchLabel}>Đang kinh doanh</Text>
                                <Text style={styles.switchSubLabel}>Hiển thị sản phẩm trên cửa hàng</Text>
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
                <TouchableOpacity style={styles.saveBtn} onPress={handleAdd} disabled={loading}>
                    <Text style={styles.saveBtnText}>{loading ? 'Đang xử lý...' : 'Hoàn tất thêm mới'}</Text>
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
    row: { flexDirection: 'row', alignItems: 'center' },

    imageSection: { alignItems: 'center', marginBottom: 24 },
    imagePlaceholder: {
        width: 150,
        height: 150,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: COLORS.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: { width: '100%', height: '100%' },
    emptyImageIcon: { alignItems: 'center' },
    emptyImageText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 8, fontWeight: '500' },

    section: { marginBottom: 24 },
    label: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
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

export default ThemSanPhamScreen;
