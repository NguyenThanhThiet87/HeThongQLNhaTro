import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView
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

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const BORDER = "rgba(255,255,255,0.05)";
const TEXT2 = "#94a3b8";

export default function TaoHopDongB2Screen({ route }) {
    const navigation = useNavigation();
    const { dataB1 } = route.params;
    console.log("Data from B1:", dataB1);
    const [hoTen, setHoTen] = useState("");
    const [gioiTinh, setGioiTinh] = useState("male");
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
                soDt,
                soCccd,
                diaChi,
                ngheNghiep,
                password
            }]
        };
    
    const exist = await isExistAccount(soDt);
    if (exist) {
      toast.info("Số điện thoại đã tồn tại trong hệ thống!");
      setLoading(false)
      return;
    }

    const sendOTPResult = await sendOTP(soDt, recaptchaVerifier)
        if (!sendOTPResult.success)
            console.log("Lỗi gửi OTP:", sendOTPResult.message);
        else
            navigation.navigate("OTPVerification_HopDong", { data: formData });
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>

                <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#cbd5e1" />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={styles.headerTitle}>
                        Tạo Hợp đồng mới
                    </Text>

                    <Text style={styles.headerSub}>
                        Bước 2/2: Thông tin người thuê
                    </Text>
                </View>

            </View>

            {/* CONTENT */}
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ paddingBottom: 140 }}
                showsVerticalScrollIndicator={false}
            >

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
                            onPress={() => setGioiTinh("male")}
                        >
                            <View style={[styles.radioOuter, gioiTinh === "male" && styles.radioOuterActive]}>
                                {gioiTinh === "male" && <View style={styles.radioInner} />}
                            </View>
                            <Text style={{ color: "#fff", marginLeft: 6 }}>Nam</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flexDirection: "row", alignItems: "center" }}
                            onPress={() => setGioiTinh("female")}
                        >
                            <View style={[styles.radioOuter, gioiTinh === "female" && styles.radioOuterActive]}>
                                {gioiTinh === "female" && <View style={styles.radioInner} />}
                            </View>
                            <Text style={{ color: "#fff", marginLeft: 6 }}>Nữ</Text>
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
                    onPress={()=> handleNext()}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#000" />
                    ) : (
                        <Text style={styles.nextText}>Hoàn tất tạo hợp đồng</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
            />
        </View >
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderColor: BORDER
    },

    headerTitle: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16
    },

    headerSub: {
        color: TEXT2,
        fontSize: 12
    },

    stepBadge: {
        width: 34,
        height: 34,
        borderRadius: 20,
        backgroundColor: "rgba(19,200,236,0.15)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: PRIMARY
    },

    stepText: {
        color: PRIMARY,
        fontWeight: "bold"
    },

    progressBg: {
        height: 4,
        backgroundColor: "#334155"
    },

    progressFill: {
        height: 4,
        width: "33%",
        backgroundColor: PRIMARY
    },

    scroll: {
        padding: 16
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff"
    },
    sectionLabel: {
        color: TEXT2,
        fontWeight: "bold",
        marginBottom: 8
    },
    sectionDesc: {
        color: "#94a3b8",
        marginBottom: 16
    },

    card: {
        backgroundColor: "#1e293b",
        padding: 16,
        borderRadius: 14,
        gap: 12
    },

    label: {
        color: "#cbd5e1",
        fontWeight: "600"
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "#0f172a",
        paddingHorizontal: 12,
        borderRadius: 10
    },

    input: {
        flex: 1,
        color: "#fff",
        paddingVertical: 12
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#94a3b8",
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
        backgroundColor: "#1e3a8a33",
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        marginBottom: 20
    },

    infoTitle: {
        color: "#93c5fd",
        fontWeight: "700"
    },

    infoText: {
        color: "#bfdbfe",
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
