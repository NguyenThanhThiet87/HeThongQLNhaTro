import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";

import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../services/firebaseConfig";
import PasswordRule from "../../components/PasswordRule";
import { useRegisterAccount } from "../../hooks/auth/useRegisterAccount";
import LoadingOverlay from "../../components/LoadingOverlay";
import Input from "../../components/Input";

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";

export default function RegisterAccountScreen({ navigation, route }) {
  navigation = useNavigation();
  const role = route.params.role;

  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const { sendOTPRegister, loading } = useRegisterAccount(navigation);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");

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
    if (!name)
      return setNameError("Vui lòng nhập họ và tên.");
    else setNameError("");

    if (!phoneNumber || !/^\d{10,11}$/.test(phoneNumber))
      return setPhoneError("Vui lòng nhập số điện thoại hợp lệ.");
    else setPhoneError("");

    if (!isPasswordValid)
      return setPasswordError("Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.");
    else setPasswordError("");

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
            <MaterialIcons name="arrow-back" size={22} color={COLORS.textMain} />
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
            <Input
              label="HỌ VÀ TÊN"
              icon="person"
              placeholder="Nhập họ và tên..."
              showError={true}
              error={nameError}
              value={name}
              onChangeText={setName}
              height={60}
            />

            {/* Phone */}
            <Input
              label="SỐ ĐIỆN THOẠI"
              icon="phone"
              placeholder="Nhập số điện thoại..."
              keyboardType="phone-pad"
              showError={true}
              error={phoneError}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              height={60}
            />
            {/* Password */}
            <Input
              label="MẬT KHẨU"
              icon="lock"
              placeholder="Nhập mật khẩu..."
              secure={true}
              secureValue={!passwordVisible}
              toggleSecure={() => setPasswordVisible(!passwordVisible)}
              showError={true}
              error={passwordError}
              value={password}
              onChangeText={setPassword}
              height={60}
            />

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
            >
              <Text style={styles.buttonText}>GỬI OTP</Text>
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


const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    paddingTop: 55,
    paddingHorizontal: 20
  },
  back: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: COLORS.textMain,
    marginLeft: 5
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textMain,
    marginTop: 20,
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
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  leftIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.inputText,
    fontSize: 16,
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
  note: {
    fontSize: 11,
    textAlign: "center",
    color: COLORS.textMuted,
    marginTop: 10,
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,
  },
  footerText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  signIn: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});