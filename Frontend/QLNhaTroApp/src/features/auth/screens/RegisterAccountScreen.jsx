import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/RegisterAccountScreen_Styles";
import { ActivityIndicator } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../../services/firebaseConfig";
import PasswordRule from "../../../components/PasswordRule";
import { useRegisterAccount } from "../../../hooks/auth/useRegisterAccount";
import LoadingOverlay from "../../../components/LoadingOverlay";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import toast from "../../../utils/toast";

export default function RegisterAccountScreen({ navigation, route }) {
  navigation = useNavigation();
  const role = route.params.role;

  const { sendOTPRegister, loading } = useRegisterAccount(navigation);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const recaptchaVerifier = useRef(null);

  const passwordRules = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRules.minLength &&
    passwordRules.hasUpperCase &&
    passwordRules.hasNumber &&
    passwordRules.hasSpecialChar;

  const handleSendOTP = () => {

    if (!isPasswordValid)
      return toast.error("Mật khẩu không hợp lệ.");

    sendOTPRegister(
      name,
      phoneNumber,
      password,
      role,
      recaptchaVerifier
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={22} color="#fff" />
            <Text style={styles.backText}>Quay lại</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={{ marginTop: 20, marginBottom: 30 }}>
          <Text style={styles.title}>Tạo tài khoản</Text>
          <Text style={styles.subtitle}>
            Chỉ mất 30 giây để bắt đầu.
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form */}
          <View style={styles.form}>
            {/* name */}
            <Text style={styles.label}>HỌ VÀ TÊN</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons
                name="person"
                size={22}
                color="#64748b"
                style={styles.leftIcon}
              />
              <TextInput
                placeholder="Vui lòng nhập họ và tên"
                placeholderTextColor="#64748b"
                style={styles.input}
                onChangeText={setName}
              />
            </View>
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
            <Text style={[styles.label]}>MẬT KHẨU</Text>
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
            {/* Password rules */}
            <View style={{ marginTop: 8 }}>
              <PasswordRule
                valid={passwordRules.minLength}
                text="Ít nhất 8 ký tự"
              />

              <PasswordRule
                valid={passwordRules.hasUpperCase}
                text="Ít nhất 1 chữ hoa"
              />

              <PasswordRule
                valid={passwordRules.hasNumber}
                text="Ít nhất 1 chữ số"
              />

              <PasswordRule
                valid={passwordRules.hasSpecialChar}
                text="Ít nhất 1 ký tự đặc biệt"
              />
            </View>

            <Text style={styles.note}>
              Các thông tin định danh khác sẽ được bổ sung sau khi đăng nhập
            </Text>

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && { opacity: 0.7 }
              ]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <Text style={styles.buttonText}>GỬI OTP</Text>
              )}
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Bạn đã có tài khoản?
                <Text style={styles.signIn} onPress={() => { navigation.navigate("Login") }}> Đăng nhập</Text>
              </Text>
            </View>
          </View>
          <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={app.options} />
        </ScrollView>
      </View>
      <LoadingOverlay visible={loading} />
    </KeyboardAvoidingView>
  );
}