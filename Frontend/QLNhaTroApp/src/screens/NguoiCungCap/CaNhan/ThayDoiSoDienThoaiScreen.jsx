import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    useColorScheme
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import LoadingOverlay from '../../../components/LoadingOverlay';

const COLORS = {
    primary: "#13c8ec",
    bgLight: "#f6f8f8",
    bgDark: "#101f22",
    slate100: "#f1f5f9",
    slate200: "#e2e8f0",
    slate400: "#94a3b8",
    slate600: "#475569",
    slate700: "#334155",
    slate800: "#1e293b",
};

export default function ThayDoiSoDienThoaiScreen() {
    const navigation = useNavigation();
    const { COLORS } = useTheme();
    const colorScheme = useColorScheme();

    const isDark = colorScheme === 'dark';
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    
    const theme = {
        background: isDark ? COLORS.bgDark : COLORS.bgLight,
        text: isDark ? "#f1f5f9" : COLORS.slate900,
        subText: isDark ? COLORS.slate400 : COLORS.slate600,
        inputBg: isDark ? "rgba(255, 255, 255, 0.05)" : "#ffffff",
        border: isDark ? COLORS.slate800 : COLORS.slate200,
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: "#0f172a" }]}>Cập nhật số điện thoại</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color="#0f172a" />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header Section */}
                    <Text style={[styles.description, { color: theme.subText }]}>
                        Vui lòng nhập số điện thoại mới của bạn. Chúng tôi sẽ gửi mã OTP để xác nhận danh tính của bạn.
                    </Text>

                    {/* Input Section */}
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.text }]}>Số điện thoại mới</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                            <MaterialIcons name="smartphone" size={20} color={COLORS.slate400} style={styles.inputIcon} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="Nhập số điện thoại mới"
                                placeholderTextColor={COLORS.slate400}
                                keyboardType="phone-pad"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                            />
                        </View>
                    </View>

                    {/* Informational Note */}
                    <View style={[styles.infoBox, { backgroundColor: isDark ? 'rgba(19, 200, 236, 0.15)' : 'rgba(19, 200, 236, 0.1)' }]}>
                        <MaterialIcons name="info-outline" size={20} color={COLORS.primary} />
                        <Text style={[styles.infoText, { color: isDark ? COLORS.slate200 : COLORS.slate700 }]}>
                            Một mã xác thực (OTP) gồm 6 chữ số sẽ được gửi qua tin nhắn SMS đến số điện thoại này để hoàn tất quy trình.
                        </Text>
                    </View>
                </ScrollView>

                {/* Sticky Bottom Button */}
                <View style={[styles.footer, { borderTopColor: theme.border }]}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[styles.primaryButton, { backgroundColor: COLORS.primary }]}
                    >
                        <Text style={styles.buttonText}>Gửi mã xác thực</Text>
                    </TouchableOpacity>
                    {/* Spacing for gesture navigation on iOS */}
                    <View style={{ height: Platform.OS === 'ios' ? 20 : 10 }} />
                </View>
            </KeyboardAvoidingView>
            <LoadingOverlay visible={false} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        height: 56,
        paddingHorizontal: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    infoBox: {
        flexDirection: 'row',
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    footer: {
        padding: 16,
        borderTopWidth: 1,
    },
    primaryButton: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        // Shadow for Android
        elevation: 4,
        // Shadow for iOS
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#000', // Sẫm màu theo design primary
    },
});