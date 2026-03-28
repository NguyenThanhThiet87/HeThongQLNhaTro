import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { verifyOTP } from "../../../services/phoneAuthService";
import { createHopDongApi } from "../../../api/HopDong";
import toast from "../../../utils/toast";

export default function OTPVerificationScreen_HopDong({ route }) {
    const navigation = useNavigation();

    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const [loading, setLoading] = useState(false);

    const { data } = route.params;
    const phone = data.danhSachNguoiThue[0].soDt;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [seconds, setSeconds] = useState(119);

    const inputs = useRef([]);

    // Countdown
    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setInterval(() => {
            setSeconds(prev => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [seconds]);

    const formatTime = () => {
        const m = String(Math.floor(seconds / 60)).padStart(2, "0");
        const s = String(seconds % 60).padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleChange = (text, index) => {
        if (!/^\d?$/.test(text)) return;

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handleVerify = async () => {
        setLoading(true);
        try {
            const code = otp.join("");
            const result = await verifyOTP(phone, code);

            if (result.success) {
                const apiResult = await createHopDongApi(data);
                if (apiResult.success) {
                    toast.success("Tạo hợp đồng thành công");
                    navigation.navigate("ContractMain");
                }else {
                    toast.info(apiResult.message || "Tạo hợp đồng thất bại. Vui lòng thử lại.");
                }
            } else {
                setOtp(["", "", "", "", "", ""]);
                toast.error("Xác nhận OTP thất bại. Vui lòng thử lại.");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = () => {
        setSeconds(119);
        console.log("Resend OTP");
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>

                    {/* Back Button */}
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color="#aaa" />
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="lock-reset" size={40} color="#13c8ec" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Xác nhận OTP</Text>
                    <Text style={styles.subtitle}>
                        Chúng tôi đã gửi mã 6 chữ số đến số điện thoại của bạn
                    </Text>
                    <Text style={styles.phone}>{phone}</Text>

                    {/* OTP Inputs */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={ref => (inputs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit && styles.activeInput
                                ]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={text => handleChange(text, index)}
                                onKeyPress={e => handleBackspace(e, index)}
                            />
                        ))}
                    </View>

                    {/* Countdown */}
                    <Text style={styles.expire}>
                        OTP hết hạn trong {" "}
                        <Text style={styles.time}>{formatTime()}</Text>
                    </Text>

                    {/* Resend */}
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                        <Text style={styles.resendText}>
                            Bạn chưa nhận được mã?
                        </Text>
                        <TouchableOpacity onPress={handleResend}>
                            <Text style={styles.resendBtn}> Gửi lại </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Verify Button */}
                    <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
                        <Text style={styles.verifyText}>Xác nhận OTP</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <LoadingOverlay visible={loading} />

        </KeyboardAvoidingView>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        alignItems: "center",
        paddingTop: 80,
        paddingHorizontal: 20
    },
    back: {
        position: "absolute",
        top: 60,
        left: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    backText: {
        color: COLORS.textMuted,
        marginLeft: 5
    },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 20,
        backgroundColor: COLORS.card,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginBottom: 20
    },
    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: COLORS.textMain
    },
    subtitle: {
        color: COLORS.textMuted,
        marginTop: 5
    },
    phone: {
        color: COLORS.textMain,
        fontWeight: "600",
        marginBottom: 30
    },
    otpContainer: {
        flexDirection: "row",
        gap: 12
    },
    otpInput: {
        width: 40,
        height: 45,
        backgroundColor: COLORS.card,
        borderRadius: 15,
        textAlign: "center",
        fontSize: 22,
        color: COLORS.textMain,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    activeInput: {
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.6,
        shadowRadius: 10
    },
    expire: {
        marginTop: 30,
        color: COLORS.textMuted
    },
    time: {
        color: COLORS.primary,
        fontWeight: "600"
    },
    resendText: {
        color: COLORS.textMuted
    },
    resendBtn: {
        color: COLORS.primary,
        textDecorationLine: "underline"
    },
    verifyBtn: {
        marginTop: 40,
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 15,
        borderRadius: 14,
        width: "100%",
        alignItems: "center"
    },
    verifyText: {
        fontWeight: "bold",
        color: COLORS.buttonText
    }
});
