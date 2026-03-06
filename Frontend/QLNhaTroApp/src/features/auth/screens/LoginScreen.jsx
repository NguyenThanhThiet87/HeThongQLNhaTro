import React, { useState } from "react";
import styles, { colors } from "../styles/LoginScreen_Styles";
import { useNavigation } from "@react-navigation/native";
import { loginApi } from "../../../api/auth";
import toast from '../../../utils/toast';
import { ROLES } from "../../../constants/roles";
import {jwtDecode} from "jwt-decode";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";

import { ActivityIndicator } from "react-native";
import * as SecureStore from "expo-secure-store";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
    const navigation = useNavigation();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Xử lý đăng nhập ở đây
        setLoading(true);
        try {
            if(!phoneNumber || !password) {
                throw new Error('Vui lòng nhập đầy đủ thông tin');
            }
            if(!/^\d{10,11}$/.test(phoneNumber)) {
                throw new Error('Số điện thoại không hợp lệ');
            }
            if(password.length < 8) {
                throw new Error('Mật khẩu phải có ít nhất 8 ký tự');
            }

            const result = await loginApi(
                formatPhoneNumber(phoneNumber),
                password
            );
            if (!result.success) {
                throw new Error(result.message || 'Đăng nhập thất bại');
            }

            const data = result.data;
            const decoded = jwtDecode(data.accessToken);
            const vaiTro = decoded.VaiTro;

            await SecureStore.setItemAsync("accessToken", data.accessToken);
            await SecureStore.setItemAsync("refreshToken", data.refreshToken);

            toast.success('Đăng nhập thành công');

            if(vaiTro === ROLES.ADMIN) {
                    navigation.replace("Main");
            } else if (vaiTro === ROLES.CHU_TRO) {
                navigation.replace("Main");
            } else if (vaiTro === ROLES.NGUOI_THUE) {
                navigation.replace("Main");
            } else if (vaiTro === ROLES.NHA_CUNG_CAP) {
                navigation.replace("Main");
            }

        } catch (error) {
            toast.error(error?.message || 'Đăng nhập thất bại');
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={["#101f22", "#0e2a2f"]}
                style={StyleSheet.absoluteFill}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.wrapper}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons name="home" size={40} color={colors.primary} />
                            </View>

                            <Text style={styles.title}>Chào mừng quay trở lại</Text>
                            <Text style={styles.subtitle}>
                                Đăng nhập vào Xóm Trọ của chúng ta
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            {/* Phone */}
                            <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
                            <View style={styles.inputContainer}>
                                <MaterialIcons
                                    name="smartphone"
                                    size={22}
                                    color="#64748b"
                                    style={styles.leftIcon}
                                />
                                <TextInput
                                    placeholder="Vui lòng nhập số điện thoại"
                                    placeholderTextColor="#64748b"
                                    keyboardType="phone-pad"
                                    style={styles.input}
                                    onChangeText={setPhoneNumber}
                                />
                            </View>

                            {/* Password */}
                            <Text style={[styles.label, { marginTop: 20 }]}>MẬT KHẨU</Text>
                            <View style={styles.inputContainer}>
                                <MaterialIcons
                                    name="lock"
                                    size={22}
                                    color="#64748b"
                                    style={styles.leftIcon}
                                />
                                <TextInput
                                    placeholder="Vui lòng nhập mật khẩu"
                                    placeholderTextColor="#64748b"
                                    secureTextEntry={!passwordVisible}
                                    style={styles.input}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    <MaterialIcons
                                        name={
                                            passwordVisible ? "visibility" : "visibility-off"
                                        }
                                        size={22}
                                        color="#64748b"
                                    />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={styles.forgotWrapper} onPress={() => navigation.navigate("ForgotPassword")}>
                                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                            </TouchableOpacity>

                            {/* Button */}
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    loading && { opacity: 0.7 }
                                ]}
                                onPress={handleLogin}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="#000" />
                                ) : (
                                    <Text style={styles.buttonText}>Đăng nhập</Text>
                                )}
                            </TouchableOpacity>

                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>
                                Bạn chưa có tài khoản?
                                <Text style={styles.signUp} onPress={() => { navigation.navigate("RoleSelection") }}> Đăng ký</Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

