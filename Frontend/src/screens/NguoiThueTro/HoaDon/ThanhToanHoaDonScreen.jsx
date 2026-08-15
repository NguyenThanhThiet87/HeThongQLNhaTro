import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import {
  StyleSheet, View, Text, ScrollView, TouchableOpacity,
  Image, SafeAreaView, StatusBar, useColorScheme
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

import { getHoaDonApi } from '../../../api/HoaDon';
import { formatCurrency } from '../../../utils/formatCurrency';
import { getMonthFromDate } from '../../../utils/formatNgaySinh';
import { createPaymentUrl } from '../../../api/VnPay';
import { createPaymentUrlPayOS } from '../../../api/ThanhToan';

import LoadingOverlay from '../../../components/LoadingOverlay';

const COLORS = {
  primary: "#2563eb",
  primaryLight: "rgba(37, 99, 235, 0.1)",
  bgLight: "#f8f6f6",
  bgDark: "#101f22",
  cardLight: "#ffffff",
  cardDark: "#1e293b",
  textLight: "#1e293b",
  textDark: "#f1f5f9",
  borderLight: "#e2e8f0",
  borderDark: "#334155",
};

export default function ThanhToanHoaDonScreen({ route }) {
  const navigation = useNavigation();
  const maHd = route.params?.maHd; // Mã hóa đơn tạm thời, nên được truyền

  const [hoaDon, setHoaDon] = useState(null);

  const isDark = useColorScheme() === 'dark';
  const [method, setMethod] = useState('vnpay'); // bank, momo, zalopay, cash
  const [loading, setLoading] = useState(false);

  const theme = {
    bg: isDark ? COLORS.bgDark : COLORS.bgLight,
    card: isDark ? COLORS.cardDark : COLORS.cardLight,
    text: isDark ? COLORS.textDark : COLORS.textLight,
    border: isDark ? COLORS.borderDark : COLORS.borderLight,
    subText: isDark ? "#94a3b8" : "#64748b",
  };

  useEffect(() => {
    const fetchHoaDon = async () => {
      const res = await getHoaDonApi(maHd);
      if (res.success) {
        setHoaDon(res.data);
      } else {
        console.error("Lỗi lấy hóa đơn:", res.message);
      }
    };
    if (maHd) {
      fetchHoaDon();
    }
  }, [maHd]);

  const handlePaymentVnPay = async () => {
    setLoading(true);
    const paymentInfo = {
      OrderId: String(hoaDon.maHoaDon), // ép kiểu về string
      OrderType: "other",
      Amount: hoaDon.tongTien,
      OrderDescription: `Thanh toan hoa don phong ${hoaDon.soPhong} thang ${getMonthFromDate(hoaDon.ngayLap)}`,
      Name: hoaDon.nguoiDaiDien.hoTen
    };

    const result = await createPaymentUrl(paymentInfo);
    if (result.success) {
      console.log("URL thanh toán VNPay:", result.data);
      navigation.navigate('ThanhToanVNPay', { paymentUrl: result.data });
    } else {
      console.log("Lỗi", "Không thể tạo URL thanh toán VNPay. Vui lòng thử lại sau." + result.message);
    }
    setLoading(false);
  }

  const handlePaymentPayOS = async () => {
    setLoading(true);
    const result = await createPaymentUrlPayOS(hoaDon.maHoaDon);
    if (result.success) {
      console.log("URL thanh toán PayOS:", result.data);
      navigation.navigate('ThanhToanPayOS', { paymentUrl: result.data });
    } else {
      console.log("Lỗi", "Không thể tạo URL thanh toán PayOS. Vui lòng thử lại sau." + result.message);
    }
    setLoading(false);
  }

  const handlePayment = () => {
    switch (method) {
      case "vnpay":
        handlePaymentVnPay();
        break;
      case "bank":
        return;
      case "payos":
        handlePaymentPayOS();
        break;
      default:
        return;
    }
  }
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Header */}
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: theme.text }]}>Thanh toán hóa đơn</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Invoice Details Card */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <MaterialIcons name="receipt-long" size={22} color={COLORS.primary} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>Chi tiết hóa đơn</Text>
          </View>

          <View style={styles.invoiceList}>
            <InvoiceRow label={`Tiền phòng (Tháng ${getMonthFromDate(hoaDon?.ngayLap)})`} value={hoaDon ? formatCurrency(hoaDon.tienPhong) + "đ" : 'Đang cập nhật...'} theme={theme} />

            <View style={styles.invoiceItem}>
              <View style={styles.row}>
                <Text style={[styles.rowLabel, { color: theme.subText }]}>Tiền điện</Text>
                <Text style={[styles.rowValue, { color: theme.text }]}>{hoaDon ? formatCurrency(hoaDon.tienDien) + "đ" : 'Đang cập nhật...'}</Text>
              </View>
              <View style={styles.rowSub}>
                <Text style={styles.subText}>
                  Chỉ số: {hoaDon?.chiSoDienNuoc?.csdienCu} - {hoaDon?.chiSoDienNuoc?.csdienMoi} kwh
                </Text>
                <Text style={styles.subText}>
                  {(hoaDon?.chiSoDienNuoc?.csdienMoi - hoaDon?.chiSoDienNuoc?.csdienCu) || 0}kwh x {formatCurrency(hoaDon?.chiSoDienNuoc?.giaDien) + "đ"}
                </Text>
              </View>
            </View>

            <View style={styles.invoiceItem}>
              <View style={styles.row}>
                <Text style={[styles.rowLabel, { color: theme.subText }]}>Tiền nước</Text>
                <Text style={[styles.rowValue, { color: theme.text }]}>{hoaDon ? formatCurrency(hoaDon.tienNuoc) + "đ" : 'Đang cập nhật...'}</Text>
              </View>
              <View style={styles.rowSub}>
                <Text style={styles.subText}>
                  Chỉ số: {hoaDon?.chiSoDienNuoc?.csnuocCu} - {hoaDon?.chiSoDienNuoc?.csnuocMoi} m3
                </Text>
                <Text style={styles.subText}>
                  {(hoaDon?.chiSoDienNuoc?.csnuocMoi - hoaDon?.chiSoDienNuoc?.csnuocCu) || 0}m3 x {formatCurrency(hoaDon?.chiSoDienNuoc?.giaNuoc) + "đ"}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.totalSection, { borderTopColor: theme.border }]}>
            <Text style={styles.totalLabel}>TỔNG CỘNG CẦN THANH TOÁN</Text>
            <Text style={styles.totalAmount}>{hoaDon ? formatCurrency(hoaDon.tongTien) + "đ" : 'Đang cập nhật...'}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <Text style={[styles.sectionHeading, { color: theme.text }]}>Phương thức thanh toán</Text>
        <View style={styles.methodGrid}>
          <PaymentOption
            id="bank" icon="account-balance" label="Chuyển khoản ngân hàng"
            sub="Hỗ trợ QR-Pay nhanh chóng" selected={method === 'payos'}
            onPress={() => setMethod('payos')} theme={theme}
          />
          <PaymentOption
            id="vnpay" icon="account-balance-wallet" label="VNPay"
            selected={method === 'vnpay'} onPress={() => setMethod('vnpay')} theme={theme} color="#A50064"
          />
          <PaymentOption
            id="cash" icon="payments" label="Tiền mặt"
            sub="Nộp trực tiếp cho chủ nhà" selected={method === 'cash'}
            onPress={() => setMethod('cash')} theme={theme} color="#16a34a"
          />
        </View>

        {/* QR Code Section (Only if bank is selected) */}
        {method === 'bank' && (
          <View style={[styles.qrCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={styles.qrTitle}>Mã QR VietQR của Chủ Nhà</Text>
            <View style={styles.qrWrapper}>
              <Image
                source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ThiệtNguyễnThanhToán' }}
                style={styles.qrImage}
              />
            </View>
            <View style={styles.bankInfo}>
              <Text style={[styles.accountName, { color: theme.text }]}>NGUYEN VAN A</Text>
              <Text style={styles.accountNumber}>MB BANK - 0987654321</Text>
              <Text style={styles.memoText}>Nội dung: PHONG102 T10 THANH TOAN</Text>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.8} onPress={() => handlePayment()}>
          <MaterialIcons name="verified-user" size={20} color="white" />
          <Text style={styles.confirmBtnText}>Xác nhận thanh toán</Text>
        </TouchableOpacity>
      </View>

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

// --- Sub-components ---

const InvoiceRow = ({ label, value, theme, isLast }) => (
  <View style={[styles.invoiceItem, !isLast && styles.dashedBorder, { borderBottomColor: theme.border }]}>
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.subText }]}>{label}</Text>
      <Text style={[styles.rowValue, { color: theme.text }]}>{value}</Text>
    </View>
  </View>
);

const PaymentOption = ({ id, icon, label, sub, selected, onPress, theme, color }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.methodItem,
      { backgroundColor: theme.card, borderColor: selected ? COLORS.primary : theme.border },
      selected && { borderWidth: 2 }
    ]}
  >
    <MaterialIcons name={icon} size={24} color={color || COLORS.primary} />
    <View style={styles.methodText}>
      <Text style={[styles.methodLabel, { color: theme.text }]}>{label}</Text>
      {sub && <Text style={styles.methodSub}>{sub}</Text>}
    </View>
    <MaterialIcons
      name={selected ? "check-circle" : "radio-button-unchecked"}
      size={22}
      color={selected ? COLORS.primary : "#cbd5e1"}
    />
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  scrollContent: { padding: 16 },
  card: { padding: 20, borderRadius: 20, borderWidth: 1, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: '700' },

  invoiceList: { gap: 12 },
  invoiceItem: { paddingVertical: 4 },
  dashedBorder: { borderBottomWidth: 1, borderStyle: 'dashed', paddingBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '600' },
  rowSub: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  subText: { fontSize: 11, color: '#94a3b8' },

  totalSection: { marginTop: 16, paddingTop: 20, borderTopWidth: 1, alignItems: 'center' },
  totalLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', letterSpacing: 1 },
  totalAmount: { fontSize: 32, fontWeight: '800', color: COLORS.primary, marginTop: 4 },

  sectionHeading: { fontSize: 18, fontWeight: '800', marginTop: 32, marginBottom: 16 },
  methodGrid: { gap: 12 },
  methodItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1 },
  methodText: { flex: 1, marginLeft: 12 },
  methodLabel: { fontSize: 15, fontWeight: '700' },
  methodSub: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  qrCard: { marginTop: 24, padding: 24, borderRadius: 20, borderWidth: 1, alignItems: 'center' },
  qrTitle: { fontSize: 13, fontWeight: '600', color: '#94a3b8', marginBottom: 20 },
  qrWrapper: { padding: 12, backgroundColor: 'white', borderRadius: 16, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  qrImage: { width: 160, height: 160 },
  bankInfo: { marginTop: 20, alignItems: 'center' },
  accountName: { fontSize: 16, fontWeight: '800' },
  accountNumber: { fontSize: 13, color: '#94a3b8', fontWeight: '600', marginTop: 4, textTransform: 'uppercase' },
  memoText: { fontSize: 11, color: COLORS.primary, fontWeight: '700', marginTop: 12, fontStyle: 'italic' },

  footer: { padding: 16, borderTopWidth: 1, paddingBottom: 16 },
  confirmBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, elevation: 8, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 15 },
  confirmBtnText: { color: 'white', fontSize: 16, fontWeight: '800' },
});