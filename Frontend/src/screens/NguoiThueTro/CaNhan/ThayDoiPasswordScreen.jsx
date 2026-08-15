import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
import { useChangePassword } from "../../../hooks/user/useUserProfile";

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
import Input from "../../../components/Input";
import AppHeader from "../../../components/AppHeader";
import LoadingOverlay from "../../../components/LoadingOverlay";

export default function ThayDoiPasswordScreen() {
    const navigation = useNavigation();
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);

    const {
        loading,
        oldPass, setOldPass,
        newPass, setNewPass,
        confirm, setConfirm,
        showOldPass, setShowOldPass,
        showNewPass, setShowNewPass,
        showConfirm, setShowConfirm,
        oldPassError, setOldPassError,
        newPassError, setNewPassError,
        confirmError, setConfirmError,
        handleReset} = useChangePassword();

    const isLengthValid = newPass.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*]/.test(newPass);
    const isMatch = newPass === confirm && newPass.length > 0;

    return (
        <View style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Cài đặt bảo mật</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Old Password */}
                    <Input
                        label="Mật khẩu cũ"
                        icon="lock"
                        placeholder="Nhập mật khẩu..."
                        secure={true}
                        secureValue={!showOldPass}
                        toggleSecure={() => setShowOldPass(!showOldPass)}
                        showError= {true}
                        error={oldPassError}
                        value={oldPass}
                        onChangeText={setOldPass}
                        height={60}
                    />

                    {/* New Password */}
                    <Input
                        label="Mật khẩu mới"
                        icon="lock"
                        placeholder="Nhập mật khẩu..."
                        secure={true}
                        secureValue={!showNewPass}
                        toggleSecure={() => setShowNewPass(!showNewPass)}
                        showError= {true}
                        error={newPassError}
                        value={newPass}
                        onChangeText={setNewPass}
                        height={60}
                    />

                    {/* Confirm Password */}
                    <Input
                        label="Xác nhận mật khẩu"
                        icon="lock"
                        placeholder="Nhập lại mật khẩu..."
                        secure={true}
                        secureValue={!showConfirm}
                        toggleSecure={() => setShowConfirm(!showConfirm)}
                        showError= {true}
                        error={confirmError}
                        value={confirm}
                        onChangeText={setConfirm}
                        height={60}
                    />

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
                </ScrollView>
            </KeyboardAvoidingView >
            <LoadingOverlay  visible={loading}/>
        </View>
    );
}


const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scrollContent: { padding: 16, paddingBottom: 40 },

    conditions: {
        marginTop: 20,
        paddingHorizontal: 5
    },
    conditionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5
    },
    conditionText: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginLeft: 6
    },
    button: {
        marginTop: 30,
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 15,
        borderRadius: 14,
        alignItems: "center"
    },
    buttonText: {
        fontWeight: "bold",
        color: COLORS.buttonText
    }
});
