import React, { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    useColorScheme,
    Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import InputGroup from "../../../components/InputGroup";
import AppHeader from '../../../components/AppHeader';
import { capNhatLoaiPhongApi, getLoaiPApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import toast from "../../../utils/toast";
import { formatCurrency } from "../../../utils/formatCurrency";
import LoadingOverlay from "../../../components/LoadingOverlay";
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
    primary: "#13c8ec",
    bgLight: "#f6f8f8",
    bgDark: "#101f22",
    slate400: "#94a3b8",
    slate500: "#64748b",
    slate900: "#0f172a",
    white: "#ffffff",
    primaryAlpha05: "rgba(19, 200, 236, 0.05)",
    primaryAlpha10: "rgba(19, 200, 236, 0.1)",
    primaryAlpha20: "rgba(19, 200, 236, 0.2)",
    borderLight: "#e2e8f0", // slate-200
    borderDark: "rgba(19, 200, 236, 0.1)", // primary/10
    textLight: "#0f172a", // slate-900
    textDark: "#f1f5f9", // slate-100
    subTextLight: "#64748b", // slate-500
    subTextDark: "rgba(19, 200, 236, 0.6)", // primary/60
};

export default function SuaLoaiPhongScreen({ route }) {
    const navigation = useNavigation();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const maLoaiP = route.params?.maLoaiP;
    let flagNewImage = false;
    const [loading, setLoading] = useState(false);

    // State cho các trường nhập liệu
    const [roomName, setRoomName] = useState('');
    const [price, setPrice] = useState('');
    const [maxPeople, setMaxPeople] = useState('');
    const [description, setDescription] = useState('');

    const [roomNameError, setRoomNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [maxPeopleError, setMaxPeopleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    const theme = {
        background: isDark ? COLORS.bgDark : COLORS.bgLight,
        text: isDark ? "#f1f5f9" : COLORS.slate900,
        inputBg: isDark ? "#ffffff" : COLORS.subTextLight,
        placeholder: isDark ? COLORS.slate500 : COLORS.slate400,
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await getLoaiPApi(maLoaiP);
            console.log("Kết quả API getLoaiPApi:", result);
            if (result.success) {
                const data = result.data;
                setRoomName(data.tenLoaiP);
                setPrice(data.giaChuan.toString());
                setMaxPeople(data.snguoiToiDa.toString());
                setDescription(data.moTa || '');
                setImageUri(data.urlAnh || null);
                console.log("Thông tin loại phòng đã được tải thành công:", data);
            } else {
                console.log("Lấy thông tin loại phòng thất bại:", result.message);
            }
        };
        fetchData();
    }, []);

    const handleChangePrice = (text) => {
        // Loại bỏ tất cả ký tự không phải số
        const numericText = text.replace(/[^0-9]/g, '');
        setPrice(numericText);
    }

    const handleSave = async () => {
        setLoading(true);
        // Validate dữ liệu
        let isValid = true;
        if (!roomName.trim()) {
            setRoomNameError('Tên loại phòng không được để trống');
            isValid = false;
        } else setRoomNameError('');

        if (!price.trim() || isNaN(price)) {
            setPriceError('Giá tiền phải là một số hợp lệ');
            isValid = false;
        } else setPriceError('');

        if (!maxPeople.trim() || isNaN(maxPeople) || parseInt(maxPeople) <= 0) {
            setMaxPeopleError('Số người tối đa phải là một số nguyên dương');
            isValid = false;
        } else setMaxPeopleError('');

        if (!description.trim()) {
            setDescriptionError('Mô tả không được để trống');
            isValid = false;
        } else setDescriptionError('');

        if (isValid) {
            const data = {
                MaLoaiP: maLoaiP,
                TenLoaiP: roomName.trim(),
                GiaChuan: parseFloat(price),
                SnguoiToiDa: parseInt(maxPeople),
                MoTa: description.trim(),
                ...(imageUri ? { UrlAnh: imageUri } : {}),
            };

            // Nếu chọn ảnh mới (URI local), mới gửi lên API
            if (flagNewImage && imageUri) {
                data.UrlAnh = imageUri;
            }

            const result = await capNhatLoaiPhongApi(data);
            if (result.success) {
                navigation.goBack();
                toast.success("Loại phòng đã được cập nhật thành công!");
            } else {
                toast.error("Lỗi cập nhật loại phòng: " + result.message);
            }
        }
        setLoading(false);
    }

    const [imageUri, setImageUri] = useState(null);
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert("Bạn cần cấp quyền truy cập thư viện ảnh để tải ảnh lên!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            flagNewImage = true;
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: "#f6f8f8" }]}>

            {/* Header */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Sửa Loại phòng</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={theme.text} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Field: Tên loại phòng */}
                    <InputGroup
                        label="Tên loại phòng"
                        value={roomName}
                        onChangeText={setRoomName}
                        placeholder="Ví dụ: Deluxe King Suite"
                        placeholderTextColor={theme.placeholder}
                        iconName="hotel"
                        error={roomNameError}
                        errorStyle={{ color: "#e53935" }}
                    />

                    {/* Field: Giá tiền */}
                    <InputGroup
                        label="Giá tiền (VNĐ)"
                        value={formatCurrency(price)}
                        onChangeText={handleChangePrice}
                        placeholder="Ví dụ: 1000000"
                        placeholderTextColor={theme.placeholder}
                        iconName="payments"
                        error={priceError}
                        errorStyle={{ color: "#e53935" }}
                    />

                    {/* Field: Số người tối đa */}
                    <InputGroup
                        label="Số người tối đa"
                        value={maxPeople}
                        onChangeText={setMaxPeople}
                        placeholder="Ví dụ: 2"
                        placeholderTextColor={theme.placeholder}
                        iconName="group"
                        error={maxPeopleError}
                        errorStyle={{ color: "#e53935" }}
                    />

                    {/* Field: Mô tả */}
                    <InputGroup
                        label="Mô tả"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Nhập mô tả chi tiết về tiện nghi phòng..."
                        error={descriptionError}
                        errorStyle={{ color: "#e53935" }}
                        numberOfLines={5}
                        iconName="description"
                    />

                    {/* Image Preview Placeholder */}
                    <TouchableOpacity
                        style={[styles.imagePlaceholder, { borderColor: COLORS.primaryAlpha20 }]}
                        onPress={handlePickImage}
                        onLongPress={imageUri ? () => setImageUri(null) : undefined}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {imageUri ? (
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: imageUri }} style={styles.coverImage} />
                                <View style={styles.changeImageOverlay}>
                                    <MaterialIcons name="cameraswitch" size={18} color="#fff" />
                                    <Text style={styles.changeImageText}>Nhấn để đổi ảnh • Giữ để xóa</Text>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.imagePlaceholderContent}>
                                <MaterialIcons name="add-a-photo" size={32} color={COLORS.primary} />
                                <Text style={styles.imagePlaceholderText}>Thêm hình ảnh minh họa</Text>
                                <Text style={styles.imagePlaceholderSub}>Khuyến nghị ảnh ngang (16:9)</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Action Buttons */}
            <View style={[styles.footer, { borderTopColor: COLORS.primaryAlpha10 }]}>
                <View style={styles.footerButtons}>
                    <TouchableOpacity style={[styles.btnSecondary, { borderColor: COLORS.primaryAlpha20 }]} onPress={() => navigation.goBack()}>
                        <Text style={[styles.btnSecondaryText, { color: isDark ? "#cbd5e1" : "#475569" }]}>Hủy bỏ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnPrimary} onPress={() => handleSave()}>
                        <Text style={styles.btnPrimaryText}>Lưu thay đổi</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <LoadingOverlay visible={loading} message="Đang xử lý..." />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textLight,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'ios' ? 14 : 10,
        fontSize: 16,
    },
    inputWithIconWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputIcon: {
        position: 'absolute',
        left: 14,
        zIndex: 1,
        opacity: 0.6,
    },
    inputWithIcon: {
        paddingLeft: 46,
    },
    textArea: {
        height: 120,
        paddingTop: 14,
    },
    imagePlaceholder: {
        height: 120,
        width: '100%',
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        backgroundColor: COLORS.primaryAlpha05,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    imagePlaceholderContent: {
        alignItems: 'center',
        gap: 4,
    },
    imagePlaceholderText: {
        fontSize: 12,
        fontWeight: '500',
        color: COLORS.primary,
    },
    footer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 30 : 16,
        borderTopWidth: 1,
    },
    footerButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    btnSecondary: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    btnSecondaryText: {
        fontWeight: '600',
        fontSize: 16,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    btnPrimaryText: {
        color: COLORS.bgDark,
        fontWeight: '700',
        fontSize: 16,
    },
    imagePlaceholder: {
        height: 160,
        width: "100%",
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: "dashed",
        backgroundColor: COLORS.primaryAlpha05,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        overflow: "hidden",
    },
    imagePlaceholderContent: {
        alignItems: "center",
        gap: 4,
    },
    imagePlaceholderText: {
        fontSize: 12,
        fontWeight: "500",
        color: COLORS.primary,
    },
    imagePlaceholderSub: {
        fontSize: 12,
        color: COLORS.slate500,
    },
    imageWrapper: {
        width: "100%",
        height: "100%",
    },
    coverImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    changeImageOverlay: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        paddingVertical: 8,
        backgroundColor: "rgba(0,0,0,0.45)",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
    },
    changeImageText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "500",
    },
});