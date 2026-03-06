import React, { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import styles from "../Styles/OTPVerificationScreen_Styles";
import { verifyOTP } from "../../../services/phoneAuthService";
import { ActivityIndicator } from "react-native";
import { createHopDongApi } from "../../../api/HopDong";

export default function OTPVerificationScreen_HopDong({ route }) {
    const navigation = useNavigation();
    const { data } = route.params;
    const phone  = data.danhSachNguoiThue[0].soDt;
    
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
        const code = otp.join("");
        console.log("Verify OTP:", code);
        const result = await verifyOTP(phone, code);
        console.log("OTP verification result:", result);

        if (result.success) {
            const apiResult = await createHopDongApi(data);
            if (apiResult.success) {
                toast.success("Hợp đồng đã được tạo thành công!");
                navigation.navigate("ContractMain");
            }
        } else {
            console.log("Lỗi", result.message);
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
                    <Text style={styles.title}>Xác nhận</Text>
                    <Text style={styles.subtitle}>
                        Chúng tôi đã gửi mã 4 chữ số đến số điện thoại của bạn
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
        </KeyboardAvoidingView>
    );
}