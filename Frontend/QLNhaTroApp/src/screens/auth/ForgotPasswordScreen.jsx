import React, { useState, useRef } from "react";

import { useNavigation } from "@react-navigation/native";
import { useForgotPassword } from "../../hooks/auth/useForgotPassword";
import { useTheme } from "../../theme/useTheme";

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

import Icon from "react-native-vector-icons/MaterialIcons";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../services/firebaseConfig";
import LoadingOverlay from "../../components/LoadingOverlay";
import InputGroup from "../../components/InputGroup";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const { sendOtp, loading } = useForgotPassword(navigation);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const recaptchaVerifier = useRef(null);

  const handleSendOTP = async () => {
    await sendOtp(phone, recaptchaVerifier);
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
          <View style={styles.card}>

            <Icon name="lock-reset" size={50} color={COLORS.primary} />

            <Text style={styles.title}>Quên Mật Khẩu?</Text>
            <Text style={styles.subtitle}>
              Nhập số điện thoại của bạn để nhận mã OTP.
            </Text>

            <InputGroup
              placeholder="Số điện thoại"
              value={phone}
              iconName="phone"
              onChangeText={setPhone}
              inputWidth={320}
              inputHeight={50}
            />

            <TouchableOpacity
              style={[
                styles.button,
                loading && { opacity: 0.7 }
              ]}
              onPress={handleSendOTP}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Gửi mã OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>Quay lại Đăng nhập</Text>
            </TouchableOpacity>
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={app.options}
            />
          </View>
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
    justifyContent: "center",
    padding: 20
  },
  card: {
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.textMain,
    marginTop: 20
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    marginVertical: 10,
    marginBottom: 30
  },

  button: {
    backgroundColor: COLORS.buttonBg,
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    color: COLORS.buttonText
  },
  back:{
    color: COLORS.primary,
    marginTop: 20
  }
});
