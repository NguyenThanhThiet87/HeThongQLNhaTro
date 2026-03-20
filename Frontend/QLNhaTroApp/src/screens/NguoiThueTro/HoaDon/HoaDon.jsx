import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/useTheme';

import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  SafeAreaView, StatusBar, useColorScheme, Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

import { getHoaDonNewApi, getLichSuThanhToanGanApi, getThongKeChiTieuApi } from '../../../api/HoaDon';
import { getCurrentUser } from '../../../utils/decodeToken';

import { getDeadlineDate, formatDate } from '../../../utils/formatNgaySinh';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getMonthFromDate } from '../../../utils/formatNgaySinh';

const { width } = Dimensions.get('window');

export default function InvoiceManagement() {
  const navigation = useNavigation();

  const { COLORS, isDark, toggleTheme } = useTheme();
  const styles = createStyles(COLORS);

  const [user, setUser] = useState(getCurrentUser());
  const [latestBill, setLatestBill] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchHoaDon = async () => {
      const res = await getHoaDonNewApi(user.maNd);
      if (res.success) {
        setLatestBill(res.data);
      } else {
        console.error("Failed to fetch invoice:", res.message);
      }
    };
    if (user.maNd)
      fetchHoaDon();
  }, [user]);

  useEffect(() => {
    const fetchLichSu = async () => {
      const res = await getLichSuThanhToanGanApi(user.maNd);
      if (res.success) {
        setPaymentHistory(res.data);
      } else {
        console.error("Failed to fetch payment history:", res.message);
      }
    };
    if (user.maNd)
      fetchLichSu();
  }, [user]);

  useEffect(() => {
    const fetchThongKe = async () => {
      const res = await getThongKeChiTieuApi(user.maNd);
      if (res.success) {
        setExpenseSummary(res.data);
      } else {
        console.error("Failed to fetch expense summary:", res.message);
      }
    };
    if (user.maNd)
      fetchThongKe();
  }, [user]);

  const [activeTab, setActiveTab] = useState('current');

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
          <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Hóa đơn</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      {/* Tabs Navigation */}
      <View style={[styles.tabContainer, { borderBottomColor: COLORS.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('current')}
          style={[styles.tab, activeTab === 'current' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'current' ? styles.activeTabText : { color: COLORS.textMuted }]}>
            Hóa đơn hiện tại
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('history')}
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
        >
          <Text style={[styles.tabText, activeTab === 'history' ? styles.activeTabText : { color: COLORS.textMuted }]}>
            Lịch sử thanh toán
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Spending Chart Section */}
        <View style={styles.section}>
          <View style={[styles.chartCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, { color: COLORS.textMain }]}>Xu hướng chi tiêu (6 tháng)</Text>
              <Text style={styles.chartUnit}>Đơn vị: Triệu VNĐ</Text>
            </View>

            <View style={styles.barChart}>
              {
                expenseSummary?.map((item, index) => {
                  // Lấy tháng từ ngày lập
                  const date = new Date(item.ngayLap);
                  const month = "T" + (date.getMonth() + 1);
                  // Chuyển tiền sang triệu VNĐ
                  const value = item.tongTien / 1000000;
                  return (
                    <ChartBar
                      key={index}
                      month={month}
                      value={value} // hoặc barValue nếu muốn scale
                      active={true}
                      label={value.toFixed(2)}
                    />
                  );
                })
                
              }
            </View>
          </View>
        </View>

        {/* Unpaid Invoice Card */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: COLORS.textMain }]}>Hóa đơn cần thanh toán</Text>
          <View style={[styles.invoiceCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]}>
            <View style={[styles.invoiceHeader, { backgroundColor: COLORS.card }]}>
              <View>
                <Text style={styles.invoiceMonth}>THÁNG {formatDate(latestBill?.ngayLap)}</Text>
                <Text style={[styles.invoiceTitle, { color: COLORS.textMain }]}>Hóa đơn phòng {latestBill?.soPhong}</Text>
              </View>
              <View style={styles.alignRight}>
                <Text style={styles.deadlineLabel}>Hạn chót</Text>
                <Text style={styles.deadlineDate}>{getDeadlineDate(latestBill?.ngayLap)}</Text>
              </View>
            </View>

            <View style={styles.invoiceBody}>
              <InvoiceRow icon="home" label="Tiền phòng" value={formatCurrency(latestBill?.tienPhong) + "đ"} />
              <InvoiceRow icon="bolt" label={`Tiền điện (${latestBill ? latestBill?.chiSoDienNuoc.csdienMoi - latestBill?.chiSoDienNuoc.csdienCu : 0} kWh)`} value={formatCurrency(latestBill?.tienDien) + "đ"} />
              <InvoiceRow icon="water-drop" label={`Tiền nước (${latestBill ? latestBill?.chiSoDienNuoc.csnuocMoi - latestBill?.chiSoDienNuoc.csnuocCu : 0} m³)`} value={formatCurrency(latestBill?.tienNuoc) + "đ"} />

              <View style={[styles.totalRow, { borderTopColor: COLORS.border }]}>
                <Text style={[styles.totalLabel, { color: COLORS.text }]}>Tổng cộng</Text>
                <Text style={styles.totalValue}>{formatCurrency(latestBill?.tongTien) + "đ"}</Text>
              </View>

              {
                latestBill ? (
                  <TouchableOpacity style={styles.payNowBtn} onPress={() => navigation.navigate("ThanhToanHoaDon", { maHd: latestBill.maHoaDon })}>
                    <MaterialIcons name="payments" size={20} color="white" />
                    <Text style={styles.payNowText}>Thanh toán ngay</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[styles.payNowBtn, { backgroundColor: COLORS.inputBgDisabled }]} disabled={true}>
                    <MaterialIcons name="payments" size={20} color="white" />
                    <Text style={[styles.payNowText, { color: COLORS.inputTextDisabled }]}>Không có hóa đơn</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>

        {/* Payment History Preview */}
        <View style={styles.section}>
          <View style={styles.historyHeadingRow}>
            <Text style={[styles.sectionHeading, { color: COLORS.textMain, marginBottom: 0 }]}>Lịch sử gần đây</Text>
            <TouchableOpacity><Text style={{ color: COLORS.primary, fontWeight: '700' }}>Xem tất cả</Text></TouchableOpacity>
          </View>
          {
            paymentHistory.map(item => (
              <HistoryItem
                key={item.maLstt}
                month={`Tháng ${getMonthFromDate(item.ngayThanhToan)}`}
                date={formatDate(item.ngayThanhToan)}
                amount={formatCurrency(item.soTien) + "đ"}
                onPress={() => navigation.navigate("ChiTietGiaoDich", { maLstt: item.maLstt })}
              />
            ))
          }
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Sub-components ---
const ChartBar = ({ month, value, active, label }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);
  return (
    <View style={styles.barContainer}>
      <View style={styles.barWrapper}>
        {active && <Text style={styles.barValueLabel}>{label}</Text>}
        <View style={[styles.bar, { height: `${value * 40}%`, backgroundColor: active ? COLORS.primary : 'rgba(37, 99, 235, 0.2)' }]} />
      </View>
      <Text style={[styles.barMonth, active && { color: COLORS.primary, fontWeight: '700' }]}>{month}</Text>
    </View>
  )
};

const InvoiceRow = ({ icon, label, value }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);
  return (
    <View style={styles.invoiceRow}>
      <View style={styles.rowLabelGroup}>
        <MaterialIcons name={icon} size={18} color="#94a3b8" />
        <Text style={[styles.rowLabel, { color: COLORS.textMain }]}>{label}</Text>
      </View>
      <Text style={[styles.rowValue, { color: COLORS.textMuted }]}>{value}</Text>
    </View>
  )
};

const HistoryItem = ({ month, date, amount, onPress }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS); return (
    <TouchableOpacity style={[styles.historyCard, { backgroundColor: COLORS.card, borderColor: COLORS.border }]} onPress={onPress}>
      <View style={styles.historyLeft}>
        <View style={styles.historyIconBg}>
          <MaterialIcons name="check-circle" size={24} color={COLORS.success} />
        </View>
        <View>
          <Text style={[styles.historyMonth, { color: COLORS.textMuted }]}>{month}</Text>
          <Text style={styles.historyDate}>Đã thanh toán: {date}</Text>
        </View>
      </View>
      <View style={styles.alignRight}>
        <Text style={[styles.historyAmount, { color: COLORS.textMuted }]}>{amount}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>THÀNH CÔNG</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
};

// --- Styles ---
const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  iconBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },

  tabContainer: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '700' },
  activeTabText: { color: COLORS.primary },

  scrollContent: { paddingBottom: 100 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeading: { fontSize: 18, fontWeight: '800', marginBottom: 12 },

  chartCard: { padding: 16, borderRadius: 20, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  chartTitle: { fontSize: 15, fontWeight: '700' },
  chartUnit: { fontSize: 11, color: '#94a3b8' },
  barChart: { flexDirection: 'row', height: 120, width: 80, alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 5 },
  barContainer: { flex: 1, alignItems: 'center' },
  barWrapper: { height: '100%', width: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  bar: { width: '70%', borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barValueLabel: { position: 'absolute', top: 20, fontSize: 10, fontWeight: '700', color: COLORS.primary },
  barMonth: { fontSize: 10, color: '#94a3b8', marginTop: 8 },

  invoiceCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.1, shadowRadius: 15 },
  invoiceHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  invoiceMonth: { fontSize: 10, fontWeight: '700', color: COLORS.primary, letterSpacing: 1 },
  invoiceTitle: { fontSize: 17, fontWeight: '800', marginTop: 2 },
  deadlineLabel: { fontSize: 10, color: '#94a3b8' },
  deadlineDate: { fontSize: 13, fontWeight: '800', color: COLORS.danger },
  alignRight: { alignItems: 'flex-end' },
  invoiceBody: { padding: 16 },
  invoiceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  rowLabelGroup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '600' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 15, marginTop: 5, borderTopWidth: 1, borderStyle: 'dashed' },
  totalLabel: { fontSize: 16, fontWeight: '800' },
  totalValue: { fontSize: 22, fontWeight: '900', color: COLORS.primary },
  payNowBtn: { backgroundColor: COLORS.primary, flexDirection: 'row', height: 54, borderRadius: 15, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 20, elevation: 5, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 10 },
  payNowText: { color: 'white', fontSize: 16, fontWeight: '800' },

  historyHeadingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 16, borderWidth: 1, marginBottom: 10 },
  historyLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  historyIconBg: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(34, 197, 94, 0.1)', justifyContent: 'center', alignItems: 'center' },
  historyMonth: { fontSize: 14, fontWeight: '700' },
  historyDate: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  historyAmount: { fontSize: 14, fontWeight: '700' },
  statusBadge: { backgroundColor: 'rgba(34, 197, 94, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, marginTop: 4 },
  statusText: { color: COLORS.success, fontSize: 9, fontWeight: '800' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 10, marginTop: 4 }
});