import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
    StyleSheet, View, Text, TextInput, TouchableOpacity,
    Image, ScrollView, SafeAreaView, StatusBar,
    KeyboardAvoidingView, Platform, useColorScheme
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getChuTroApi } from '../../../api/NguoiDung';
import { getTenGioiTinhByValue } from '../../../constants/GIOI_TINH';
import { getAllNganHangApi } from '../../../api/NganHang';

import InputGroup from '../../../components/InputGroup';
import AppHeader from '../../../components/AppHeader';
import DateTimePicker from '@react-native-community/datetimepicker';
import RadioButton from '../../../components/RadioButton';
import InputCalendar from '../../../components/InputCalendar';
import ComboBox from '../../../components/ComboBox';

// Bảng màu từ Tailwind Config của bạn
const COLORS = {
    primary: "#13c8ec",
    bgLight: "#f6f8f8",
    bgDark: "#101f22",
    surfaceDark: "#192f33",
    borderDark: "#325e67",
    mutedDark: "#92c0c9",
    white: "#ffffff",
    slate700: "#334155",
};

const PRIMARY = "#13c8ec";
const BORDER = "rgba(19,200,236,0.1)";

const ThongTinCaNhanScreen = ({ route }) => {
    const isDarkMode = false;
    const { maNd } = route.params;
    const navigation = useNavigation();

    const [nguoiThue, setNguoiThue] = React.useState(null);

    const [fullName, setFullName] = useState('Nguyễn Văn An');
    const [ngaySinh, setNgaySinh] = useState('15/05/1995');
    const [idCard, setIdCard] = useState('012345678912');
    const [address, setAddress] = useState('123 Đường Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh');
    const [loaiNganHang, setLoaiNganHang] = useState(null);
    const [soTKNH, setSoTKNH] = useState('0123456789');
    const [gioiTinh, setGioiTinh] = useState();
    const [businessLicense, setBusinessLicense] = useState('');
    const [loaiNganHangList, setLoaiNganHangList] = useState([]);

    const [fullNameError, setFullNameError] = useState('');
    const [idCardError, setIdCardError] = useState('');
    const [addressError, setAddressError] = useState('');
    const [businessLicenseError, setBusinessLicenseError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [soTKNHError, setSoTKNHError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await getChuTroApi(maNd);
            if (response.success) {
                setNguoiThue(response.data);
                setFullName(response.data.hoTen);
                setNgaySinh(response.data.ngaySinh);
                setIdCard(response.data.soCccd);
                setAddress(response.data.diaChi);
                setSoTKNH(response.data.soTKNH);
                setGioiTinh(response.data.gioiTinh);
                setLoaiNganHang(response.data.loaiNganHang);
                console.log("Thông tin chủ trọ:", response.data);
            } else {
                console.error("Lỗi khi lấy thông tin chủ trọ:", response.message);
            }
        }
        fetchData();
    }, []);

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

    const theme = {
        bg: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
        surface: isDarkMode ? COLORS.surfaceDark : COLORS.white,
        text: isDarkMode ? COLORS.white : COLORS.slate700,
        border: isDarkMode ? COLORS.borderDark : '#e2e8f0',
        muted: isDarkMode ? COLORS.mutedDark : '#64748b',
        inputBg: isDarkMode ? COLORS.surfaceDark : COLORS.white,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>

            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: "#0f172a" }]}>Thông Tin Cá Nhân</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color="#0f172a" />
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
                                source={{ uri: 'https://i.pravatar.cc/300' }}
                                style={[styles.avatar, { borderColor: COLORS.primary + '33' }]}
                            />
                            <TouchableOpacity style={styles.cameraBtn}>
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
                            errorStyle={{ color: "#e53935" }}
                            iconName="description"
                        />

                        {/* Số điện thoại (Read-only) */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label]}>Số điện thoại</Text>
                            <View style={styles.rowInput}>
                                <View style={[styles.input, styles.readonlyInput, { backgroundColor: isDarkMode ? 'rgba(25, 47, 51, 0.5)' : '#f1f5f9', borderColor: theme.border, flex: 1 }]}>
                                    <Text style={{ color: theme.muted }}>090 123 4567</Text>
                                    <MaterialIcons name="lock" size={18} color={theme.muted} />
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
                            value={ngaySinh}
                            onChange={setNgaySinh}
                            label="NGÀY SINH"
                            maximumDate={new Date()}
                        />

                        {/* Số CCCD */}
                        <InputGroup
                            label="Số CCCD"
                            value={idCard}
                            onChangeText={setIdCard}
                            placeholder="Nhập số CCCD..."
                            error={idCardError}
                            errorStyle={{ color: "#e53935" }}
                            iconName="description"
                        />

                        {/* Địa chỉ */}
                        <InputGroup
                            label="ĐỊA CHỈ"
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Nhập địa chỉ..."
                            error={addressError}
                            errorStyle={{ color: "#e53935" }}
                            iconName="description"
                            numberOfLines={5}
                        />

                        {/* Giấy phép kinh doanh */}
                        <InputGroup
                            label="SỐ GIẤY PHÉP KINH DOANH"
                            value={businessLicense}
                            onChangeText={setBusinessLicense}
                            placeholder="Nhập số giấy phép kinh doanh..."
                            error={businessLicenseError}
                            errorStyle={{ color: "#e53935" }}
                            iconName="description"
                        />

                        <Text style={[styles.label, { marginBottom: 0 }]}>LOẠI NGÂN HÀNG</Text>
                        <ComboBox
                            data={loaiNganHangList}
                            value={loaiNganHang}
                            onChange={setLoaiNganHang}
                            labelField="label"
                            valueField="value"
                            search={true}
                            searchPlaceholder="Tìm kiếm..."
                        />

                        <InputGroup
                            label="SỐ TÀI KHOẢN NGÂN HÀNG"
                            value={soTKNH}
                            onChangeText={setSoTKNH}
                            placeholder="Nhập số tài khoản..."
                            error={soTKNHError}
                            errorStyle={{ color: "#e53935" }}
                            iconName="description"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Footer Action */}
            <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: isDarkMode ? 'rgba(50, 94, 103, 0.5)' : '#e2e8f0' }]}>
                <TouchableOpacity style={styles.saveBtn}>
                    <MaterialIcons name="save" size={20} color={COLORS.bgDark} />
                    <Text style={styles.saveBtnText}>Lưu thay đổi</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
        borderWidth: 4,
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
        color: "#0f172a",
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
        backgroundColor: COLORS.primary,
        height: 58,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    saveBtnText: { color: COLORS.bgDark, fontSize: 16, fontWeight: '800' },
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
});

export default ThongTinCaNhanScreen;