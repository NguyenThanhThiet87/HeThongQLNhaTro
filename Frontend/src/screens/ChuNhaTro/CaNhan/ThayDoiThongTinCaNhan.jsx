import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    Image, ScrollView, SafeAreaView, StatusBar,
    KeyboardAvoidingView, Platform, useColorScheme
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllNganHangApi } from '../../../api/NganHang';

import { useEditCntProfile } from '../../../hooks/user/useUserOwnerProfile';
import ComboBox from '../../../components/ComboBox';

import InputGroup from '../../../components/InputGroup';
import AppHeader from '../../../components/AppHeader';
import RadioButton from '../../../components/RadioButton';
import InputCalendar from '../../../components/InputCalendar';
import * as ImagePicker from 'expo-image-picker';
import toast from '../../../utils/toast';
import LoadingOverlay from '../../../components/LoadingOverlay';

const ThayDoiThongTinCaNhan = ({ route }) => {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();

    const [loaiNganHang, setLoaiNganHang] = useState(null);
    const [loaiNganHangList, setLoaiNganHangList] = useState([]);

    const [fullNameError, setFullNameError] = useState('');
    const [idCardError, setIdCardError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [soDienThoaiError, setSoDienThoaiError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [tenNhError, setTenNhError] = useState('');
    const [soGpkdError, setSoGpkdError] = useState('');
    const [soTkError, setSoTkError] = useState('');

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });
        if (!result.canceled) {
            setAvatar(result.assets[0].uri); // Cập nhật avatar
        }
    };

    useEffect(() => {
        const fetchNganHang = async () => {
            try {
                const response = await getAllNganHangApi();
                const nganHangData = response.data; // response.data là mảng ngân hàng

                const loaiNganHangList = nganHangData.map(bank => ({
                    label: bank.shortName,
                    value: bank.id,
                }));

                setLoaiNganHangList(loaiNganHangList); // Đúng kiểu mảng

            } catch (error) {
                console.error("Lỗi khi lấy danh sách ngân hàng:", error);
            }
        }
        fetchNganHang();
    }, []);

    const {
        loading,
        maNd, setMaNd,
        avatar, setAvatar,
        fullName, setFullName,
        ngaySinh, setNgaySinh,
        idCard, setIdCard,
        soDienThoai,
        address, setAddress,
        gioiTinh, setGioiTinh,
        tenNh, setTenNh,
        soTk, setSoTk,
        soGpkd, setSoGpkd,

        handleSaveChanges

    } = useEditCntProfile(route.params.maNd, navigation);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bgLight }]}>

            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Thay Đổi Thông Tin</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Profile Picture Section */}
                    <View style={styles.profilePicSection}>
                        <View style={styles.avatarWrapper}>
                            <Image
                                source={{ uri: avatar || 'https://i.pravatar.cc/300' }}
                                style={[styles.avatar, { borderColor: COLORS.primary + '33' }]}
                            />
                            <TouchableOpacity style={styles.cameraBtn} onPress={handlePickImage}>
                                <MaterialIcons name="photo-camera" size={18} color={COLORS.bgDark} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>THAY ĐỔI ẢNH ĐẠI DIỆN</Text>
                    </View>

                    {/* Form Section */}
                    <View style={styles.form}>

                        {/* Họ tên */}
                        <InputGroup
                            label="Họ Tên"
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Nhập họ tên..."
                            error={fullNameError}
                            errorStyle={{ color: COLORS.danger }}
                            iconName="description"
                        />

                        {/* Số điện thoại (Read-only) */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label]}>Số điện thoại</Text>
                            <View style={styles.rowInput}>
                                <View style={[styles.input, styles.readonlyInput, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, flex: 1 }]}>
                                    <Text style={{ color: COLORS.inputText }}>{soDienThoai || 'Chưa cập nhật'}</Text>
                                    <MaterialIcons name="lock" size={18} color={COLORS.inputText} />
                                </View>
                                <TouchableOpacity style={styles.changeBtn} onPress={() => navigation.navigate("ThayDoiSoDienThoai")}>
                                    <Text style={styles.changeBtnText}>Thay đổi</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Giới tính */}
                        <Text style={styles.label}>GIỚI TÍNH</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                            <RadioButton
                                checked={gioiTinh == 1}
                                onPress={() => setGioiTinh(1)}
                                text="Nam"
                                radioOuterStyle={styles.radioOuter}
                                radioInnerStyle={styles.radioInner}
                            />
                            <RadioButton
                                checked={gioiTinh === 0}
                                onPress={() => setGioiTinh(0)}
                                text="Nữ"
                                radioOuterStyle={styles.radioOuter}
                                radioInnerStyle={styles.radioInner}
                                style={{ marginLeft: 24 }}
                            />
                        </View>

                        {/* Ngày sinh */}
                        <InputCalendar
                            value={ngaySinh || ""}
                            onChange={setNgaySinh}
                            label="NGÀY SINH"
                            maximumDate={new Date()}
                        />

                        {/* Số CCCD */}
                        <InputGroup
                            label="Số CCCD"
                            value={idCard || ""}
                            onChangeText={setIdCard}
                            placeholder="Nhập số CCCD..."
                            error={idCardError}
                            errorStyle={{ color: COLORS.danger }}
                            iconName="description"
                        />

                        {/* Địa chỉ */}
                        <InputGroup
                            label="ĐỊA CHỈ"
                            value={address || ""}
                            onChangeText={setAddress}
                            placeholder="Nhập địa chỉ..."
                            error={addressError}
                            errorStyle={{ color: COLORS.danger }}
                            iconName="description"
                            numberOfLines={5}
                        />

                        {/* Số giấy phép kinh doanh */}
                        <InputGroup
                            label="Số giấy phép kinh doanh"
                            value={soGpkd || ""}
                            onChangeText={setSoGpkd}
                            placeholder="Nhập số giấy phép..."
                            error={soGpkdError}
                            errorStyle={{ color: COLORS.danger }}
                            iconName="description"
                        />
                        {/* Tài khoản ngân hàng nhận tiền */}
                        <View style={styles.boxNguoiLienHe}>
                            <View style={styles.headerNguoiLienHe}>
                                <MaterialIcons name="contact-phone" size={22} color={COLORS.primary} />
                                <Text style={styles.titleNguoiLienHe}>TÀI KHOẢN NGÂN HÀNG</Text>
                            </View>
                            <Text style={[styles.label, { marginBottom: 0 }]}>LOẠI NGÂN HÀNG</Text>
                            <ComboBox
                                data={loaiNganHangList}
                                value={loaiNganHang}
                                onChange={(item) => {
                                    setLoaiNganHang(item?.value || item);
                                    setTenNh(item?.label || item?.shortName || item);
                                }}
                                labelField="label"
                                valueField="value"
                                search={true}
                                searchPlaceholder="Tìm kiếm..."
                            />

                            <InputGroup
                                label="SỐ TÀI KHOẢN NGÂN HÀNG"
                                value={soTk || ""}
                                onChangeText={setSoTk}
                                placeholder="Nhập số tài khoản..."
                                error={soTkError}
                                errorStyle={{ color: "#e53935" }}
                                iconName="description"
                            />
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer Action */}
            <View style={[styles.footer, { backgroundColor: COLORS.bgLight, borderTopColor: COLORS.border }]}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveChanges}>
                    <MaterialIcons name="save" size={20} color={COLORS.buttonText} />
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>
            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scrollContent: { paddingBottom: 120 },

    profilePicSection: { alignItems: 'center', paddingVertical: 32 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 128, height: 128, borderRadius: 64, borderWidth: 4 },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        padding: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.bgDark,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    changePhotoText: { marginTop: 16, color: COLORS.primary, fontSize: 13, fontWeight: '700', letterSpacing: 1 },

    form: { px: 16, paddingHorizontal: 16, gap: 10 },
    inputGroup: { marginBottom: 10 },
    label: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textMain,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    input: {
        height: 45,
        borderRadius: 16,
        borderWidth: 1,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    readonlyInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    rowInput: { flexDirection: 'row', gap: 10 },
    changeBtn: {
        height: 45,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(19, 200, 236, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(19, 200, 236, 0.3)',
        borderRadius: 16,
        justifyContent: 'center',
    },
    changeBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },

    inputWithIconWrapper: { position: 'relative' },
    rightIcon: { position: 'absolute', right: 16, top: 18 },
    textArea: { height: 110, paddingTop: 16, paddingRight: 45 },

    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        borderTopWidth: 1,
    },
    saveBtn: {
        backgroundColor: COLORS.buttonBg,
        height: 58,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: COLORS.buttonBg,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    saveBtnText: { color: COLORS.buttonText, fontSize: 16, fontWeight: '800' },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    radioOuterActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.bgDark,
    },
    boxNguoiLienHe: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        padding: 16,
        marginVertical: 16,
        gap: 8,
        shadowColor: "#948f8f",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
    },
    headerNguoiLienHe: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
    },
    titleNguoiLienHe: {
        fontSize: 16,
        fontWeight: "700",
        color: COLORS.textMain,
        textTransform: "uppercase",
        letterSpacing: 1,
    },
});

export default ThayDoiThongTinCaNhan;