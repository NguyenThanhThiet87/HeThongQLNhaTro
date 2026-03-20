import React, { useState } from "react";
import styles, { colors } from "../../features/auth/styles/LoginScreen_Styles";
import { useNavigation } from "@react-navigation/native";

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

import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../hooks/auth/useLogin";

export default function LoginScreen() {
    const navigation = useNavigation();
    
    const { login } = useAuth();

    const { loginUser, loading } = useLogin(login);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        await loginUser(phoneNumber, password);
    };

    return (
        <SafeAreaView style={styles.container}>
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

