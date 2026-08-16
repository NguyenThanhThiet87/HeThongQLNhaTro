import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { getLichSuBaoCaoApi } from '../../../api/SuCo';
import { getCurrentUser } from '../../../utils/decodeToken';
import { getNguoiThueApi } from '../../../api/NguoiDung';
import { getHoaDonNewApi } from '../../../api/HoaDon';
import { formatDate, getDeadlineDate } from '../../../utils/formatNgaySinh';
import { formatCurrency } from '../../../utils/formatCurrency';
import ChatSupport from "../../../components/ChatSupport";
import { useUnreadNotifications } from '../../../hooks/useUnreadNotifications';

const { width } = Dimensions.get('window');

export default function TenantDashboard() {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const navigation = useNavigation();

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [user, setUser] = useState(null);
  const [tenantDetails, setTenantDetails] = useState(null);
  const [latestBill, setLatestBill] = useState(null);
  const [lichSuBaoCao, setLichSuBaoCao] = useState([]);
  const { hasUnreadNotifications } = useUnreadNotifications();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      };
      fetchUser();
    }, [])
  );
  useEffect(() => {
    const fetchLichSuBaoCao = async () => {
      if (user) {
        const res = await getLichSuBaoCaoApi(user.maNd);
        if (res.success) {
          setLichSuBaoCao(res.data);
          console.log("Lịch sử báo cáo:", res.data);
        } else {
          console.error("Lỗi lấy lịch sử báo cáo:", res.message);
        }
      }
    }
    fetchLichSuBaoCao();
  }, [user]);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      if (user) {
        const res = await getNguoiThueApi(user.maNd);
        if (res.success) {
          setTenantDetails(res.data);
          console.log("Chi tiết người thuê:", res.data);
        } else {
          console.error("Lỗi lấy chi tiết người thuê:", res.message);
        }
      }
    }
    fetchTenantDetails();
  }, [user]);

  useEffect(() => {
    const fetchLatestBill = async () => {
      if (user) {
        const res = await getHoaDonNewApi(user.maNd);
        if (res.success) {
          console.log("Hóa đơn mới nhất:", res.data);
          setLatestBill(res.data);
        } else {
          console.error("Lỗi lấy hóa đơn mới:", res.message);
        }
      }
    }
    fetchLatestBill();
  }, [user]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.bgLight }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: COLORS.bgLight }]}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: tenantDetails?.avatar || "https://i.pravatar.cc/300" }}
            style={[styles.avatar, { borderColor: COLORS.primary }]}
          />
          <View style={styles.userText}>
            <Text style={styles.greeting}>Xin chào,</Text>
            <Text style={[styles.userName, { color: COLORS.textMuted }]}>{user?.hoTen}! 👋</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.notifBtn, { backgroundColor: COLORS.card }]} onPress={() => navigation.navigate("ThongBaoTenantScreen")}>
          <MaterialIcons name="notifications-none" size={24} color={COLORS.textMuted} />
          {hasUnreadNotifications && <View style={styles.notifBadge} />}
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Monthly Expense Card - Blue Gradient Style */}
          <View style={styles.expenseCard}>
            <View style={styles.expenseHeader}>
              <View>
                <Text style={styles.expenseLabel}>Tổng tiền cần đóng tháng này</Text>
                <Text style={styles.expenseAmount}>{latestBill ? formatCurrency(latestBill.tongTien) + "đ" : 'Không có ...'}</Text>
              </View>
              <View style={styles.walletIconBg}>
                <MaterialIcons name="account-balance-wallet" size={24} color="white" />
              </View>
            </View>
            <View style={styles.expenseFooter}>
              <View style={styles.deadlineBox}>
                <MaterialIcons name="calendar-today" size={14} color="rgba(255,255,255,0.8)" />
                <Text style={styles.deadlineText}>Hạn thanh toán: <Text style={{ fontWeight: '700' }}>{latestBill ? getDeadlineDate(latestBill.ngayLap) : 'Đang cập nhật...'}</Text></Text>
              </View>
              {
                latestBill == null ? null : (
                  <TouchableOpacity style={styles.payBtn} onPress={() => navigation.navigate("Bill", { screen: 'ThanhToanHoaDon', params: { maHd: latestBill.maHoaDon } })}>
                    <Text style={styles.payBtnText}>Thanh toán ngay</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>

          {/* Room Info Card */}
          <View style={[styles.roomCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.roomLabel}>THÔNG TIN PHÒNG</Text>
              <Text style={[styles.roomName, { color: COLORS.text }]}>Nhà trọ {tenantDetails?.dayNhaTro} - {tenantDetails?.soPhong}</Text>
              <View style={styles.roomDetails}>
                <View style={styles.detailItem}>
                  <MaterialIcons name="group" size={16} color="#94a3b8" />
                  <Text style={styles.detailText}>{tenantDetails?.soNguoiO} người</Text>
                </View>
              </View>
            </View>
            <View style={styles.roomIconBg}>
              <MaterialIcons name="apartment" size={32} color={COLORS.primary} />
            </View>
          </View>

          {/* Quick Actions Grid */}
          <Text style={[styles.sectionTitle, { color: COLORS.textMain }]}>Tiện ích nhanh</Text>
          <View style={styles.grid}>
            <QuickAction icon="opacity" label="Đặt nước/gas" color="#3b82f6" onPress={() => navigation.navigate("Tenant", { screen: 'DichVu' })} />
            <QuickAction icon="report-problem" label="Báo sự cố" color="#ef4444" onPress={() => navigation.navigate('LapBaoCaoSuCoScreen', { maPhong: tenantDetails?.maPhong })} />
            <QuickAction icon="history" label="Lịch sử trả tiền" color="#22c55e" onPress={() => navigation.navigate('Bill', { screen: 'LichSuGiaoDich' })} />
            <QuickAction icon="chat" label="Chat chủ trọ" color="#f59e0b" onPress={() => navigation.navigate('ChatChuNhaTroScreen')} />
          </View>

          {/* Recent Activity */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: COLORS.textMain, marginTop: 0 }]}>Yêu cầu gần đây</Text>
            <TouchableOpacity><Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>Xem tất cả</Text></TouchableOpacity>
          </View>
          {
            lichSuBaoCao.map((item) => {
              return (
                <ActivityItem key={item.maSuCo} icon="build" title={item.chiTietSuCos[0].moTaSuCo} date={formatDate(item.thoiGian)} status={item.tenTrangThaiXuLy} statusColor="#16a34a" onPress={() => navigation.navigate("ChiTietBaoCaoTenantScreen", { maBasc: item.maSuCo })} />
              )
            })
          }
        </ScrollView>
        <ChatSupport />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Sub-components
const QuickAction = ({ icon, label, color, onPress }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <TouchableOpacity style={[styles.gridItem, { backgroundColor: COLORS.card, borderColor: COLORS.border }]} onPress={onPress}>
      <View style={[styles.actionIconBg, { backgroundColor: color + '15' }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.actionLabel, { color: COLORS.textMain }]}>{label}</Text>
    </TouchableOpacity>
  )
};

const ActivityItem = ({ icon, title, date, status, statusColor, onPress }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <TouchableOpacity style={[styles.activityItem, { backgroundColor: COLORS.card, borderColor: COLORS.border }]} onPress={onPress}>
      <View style={styles.activityIconBg}>
        <MaterialIcons name={icon} size={20} color="#64748b" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.activityTitle, { color: COLORS.textMain }]}>{title}</Text>
        <Text style={styles.activitySub}>{date} • <Text style={{ color: statusColor, fontWeight: '600' }}>{status}</Text></Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
    </TouchableOpacity>
  )
};

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 50
  },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, borderWidth: 2 },
  userText: { marginLeft: 10 },
  greeting: { fontSize: 12, color: '#64748b', fontWeight: '500' },
  userName: { fontSize: 17, fontWeight: '700' },
  notifBtn: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  notifBadge: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary, borderWeight: 2, borderColor: 'white' },

  scrollContent: { paddingBottom: 100 },

  expenseCard: {
    margin: 16,
    padding: 15,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { height: 5, width: 0 }
  },
  expenseLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
  expenseAmount: { color: 'white', fontSize: 32, fontWeight: '800', marginTop: 4 },
  expenseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  walletIconBg: { backgroundColor: 'rgba(255,255,255,0.2)', p: 8, borderRadius: 10, padding: 8 },
  expenseFooter: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deadlineBox: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deadlineText: { color: 'rgba(255,255,255,0.9)', fontSize: 11 },
  payBtn: { backgroundColor: 'white', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10 },
  payBtnText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },

  roomCard: { marginHorizontal: 16, padding: 16, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  roomLabel: { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1 },
  roomName: { fontSize: 15, fontWeight: '700', marginTop: 4 },
  roomDetails: { flexDirection: 'row', gap: 15, marginTop: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, color: '#64748b' },
  roomIconBg: { width: 56, height: 56, borderRadius: 12, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },

  sectionTitle: { fontSize: 16, fontWeight: '700', px: 16, paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  gridItem: { width: (width - 44) / 2, margin: 5, padding: 16, borderRadius: 16, borderWidth: 1, elevation: 1 },
  actionIconBg: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 14, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  activityItem: { marginHorizontal: 16, marginBottom: 10, padding: 12, borderRadius: 16, borderWidth: 1, flexDirection: 'row', alignItems: 'center' },
  activityIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  activityTitle: { fontSize: 14, fontWeight: '700' },
  activitySub: { fontSize: 11, color: '#64748b', marginTop: 2 },
});
