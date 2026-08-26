import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme/useTheme";

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
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../context/AuthContext";
import { useLogin } from "../../hooks/auth/useLogin";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

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
              <Image
                source={require("../../../assets/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />

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
              <Text style={[styles.label, { marginTop: 0 }]}>MẬT KHẨU</Text>
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

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
  },
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textMain,
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.textMain,
    fontSize: 16,
  },
  forgotWrapper: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
  forgotText: {
    color: COLORS.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  button: {
    marginTop: 24,
    backgroundColor: COLORS.buttonBg,
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  signUp: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});