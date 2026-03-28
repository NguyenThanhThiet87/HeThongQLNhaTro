import React, { useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
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

import { sendOTP } from "../../../services/phoneAuthService";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { app } from "../../../services/firebaseConfig";
import { isExistAccount } from "../../../api/auth";
import toast from '../../../utils/toast';
import LoadingOverlay from "../../../components/LoadingOverlay";

import InputGroup from "../../../components/InputGroup";
import formatPhoneNumber from "../../../utils/formatPhoneNumber";

export default function ThayDoiSoDienThoaiScreen() {
  const navigation = useNavigation();

  const [phone, setPhone] = useState("");
  const recaptchaVerifier = useRef(null);

  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    setLoading(true);

    const formattedPhone = formatPhoneNumber(phone);
    const exist = await isExistAccount(formattedPhone);
    if (!exist.data.isExist) {
      toast.info("Số điện chưa đăng ký tài khoản:" + phone);
      setLoading(false);
      return;
    }
    const result = await sendOTP(phone, recaptchaVerifier);
    console.log("Send OTP result:", result);
    if (result.success) {
      navigation.navigate("VerifyOTPThayDoiSoDienThoai", { phone: result.phone });
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

            <Text style={styles.title}>Thay đổi số điện thoại</Text>
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

            <TouchableOpacity style={[styles.button, loading && { opacity: 0.7 }]} onPress={handleSendOTP} >
              <Text style={styles.buttonText}>Gửi mã OTP</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    justifyContent: "center",
    padding: 20
  },
  card: {
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#101f22",
    marginTop: 20
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginVertical: 10
  },

  button: {
    backgroundColor: "#13c8ec",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignItems: "center"
  },
  buttonText: {
    fontWeight: "bold",
    color: "#101f22"
  },
  back: {
    color: "#aaa",
    marginTop: 20
  }
});
