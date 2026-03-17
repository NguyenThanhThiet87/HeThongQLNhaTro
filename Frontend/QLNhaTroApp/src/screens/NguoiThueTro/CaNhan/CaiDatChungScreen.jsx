import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from "../../../theme/useTheme";

import {
    StyleSheet, View, Text, ScrollView, TouchableOpacity,
    SafeAreaView, StatusBar, Switch, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

export default function CaiDatChungScreen() {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);
    const navigation = useNavigation();

    // States cho các nút gạt
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);
    const [emailNotif, setEmailNotif] = useState(false);
    const [biometric, setBiometric] = useState(true);

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Cài đặt chung</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Giao diện & Ngôn ngữ */}
                <SettingGroup title="GIAO DIỆN & NGÔN NGỮ">
                    <SettingRow
                        icon="dark-mode"
                        label="Chế độ tối"
                        right={
                            <Switch
                                value={isDark}
                                onValueChange={toggleTheme}
                                trackColor={{ false: "#cbd5e1", true: COLORS.primary }}
                            />
                        }
                    />
                    <SettingRow
                        icon="language"
                        label="Ngôn ngữ"
                        value="Tiếng Việt"
                        onPress={() => { }}
                        isLast
                    />
                </SettingGroup>

                {/* Thông báo */}
                <SettingGroup title="THÔNG BÁO">
                    <SettingRow
                        icon="notifications"
                        label="Thông báo đẩy"
                        subLabel="Nhận thông báo tức thì trên điện thoại"
                        right={
                            <Switch
                                value={pushNotif}
                                onValueChange={setPushNotif}
                                trackColor={{ false: "#cbd5e1", true: COLORS.primary }}
                            />
                        }
                    />
                    <SettingRow
                        icon="mail"
                        label="Thông báo qua Email"
                        subLabel="Hóa đơn và báo cáo hàng tháng"
                        right={
                            <Switch
                                value={emailNotif}
                                onValueChange={setEmailNotif}
                                trackColor={{ false: "#cbd5e1", true: COLORS.primary }}
                            />
                        }
                        isLast
                    />
                </SettingGroup>

                {/* Thông tin */}
                <SettingGroup title="THÔNG TIN ỨNG DỤNG">
                    <SettingRow
                        icon="info"
                        label="Giới thiệu về ứng dụng"
                        value="v2.4.0"
                        onPress={() => { }}
                    />
                    <SettingRow
                        icon="policy"
                        label="Chính sách bảo mật"
                        onPress={() => { }}
                        isLast
                    />
                </SettingGroup>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

// --- Sub-components ---
const SettingGroup = ({ title, children }) => {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);
    return (
        <View style={styles.groupContainer}>
            <Text style={styles.groupTitle}>{title}</Text>
            <View style={styles.groupCard}>{children}</View>
        </View>
    )
};

const SettingRow = ({ icon, label, subLabel, value, right, onPress, isLast }) => {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);

    const Content = (
        <View style={[styles.row, !isLast && styles.rowBorder]}>
            <View style={styles.rowLeft}>
                <View style={styles.iconBox}>
                    <MaterialIcons name={icon} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.rowLabel}>{label}</Text>
                    {subLabel && <Text style={styles.rowSubLabel}>{subLabel}</Text>}
                </View>
            </View>
            <View style={styles.rowRight}>
                {value && <Text style={styles.rowValue}>{value}</Text>}
                {right ? right : <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />}
            </View>
        </View>
    );

    return onPress ? (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{Content}</TouchableOpacity>
    ) : (
        <View>{Content}</View>
    );
};

// --- Styles ---
const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgLight },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scrollContent: { paddingBottom: 20 },
    groupContainer: { marginTop: 20, px: 16, paddingHorizontal: 16 },
    groupTitle: { fontSize: 12, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
    groupCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },

    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
    rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: { flex: 1 },
    rowLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textMain },
    rowSubLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

    rowRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    rowValue: { fontSize: 14, color: COLORS.textMuted },

    logoutBtn: {
        margin: 16,
        marginTop: 32,
        height: 56,
        backgroundColor: 'rgba(239, 68, 68, 0.08)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    logoutText: { color: COLORS.danger, fontSize: 16, fontWeight: '700' },

    bottomNav: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 80,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    },
    navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    navLabel: { fontSize: 10, marginTop: 4 },
});