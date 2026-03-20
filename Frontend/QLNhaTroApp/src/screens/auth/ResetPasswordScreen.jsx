import React, { useState } from "react";
import styles from "../../features/auth/styles/ResetPasswordScreen_Styles";
import { useNavigation } from "@react-navigation/native";
import {resetPasswordApi} from "../../api/auth";

import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function ResetPasswordScreen({ navigation, route }) {
    const phone = route.params.phone;
    const idToken = route.params.idToken;
    
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isLengthValid = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(password);
    const isMatch = password === confirm && password.length > 0;

    const handleReset = () => {
        if (!isLengthValid || !hasNumberOrSymbol || !isMatch) {
            console.log("Password invalid");
            return;
        }
        const result = resetPasswordApi(phone, password, idToken);
        console.log("Password reset result:", result);
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
                        <MaterialIcons name="arrow-back" size={22} color="#aaa" />
                        <Text style={styles.backText}>Quay lại</Text>
                    </TouchableOpacity>

                    {/* Icon */}
                    <View style={styles.iconWrapper}>
                        <MaterialIcons name="lock-reset" size={40} color="#13c8ec" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Mật khẩu mới</Text>
                    <Text style={styles.subtitle}>
                        Xác thực danh tính thành công. Đặt mật khẩu mới của bạn.
                    </Text>

                    {/* New Password */}
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="lock" size={20} color="#888" />
                        <TextInput
                            style={styles.input}
                            placeholder="Ít nhất 8 ký tự"
                            placeholderTextColor="#666"
                            secureTextEntry={!showPass}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                            <MaterialIcons
                                name={showPass ? "visibility" : "visibility-off"}
                                size={20}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password */}
                    <View style={styles.inputWrapper}>
                        <MaterialIcons name="verified-user" size={20} color="#888" />
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập lại mật khẩu"
                            placeholderTextColor="#666"
                            secureTextEntry={!showConfirm}
                            value={confirm}
                            onChangeText={setConfirm}
                        />
                        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                            <MaterialIcons
                                name={showConfirm ? "visibility" : "visibility-off"}
                                size={20}
                                color="#888"
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
        </KeyboardAvoidingView>
    );
}
