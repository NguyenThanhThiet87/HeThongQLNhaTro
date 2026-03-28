import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatNgaySinh } from "../../../utils/formatNgaySinh";
import { sendOTP } from "../../../services/phoneAuthService";
import { ActivityIndicator } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../../services/firebaseConfig";
import { isExistAccount } from "../../../api/auth";
import toast from '../../../utils/toast';
import AppHeader from "../../../components/AppHeader";
import LoadingOverlay from "../../../components/LoadingOverlay";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";

export default function TaoHopDongB2Screen({ route }) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const { dataB1 } = route.params;
    console.log("Data from B1:", dataB1);
    const [hoTen, setHoTen] = useState("");
    const [gioiTinh, setGioiTinh] = useState("0");
    const [ngaySinh, setNgaySinh] = useState(""); // dob = date of birth
    const [soDt, setsoDt] = useState("");
    const [password, setPassword] = useState("12345678"); // Mặc định tạo mật khẩu là 12345678, người thuê có thể đổi sau
    const [soCccd, setsoCccd] = useState("");
    const [diaChi, setDiaChi] = useState("");
    const [ngheNghiep, setNgheNghiep] = useState("");

    const [showPass, setShowPass] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const recaptchaVerifier = useRef(null);

    const [loading, setLoading] = useState(false);

    const onChangeDate = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            const d = selectedDate;
            const formatted = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
            setNgaySinh(formatted);
        }
    };

    const handleNext = async () => {
        setLoading(true);
        // Validate thông tin người thuê trước khi hoàn tất
        if (!hoTen || !soDt || !password) {
            console.log("Vui lòng điền đầy đủ thông tin bắt buộc!");
            setLoading(false);
            return;
        }
        // Chuyển sang bước tiếp theo (hoặc hoàn tất)
        const formData = {
            ...dataB1,
            danhSachNguoiThue: [{
                hoTen,
                gioiTinh,
                ngaySinh: formatNgaySinh(ngaySinh),
                soDt: formatPhoneNumber(soDt),
                soCccd,
                diaChi,
                ngheNghiep,
                password
            }]
        };

        const exist = await isExistAccount(formatPhoneNumber(soDt));
        if (exist.data.isExist) {
            if (exist.data.isNguoiThue && exist.data.hasValidHopDong == false) {
                // Xử lý trường hợp người dùng đã tồn tại nhưng chưa có hợp đồng hợp lệ
                Alert.alert("Thông báo", "Số điện thoại đã tồn tại nhưng chưa có hợp đồng hợp lệ. Bạn có muốn tiếp tục tạo hợp đồng cho người này không.");
            } else {
                Alert.alert("Thông báo", "Số điện thoại đã được đăng ký. Vui lòng sử dụng số khác.");
                setLoading(false);
                return;
            }
        }

        const sendOTPResult = await sendOTP(soDt, recaptchaVerifier)
        if (!sendOTPResult.success) {
            console.log("Lỗi gửi OTP:", sendOTPResult.message);
        }
        else
            navigation.navigate("OTPVerification_HopDong", { data: formData });
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Tạo hợp đồng thuê</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            {/* CONTENT */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >

                {/* STEP PROGRESS (Giữ nguyên) */}
                <View style={styles.progressWrap}>
                    <View style={styles.progressTop}>
                        <Text style={styles.stepText}>Bước 2</Text>
                        <Text style={styles.stepCount}>2/2</Text>
                    </View>
                    <View style={styles.progressBg}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                <Text style={styles.sectionLabel}>
                    4. THÔNG TIN NGƯỜI ĐẠI DIỆN
                </Text>

                {/* CARD FORM */}
                <View style={styles.card}>

                    {/* soCccd */}
                    <Text style={styles.label}>Số CCCD/CMND</Text>

                    <View style={styles.inputBox}>
                        <MaterialIcons name="badge" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="Nhập số giấy tờ tùy thân"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={soCccd}
                            onChangeText={setsoCccd}
                        />
                    </View>

                    {/* divider */}
                    <View style={styles.divider} />

                    {/* Họ tên */}
                    <Text style={styles.label}>Họ và tên *</Text>

                    <View style={styles.inputBox}>
                        <MaterialIcons name="person" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="Ví dụ: Nguyễn Văn A"
                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={hoTen}
                            onChangeText={setHoTen}
                        />
                    </View>

                    {/* Giới tính */}
                    <Text style={styles.label}>Giới tính *</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center", marginRight: 24 }}
                            onPress={() => setGioiTinh("0")}
                        >
                            <View style={[styles.radioOuter, gioiTinh === "0" && styles.radioOuterActive]}>
                                {gioiTinh === "0" && <View style={styles.radioInner} />}
                            </View>
                            <Text style={{ color: COLORS.textMain, marginLeft: 6 }}>Nam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => setGioiTinh("1")}
                        >
                            <View style={[styles.radioOuter, gioiTinh === "1" && styles.radioOuterActive]}>
                                {gioiTinh === "1" && <View style={styles.radioInner} />}
                            </View>
                            <Text style={{ color: COLORS.textMain, marginLeft: 6 }}>Nữ</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Ngày sinh */}
                    <Text style={styles.label}>Ngày sinh *</Text>
                    <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.inputBox}>
                        <MaterialIcons name="calendar-today" size={20} color="#94a3b8" />
                        <Text style={[styles.input, { paddingVertical: 12 }]}>
                            {ngaySinh || "dd/mm/yyyy"}
                        </Text>
                    </TouchableOpacity>
                    {showPicker && (
                        <DateTimePicker
                            value={ngaySinh ? new Date(ngaySinh.split("/").reverse().join("-")) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                        />
                    )}

                    {/* phone */}
                    <Text style={styles.label}>Số điện thoại *</Text>

                    <View style={{ flexDirection: "row", gap: 10 }}>
                        <View style={[styles.inputBox, { flex: 1 }]}>
                            <MaterialIcons name="phone-iphone" size={20} color="#94a3b8" />
                            <TextInput
                                placeholder="09xxxxxxx"
                                placeholderTextColor="#94a3b8"
                                style={styles.input}
                                value={soDt}
                                onChangeText={setsoDt}
                            />
                        </View>
                    </View>

                    {/* address */}
                    <Text style={styles.label}>Địa chỉ thường trú</Text>

                    <View style={styles.inputBox}>
                        <MaterialIcons name="home" size={20} color="#94a3b8" />

                        <TextInput
                            placeholder="Số nhà, tên đường..."
                            placeholderTextColor="#94a3b8"
                            style={[styles.input, { height: 70 }]}
                            multiline
                            value={diaChi}
                            onChangeText={setDiaChi}
                        />
                    </View>

                    <Text style={styles.label}>Nghề nghiệp</Text>

                    <View style={styles.inputBox}>
                        <MaterialIcons name="badge" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="Nhập nghề nghiệp"

                            placeholderTextColor="#94a3b8"
                            style={styles.input}
                            value={ngheNghiep}
                            onChangeText={setNgheNghiep}
                        />
                    </View>

                    {/* divider */}
                    <View style={styles.divider} />
                    {/* password */}
                    <Text style={styles.label}>Mật khẩu tài khoản *</Text>

                    <View style={styles.inputBox}>
                        <MaterialIcons name="vpn-key" size={20} color="#94a3b8" />
                        <TextInput
                            placeholder="Tạo mật khẩu đăng nhập"
                            placeholderTextColor="#94a3b8"
                            secureTextEntry={!showPass}
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <MaterialIcons name={showPass ? "visibility" : "visibility-off"} size={20} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.helper}>
                        Tài khoản sẽ được tạo tự động cho người thuê.
                    </Text>
                </View>

                {/* INFO BOX */}
                <View style={styles.infoBox}>
                    <MaterialIcons name="verified-user" size={22} color="#3b82f6" />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.infoTitle}>
                            Thông tin quan trọng
                        </Text>

                        <Text style={styles.infoText}>
                            Dữ liệu này sẽ được dùng để điền tự động vào Hợp đồng thuê nhà.
                        </Text>
                    </View>
                </View>

                {/* BOTTOM BUTTON */}
                <TouchableOpacity
                    style={[
                        styles.nextBtn,
                        loading && { opacity: 0.7 }
                    ]}
                    onPress={() => handleNext()}
                >
                    <Text style={styles.nextText}>Hoàn tất tạo hợp đồng</Text>
                </TouchableOpacity>
            </ScrollView>
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={app.options}
            />
            <LoadingOverlay visible={loading} />
        </View >
    );
}



const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scroll: {
        paddingVertical: 16,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },

    progressWrap: { marginBottom: 24 },
    progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    stepText: { color: "#13c8ec", fontWeight: "600", fontSize: 14 },
    stepCount: { color: "#94a3b8", fontSize: 12 },
    progressBg: { height: 8, backgroundColor: COLORS.card, borderRadius: 100, borderColor: COLORS.border, borderWidth: 1 },
    progressFill: { width: "100%", height: 8, backgroundColor: "#13c8ec", borderRadius: 100 },


    scroll: {
        padding: 16
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: COLORS.textMain,
    },
    sectionLabel: {
        color: COLORS.textMain,
        fontWeight: "bold",
        marginBottom: 8
    },
    sectionDesc: {
        color: COLORS.textMain,
        marginBottom: 16
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 14,
        gap: 12
    },

    label: {
        color: COLORS.textMain,
        fontWeight: "600"
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: COLORS.inputBg,
        paddingHorizontal: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    input: {
        flex: 1,
        color: COLORS.inputText,
        paddingVertical: 12
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },
    radioOuterActive: {
        borderColor: "#13c8ec"
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#13c8ec"
    },
    otpBtn: {
        backgroundColor: "#164e63",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 16,
        borderRadius: 10
    },

    otpText: {
        color: "#22d3ee",
        fontWeight: "700"
    },

    helper: {
        color: "#94a3b8",
        fontSize: 12
    },

    divider: {
        height: 1,
        backgroundColor: "#334155",
        marginVertical: 6
    },

    infoBox: {
        flexDirection: "row",
        gap: 10,
        backgroundColor: COLORS.card,
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        marginBottom: 20
    },

    infoTitle: {
        color: COLORS.textMain,
        fontWeight: "700"
    },

    infoText: {
        color: COLORS.textMuted,
        fontSize: 12
    },

    bottom: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 16,
        backgroundColor: "#0f172a",
        borderTopWidth: 1,
        borderTopColor: "#1e293b"
    },

    nextBtn: {
        backgroundColor: "#06b6d4",
        padding: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10
    },

    nextText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16
    }

});
