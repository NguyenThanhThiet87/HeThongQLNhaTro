import React, { useEffect, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';

import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Image, SafeAreaView, StatusBar, useColorScheme, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import InputGroup from '../../../components/InputGroup';

import { getTenTrangThaiHopDongByValue } from '../../../constants/TRANG_THAI_HOP_DONG';
import { formatCurrency } from '../../../utils/formatCurrency';
import { useUserNtProfile } from '../../../hooks/user/useUserProfile';

const { width } = Dimensions.get('window');

export default function ThongTinCaNhan() {
  const navigation = useNavigation();

  const { user, loading } = useUserNtProfile();

  const { COLORS, isDark, toggleTheme } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bgLight }]}>
      {/* Header */}
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Thông tin cá nhân</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Personal Info Section */}
        <View style={[styles.profileSection, { backgroundColor: COLORS.bgLight }]}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatar || 'https://i.pravatar.cc/300' }}
              style={[styles.avatar, { borderColor: COLORS.primaryLight }]}
            />
          </View>
          <View style={styles.userTextInfo}>
            <Text style={[styles.userName, { color: COLORS.textMain }]}>{user?.hoTen}</Text>
            <Text style={styles.userRoom}>Phòng {user?.soPhong} - Nhà trọ {user?.dayNhaTro}</Text>
          </View>
          <TouchableOpacity style={styles.editProfileBtn} onPress={() => navigation.navigate("ThayDoiThongTinCaNhan", { maNd: user?.maNt })}>
            <Text style={styles.editProfileBtnText}>Chỉnh sửa thông tin</Text>
          </TouchableOpacity>
        </View>

        {/* Details List */}
        <View style={styles.detailsSection}>
          <InputGroup
            label="Giới tính"
            value={user?.gioiTinh == "1" ? "Nam" : user?.gioiTinh == "0" ? "Nữ" : "Khác"}
            iconName="description"
            enable={false}
          />
          {/* Ngày sinh */}
          <InputGroup
            label="Ngày sinh"
            value={user?.ngaySinh}
            iconName="description"
            enable={false}
          />

          {/* Số CCCD */}
          <InputGroup
            label="Số CCCD"
            value={user?.soCccd}
            iconName="description"
            enable={false}
          />
          <InputGroup
            label="Số điện thoại"
            value={user?.soDt}
            iconName="description"
            enable={false}
          />
          {/* Địa chỉ */}
          <InputGroup
            label="ĐỊA CHỈ"
            value={user?.diaChi}
            iconName="description"
            numberOfLines={5}
            enable={false}
          />
          {/* Nghề nghiệp */}
          <InputGroup
            label="Nghề nghiệp"
            value={user?.ngheNghiep}
            iconName="description"
            enable={false}
          />
          <InputGroup
            label="Người liên hệ khẩn cấp"
            value={user?.hoTenNguoiLienHe ? `${user?.hoTenNguoiLienHe} (${user?.quanHeNguoiLienHe}) - ${user?.sdtNguoiLienHe}` : "Chưa cập nhật"}
            iconName="person"
            numberOfLines={5}
            enable={false}
          />
        </View>

        {/* Contract Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: COLORS.textMain }]}>Hợp đồng điện tử</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{getTenTrangThaiHopDongByValue(user?.trangThaiHopDong) || "CHƯA XÁC ĐỊNH"}</Text>
          </View>
        </View>

        <View style={[styles.contractCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
          <View style={styles.contractRow}>
            <Text style={styles.contractLabel}>Mã hợp đồng</Text>
            <Text style={[styles.contractValue, { color: COLORS.textMuted }]}>#HD-{user?.maHopDong || "xxxxxx"}</Text>
          </View>

          <View style={styles.dateGrid}>
            <View style={[styles.dateBox, { backgroundColor: COLORS.bgLight }]}>
              <Text style={styles.dateLabel}>NGÀY BẮT ĐẦU</Text>
              <Text style={[styles.dateValue, { color: COLORS.textMuted }]}>{user?.ngayBdhl || "Chưa xác định"}</Text>
            </View>
            <View style={[styles.dateBox, { backgroundColor: COLORS.bgLight }]}>
              <Text style={styles.dateLabel}>NGÀY KẾT THÚC</Text>
              <Text style={[styles.dateValue, { color: COLORS.textMuted }]}>{user?.ngayKthl || "Chưa xác định"}</Text>
            </View>
          </View>

          <View style={[styles.depositRow, { borderTopColor: COLORS.border }]}>
            <Text style={styles.contractLabel}>Tiền đặt cọc</Text>
            <Text style={styles.depositAmount}>{formatCurrency(user?.tienCoc)}đ</Text>
          </View>

          <TouchableOpacity style={styles.viewDocBtn} onPress={() => navigation.navigate("XemChiTietHopDong", { maHopDong: user?.maHopDong })}>
            <MaterialIcons name="description" size={18} color={COLORS.primary} />
            <Text style={styles.viewDocText}>Xem chi tiết hợp đồng</Text>
          </TouchableOpacity>
        </View>

        {/* Issue Report Section */}
        <View style={styles.reportSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.textMain, marginBottom: 16 }]}>Hỗ trợ & Sự cố</Text>
          <View style={[styles.reportCard, { backgroundColor: COLORS.card }]}>
            <View style={styles.reportIconBg}>
              <MaterialIcons name="report-problem" size={32} color="white" />
            </View>
            <Text style={[styles.reportTitle, { color: COLORS.textMain }]}>Báo cáo thiết bị hư hỏng</Text>
            <Text style={styles.reportDesc}>Thông báo ngay cho ban quản lý nếu thiết bị trong phòng gặp vấn đề.</Text>
            <TouchableOpacity style={styles.createReportBtn} onPress={() => navigation.navigate("Dashboard", { screen: "LapBaoCaoSuCoScreen", params: { maPhong: user?.maPhong } })}>
              <MaterialIcons name="add-circle" size={20} color="white" />
              <Text style={styles.createReportText}>Tạo báo cáo mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Devices Grid */}
        {/* <View style={styles.devicesSection}>
          <Text style={[styles.sectionTitle, { color: COLORS.textMain, marginBottom: 16 }]}>Thiết bị trong phòng</Text>
          <View style={styles.grid}>
            <DeviceItem icon="ac-unit" name="Điều hòa LG" status="Mới 95%" theme={theme} />
            <DeviceItem icon="kitchen" name="Tủ lạnh Samsung" status="Mới 100%" theme={theme} />
            <DeviceItem icon="tv" name="Smart TV 43\" status="Kết nối Wifi" theme={theme} />
            <DeviceItem icon="router" name="Router Wifi 6" status="Băng thông cao" theme={theme} />
          </View>
        </View> */}

        <View style={{ height: 100 }} />

      </ScrollView>
    </SafeAreaView >
  );
}

const DeviceItem = ({ icon, name, status, theme }) => (
  <View style={[styles.deviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <MaterialIcons name={icon} size={24} color={COLORS.primary} />
    <Text style={[styles.deviceName, { color: theme.text }]}>{name}</Text>
    <Text style={styles.deviceStatus}>{status}</Text>
  </View>
);

// --- Styles ---

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },

  scrollContent: { paddingBottom: 20 },

  profileSection: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, borderWidth: 4 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, padding: 8, borderRadius: 20, elevation: 4 },
  userTextInfo: { alignItems: 'center', marginTop: 16, marginBottom: 24 },
  userName: { fontSize: 24, fontWeight: '800' },
  userRoom: { fontSize: 16, color: COLORS.textMuted, fontWeight: '500', marginTop: 4 },
  editProfileBtn: { backgroundColor: COLORS.buttonBg, width: '100%', height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  editProfileBtnText: { color: COLORS.buttonText, fontWeight: '700', fontSize: 14 },

  detailsSection: { paddingHorizontal: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  rowLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 14, color: COLORS.textMain },
  rowValue: { fontSize: 14, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 32, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  statusBadge: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { color: COLORS.primary, fontSize: 10, fontWeight: '800' },

  contractCard: { marginHorizontal: 16, padding: 20, borderRadius: 16, borderWidth: 1 },
  contractRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  contractLabel: { fontSize: 14, color: COLORS.textMain, fontWeight: '500' },
  contractValue: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
  dateGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  dateBox: { flex: 1, padding: 12, borderRadius: 10 },
  dateLabel: { fontSize: 9, color: COLORS.textMain, fontWeight: '800', marginBottom: 4 },
  dateValue: { fontSize: 14, fontWeight: '700', color: COLORS.textMuted },
  depositRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTopWidth: 1, borderStyle: 'dashed' },
  depositAmount: { fontSize: 18, fontWeight: '800', color: COLORS.primary },
  viewDocBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20, height: 44, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(37, 99, 235, 0.2)' },
  viewDocText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },

  reportSection: { paddingHorizontal: 16, marginTop: 32 },
  reportCard: { padding: 24, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  reportIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  reportTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
  reportDesc: { fontSize: 14, color: COLORS.textMain, textAlign: 'center', lineHeight: 20, marginBottom: 20 },
  createReportBtn: { backgroundColor: COLORS.buttonBg, flexDirection: 'row', paddingHorizontal: 24, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' },
  createReportText: { color: COLORS.buttonText, fontWeight: '700' },

  devicesSection: { paddingHorizontal: 16, marginTop: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  deviceCard: { width: (width - 44) / 2, padding: 16, borderRadius: 16, borderWidth: 1, gap: 4 },
  deviceName: { fontSize: 14, fontWeight: '700', marginTop: 8 },
  deviceStatus: { fontSize: 11, color: COLORS.textMain },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 20 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabLabel: { fontSize: 10, marginTop: 4 },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
    backgroundColor: "rgba(239,68,68,0.1)",
    margin: 10
  },

  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
    marginLeft: 6
  },
});