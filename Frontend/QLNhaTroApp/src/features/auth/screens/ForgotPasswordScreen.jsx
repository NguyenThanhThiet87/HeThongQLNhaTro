import React, { useState, useRef } from "react";
import styles from "../styles/ForgotPasswordScreen_Styles";
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
import Icon from "react-native-vector-icons/MaterialIcons";

import { sendOTP } from "../../../services/phoneAuthService";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../../services/firebaseConfig";
import { isExistAccount } from "../../../api/auth";
import toast from '../../../utils/toast';
import { ActivityIndicator } from "react-native";

export default function ForgotPasswordScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState("");
  const recaptchaVerifier = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);

    const exist = await isExistAccount(phone);
    if (!exist) {
      toast.info("Số điện chưa đăng ký tài khoản:" + phone);
      setLoading(false)
      return;
    }
    const result = await sendOTP(phone, recaptchaVerifier);
    console.log("Send OTP result:", result);
    if (result.success) {
      navigation.navigate("OTPVerification", { phone: result.phone });
      toast.success("OTP sent to: " + result.phone);
    } else {
      toast.error("Failed to send OTP: " + result.message);
    }
    setLoading(false);
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

            <Icon name="lock-reset" size={50} color="#13c8ec" />

            <Text style={styles.title}>Quên Mật Khẩu?</Text>
            <Text style={styles.subtitle}>
              Nhập số điện thoại của bạn để nhận mã OTP.
            </Text>

            <View style={styles.inputWrapper}>
              <Icon name="smartphone" size={22} color="#888" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.input}
                placeholder="0912 345 678"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
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
                <Text style={styles.buttonText}>Gửi mã OTP</Text>
              )}
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
    </KeyboardAvoidingView>
  );
}
