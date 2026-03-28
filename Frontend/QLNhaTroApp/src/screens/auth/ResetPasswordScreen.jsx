import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {resetPasswordApi} from "../../api/auth";
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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import LoadingOverlay from "../../components/LoadingOverlay";

export default function ResetPasswordScreen({ navigation, route }) {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const phone = route.params.phone;
    const idToken = route.params.idToken;
    
    const [loading, setLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isLengthValid = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
    const isMatch = password === confirm && password.length > 0;

    const handleReset = () => {
        setLoading(true);
        if (!isLengthValid || !hasNumberOrSymbol || !isMatch) {
            console.log("Password invalid");
            setLoading(false);
            return;
        }
        const result = resetPasswordApi(phone, password, idToken);
        if (result.success) {
            navigation.navigate("Login");
        } else {
            console.log("Reset failed");
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

                    {/* Back */}
                    <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={22} color={COLORS.textMain} />
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="lock-reset" size={40} color={COLORS.buttonText} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Mật khẩu mới</Text>
                    <Text style={styles.subtitle}>
                        Xác thực danh tính thành công. Đặt mật khẩu mới của bạn.
                    </Text>

                    {/* New Password */}
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={20} color={COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Ít nhất 8 ký tự"
                            placeholderTextColor={COLORS.textMuted}
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <MaterialIcons
                                name={showPass ? "visibility" : "visibility-off"}
                                size={20}
                                color={COLORS.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="verified-user" size={20} color={COLORS.textMuted} />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor={COLORS.textMuted}
                            secureTextEntry={!showConfirm}
                            value={confirm}
                            onChangeText={setConfirm}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <MaterialIcons
                                name={showConfirm ? "visibility" : "visibility-off"}
                                size={20}
                                color={COLORS.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Conditions */}
                    <View style={styles.conditions}>
                        <View style={styles.conditionRow}>
                            <MaterialCommunityIcons
                                name={isLengthValid ? "check-circle" : "checkbox-blank-circle-outline"}
                                size={16}
                                color={isLengthValid ? "#22c55e" : "#555"}
                            />
                            <Text style={styles.conditionText}>
                                Ít nhất 8 ký tự
                            </Text>
                        </View>

                        <View style={styles.conditionRow}>
                            <MaterialCommunityIcons
                                name={hasNumberOrSymbol ? "check-circle" : "checkbox-blank-circle-outline"}
                                size={16}
                                color={hasNumberOrSymbol ? "#22c55e" : "#555"}
                            />
                            <Text style={styles.conditionText}>
                                Chứa số hoặc ký tự đặc biệt
                            </Text>
                        </View>
                    </View>

                    {/* Reset Button */}
                    <TouchableOpacity
                        style={[
                            styles.button,
                            !(isLengthValid && hasNumberOrSymbol && isMatch) && {
                                opacity: 0.5
                            }
                        ]}
                        onPress={handleReset}
                        disabled={!(isLengthValid && hasNumberOrSymbol && isMatch)}
                    >
                        <Text style={styles.buttonText}>Đặt lại mật khẩu</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: "center",
  },
  back: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  backText: {
    color: COLORS.textMuted,
    marginLeft: 5,
    fontSize: 14,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textMain,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 24,
    textAlign: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 56,
    marginBottom: 16,
    width: "100%",
  },
  input: {
    flex: 1,
    color: COLORS.inputText,
    fontSize: 16,
    paddingHorizontal: 8,
  },
  conditions: {
    marginBottom: 24,
    width: "100%",
  },
  conditionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  conditionText: {
    marginLeft: 8,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.buttonBg,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    width: "100%",
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: "700",
  },
});