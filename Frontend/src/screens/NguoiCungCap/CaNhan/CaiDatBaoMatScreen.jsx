import React, { useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';
import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, Switch, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

import { useSecuritySettings } from '../../../hooks/settings/useSettings';
import { getCurrentUser } from '../../../utils/decodeToken';

export default function CaiDatBaoMatScreen() {
  const navigation = useNavigation();
  const { COLORS, isDark, toggleTheme } = useTheme();
  const styles = createStyles(COLORS);

  // States cho các nút gạt (Switch)
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  const { currentUser } = useSecuritySettings();

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Section: Đăng nhập */}
        <Text style={styles.sectionLabel}>ĐĂNG NHẬP</Text>
        <View style={styles.card}>
          {/* Phone Change */}
          <View style={[styles.row, styles.borderBottom]}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons name="smartphone" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowSubLabel}>Số điện thoại</Text>
                <Text style={styles.rowMainLabel}>{currentUser?.soDt || "Chưa cập nhật"}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.smallBtn} onPress={() => navigation.navigate("ThayDoiSoDienThoai", { maNd: currentUser?.maNt })}>
              <Text style={styles.smallBtnText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>

          {/* Password Change */}
          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("ThayDoiMatKhau")}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}>
                <MaterialIcons name="lock-outline" size={24} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowMainLabel}>Thay đổi mật khẩu</Text>
                <Text style={styles.rowDesc}>Nên thay đổi định kỳ để bảo mật</Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section: Bảo mật bổ sung */}
        <Text style={styles.sectionLabel}>BẢO MẬT BỔ SUNG</Text>
        <View style={styles.card}>
          <View style={[styles.row, styles.borderBottom]}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBoxSmall}>
                <MaterialIcons name="fingerprint" size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowMainLabel}>Vân tay / FaceID</Text>
                <Text style={styles.rowDesc}>Đăng nhập nhanh không cần mật khẩu</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#cbd5e1", true: COLORS.primary }}
              thumbColor={"#fff"}
              onValueChange={() => setBiometricEnabled(!biometricEnabled)}
              value={biometricEnabled}
            />
          </View>

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBoxSmall}>
                <MaterialIcons name="verified-user" size={22} color={COLORS.primary} />
              </View>
              <View>
                <Text style={styles.rowMainLabel}>Xác thực 2 lớp (2FA)</Text>
                <Text style={styles.rowDesc}>Thêm lớp bảo mật khi đăng nhập</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#cbd5e1", true: COLORS.primary }}
              thumbColor={"#fff"}
              onValueChange={() => setTwoFAEnabled(!twoFAEnabled)}
              value={twoFAEnabled}
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgLight },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  scrollContent: { padding: 16, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textMain,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
    marginLeft: 4
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconBoxSmall: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rowMainLabel: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  rowSubLabel: { fontSize: 13, color: COLORS.textMuted, marginBottom: 2 },
  rowDesc: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },

  smallBtn: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  smallBtnText: { color: COLORS.primary, fontSize: 13, fontWeight: '700' },

  deviceList: { gap: 12, marginBottom: 24 },
  currentDeviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(37, 99, 235, 0.2)',
  },
  otherDeviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deviceName: { fontSize: 16, fontWeight: '700', color: COLORS.textMain },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  currentBadgeText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  deviceLocation: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  logoutIconBtn: { padding: 8, borderRadius: 20, backgroundColor: 'rgba(239, 68, 68, 0.05)' },

  footerActions: { marginTop: 8, alignItems: 'center' },
  logoutAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 8,
  },
  logoutAllText: { color: COLORS.danger, fontSize: 16, fontWeight: '700' },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginTop: 16,
    paddingHorizontal: 32,
  },
});
