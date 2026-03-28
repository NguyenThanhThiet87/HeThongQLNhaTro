import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../theme/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import InputGroup from "../../../components/InputGroup";
import AppHeader from "../../../components/AppHeader";
import PasswordRule from "../../../components/PasswordRule";
import { useChangePassword } from "../../../hooks/user/useUserProviderProfile";


const ThayDoiPasswordScreen = () => {
    const { COLORS } = useTheme();
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
        handleReset
    } = useChangePassword();

    return (
        <View style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={handleReset}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Đổi mật khẩu</Text>
                }
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.headerSection}>
                        <View style={styles.iconWrapper}>
                            <MaterialIcons name="lock-reset" size={40} color={COLORS.primary} />
                        </View>
                        <Text style={styles.title}>Cập nhật mật khẩu</Text>
                        <Text style={styles.subtitle}>Sử dụng ít nhất 8 ký tự bao gồm chữ cái và số để bảo vệ tài khoản</Text>
                    </View>

                    <View style={styles.form}>
                        <InputGroup
                            label="Mật khẩu hiện tại"
                            placeholder="Nhập mật khẩu cũ"
                            value={oldPass}
                            onChangeText={setOldPass}
                            secureTextEntry={!showOldPass}
                            error={oldPassError}
                            iconName="lock-outline"
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowOldPass(!showOldPass)}>
                                    <MaterialIcons
                                        name={showOldPass ? "visibility" : "visibility-off"}
                                        size={22}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <InputGroup
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            value={newPass}
                            onChangeText={setNewPass}
                            secureTextEntry={!showNewPass}
                            error={newPassError}
                            iconName="lock-open"
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
                                    <MaterialIcons
                                        name={showNewPass ? "visibility" : "visibility-off"}
                                        size={22}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <InputGroup
                            label="Xác nhận mật khẩu"
                            placeholder="Nhập lại mật khẩu mới"
                            value={confirm}
                            onChangeText={setConfirm}
                            secureTextEntry={!showConfirm}
                            error={confirmError}
                            iconName="verified-user"
                            rightIcon={
                                <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                                    <MaterialIcons
                                        name={showConfirm ? "visibility" : "visibility-off"}
                                        size={22}
                                        color={COLORS.textMuted}
                                    />
                                </TouchableOpacity>
                            }
                        />

                        <View style={styles.rulesContainer}>
                            <PasswordRule text="Tối thiểu 8 ký tự" met={newPass.length >= 8} />
                            <PasswordRule text="Chứa ít nhất một chữ số" met={/[0-9]/.test(newPass)} />
                            <PasswordRule text="Chứa ký tự đặc biệt" met={/[!@#$%^&*]/.test(newPass)} />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveBtn, loading && styles.disabledBtn]}
                    onPress={handleReset}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveBtnText}>Cập nhật mật khẩu</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 22, fontWeight: "700" },
    iconCircle: { padding: 8, borderRadius: 20 },
    scrollContent: { padding: 24 },
    headerSection: { alignItems: "center", marginBottom: 32 },
    iconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: COLORS.card,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 2,
    },
    title: { fontSize: 24, fontWeight: "800", color: COLORS.textMain, marginBottom: 8 },
    subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: "center", lineHeight: 20 },
    form: { gap: 8 },
    rulesContainer: { marginTop: 8, gap: 10 },
    footer: { padding: 24, borderTopWidth: 1, borderTopColor: COLORS.border },
    saveBtn: {
        height: 56,
        backgroundColor: COLORS.buttonBg,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: COLORS.buttonBg,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    disabledBtn: { opacity: 0.7 },
    saveBtnText: { color: COLORS.buttonText, fontSize: 16, fontWeight: "800" },
});

export default ThayDoiPasswordScreen;
