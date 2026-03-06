import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getHoaDonApi } from "../../../api/HoaDon";
import { getTenTrangThaiHoaDonByValue } from "../../../constants/TRANG_THAI_HOA_DON";
import { formatDate } from "../../../utils/formatNgaySinh";
import { InfoCard } from "../../../components/InfoCard";
import { InfoRow } from "../../../components/InfoRow";
import {formatCurrency, convertNumberToWords} from "../../../utils/formatCurrency";

const COLORS = {
  primary: "#13c8ec",
  bgLight: "#f6f8f8",
  bgDark: "#101f22",
  cardLight: "#f1f5f9", // slate-100
  cardDark: "#1e293b",  // slate-800
  textLight: "#0f172a", // slate-900
  textDark: "#f1f5f9",  // slate-100
  subText: "#64748b",   // slate-500
};
const BORDER = "rgba(19,200,236,0.12)";
const BG = "#101f22";

const isDarkMode = true;
const theme = {
  bg: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
  card: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
  text: isDarkMode ? COLORS.textDark : COLORS.textLight,
  border: isDarkMode ? '#334155' : '#e2e8f0',
};

export default function InvoiceDetailScreen({ route }) {
  const { maHd } = route.params;
  const navigation = useNavigation();

  const [hoaDon, setHoaDon] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getHoaDonApi(maHd);
      if (response.success) {
        setHoaDon(response.data);
        console.log("Chi tiết hóa đơn:", response.data);
      } else
        console.error("Lỗi khi lấy chi tiết hóa đơn:", response.message);
    }
    fetchData();
  }, [maHd]);

  const DetailRow = ({ label, value, isBold, isTotal, color }) => (
    <View style={[styles.detailRow, isTotal && { borderTopWidth: 1, borderTopColor: theme.border, pt: 8 }]}>
      <Text style={[styles.label, { color: isBold ? theme.text : COLORS.subText }]}>{label}</Text>
      <Text style={[styles.value, { color: color || theme.text, fontWeight: isBold ? '700' : '500' }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Top Navigation */}
      <View style={[styles.header, { backgroundColor: theme.bg }]}>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="arrow-back-ios" size={18} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Chi tiết hóa đơn</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* General Info Card */}
        <View style={[styles.infoCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.infoRow}>
            <View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getTenTrangThaiHoaDonByValue(hoaDon?.maTthoaDon)}</Text>
              </View>
              <Text style={[styles.invoiceId, { color: theme.text }]}>HD #{hoaDon?.maHoaDon}</Text>
              <Text style={styles.dateText}>Ngày lập: {formatDate(hoaDon?.ngayLap)}</Text>
            </View>
            <View style={styles.receiptIconBox}>
              <MaterialIcons name="receipt" size={36} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: hoaDon?.nguoiDaiDien?.avatar }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={[styles.customerName, { color: theme.text }]}>{hoaDon?.nguoiDaiDien?.hoTen}</Text>
            <Text style={styles.roomInfo}>
              Phòng: <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>{hoaDon?.soPhong}</Text>
            </Text>
          </View>
        </View>

        {/* Billing Sections */}
        <View style={styles.detailsBody}>

          {/* Điện Section */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
              <MaterialIcons name="bolt" size={20} color="#eab308" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>CHI TIẾT TIỀN ĐIỆN</Text>
            </View>
            <DetailRow label="Chỉ số cũ:" value={`${hoaDon?.chiSoDienNuoc?.csdienCu || 0} kWh`} />
            <DetailRow label="Chỉ số mới:" value={`${hoaDon?.chiSoDienNuoc?.csdienMoi || 0} kWh`} />
            <DetailRow label="Tiêu thụ:" value={`${hoaDon?.chiSoDienNuoc?.csdienMoi - hoaDon?.chiSoDienNuoc?.csdienCu || 0} kWh`} color={COLORS.primary} isBold />
            <DetailRow label="Đơn giá:" value={`${formatCurrency(hoaDon?.chiSoDienNuoc?.giaDien || 0)} đ`} />
            <DetailRow label="Thành tiền:" value={`${formatCurrency(hoaDon?.tienDien || 0)} đ`} isBold />
          </View>

          {/* Nước Section */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
              <MaterialIcons name="water" size={20} color="#3b82f6" />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>CHI TIẾT TIỀN NƯỚC</Text>
            </View>
            <DetailRow label="Chỉ số cũ:" value={`${hoaDon?.chiSoDienNuoc?.csnuocCu || 0} m³`} />
            <DetailRow label="Chỉ số mới:" value={`${hoaDon?.chiSoDienNuoc?.csnuocMoi || 0} m³`} />
            <DetailRow label="Tiêu thụ:" value={`${hoaDon?.chiSoDienNuoc?.csnuocMoi - hoaDon?.chiSoDienNuoc?.csnuocCu || 0} m³`} color={COLORS.primary} isBold />
            <DetailRow label="Đơn giá:" value={`${formatCurrency(hoaDon?.chiSoDienNuoc?.giaNuoc || 0)} đ`} />
            <DetailRow label="Thành tiền:" value={`${formatCurrency(hoaDon?.tienNuoc || 0)} đ`} isBold />
          </View>

          {/* Dịch vụ khác */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: theme.border }]}>
              <MaterialIcons name="apps" size={20} color={COLORS.primary} />
              <Text style={[styles.sectionTitle, { color: theme.text }]}>DỊCH VỤ KHÁC</Text>
            </View>
           <DetailRow label={`Tiền phòng (tháng ${new Date(hoaDon?.ngayLap).getMonth() + 1}):`} value={formatCurrency(hoaDon?.tienPhong || 0)} />
          </View>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabelText}>TỔNG CỘNG THANH TOÁN</Text>
          </View>
          <Text style={styles.totalAmount}>{formatCurrency(hoaDon?.tongTien || 0)}</Text>
          <Text style={styles.totalInWords}>{convertNumberToWords(hoaDon?.tongTien || 0) || 'Không có giá trị'}</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Actions */}
      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <TouchableOpacity style={[styles.btnSecondary, { backgroundColor: theme.card }]}>
          <MaterialIcons name="picture-as-pdf" size={20} color={theme.text} />
          <Text style={[styles.btnText, { color: theme.text }]}>Xuất PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnPrimary}>
          <MaterialIcons name="send" size={20} color={COLORS.bgDark} />
          <Text style={[styles.btnText, { color: COLORS.bgDark }]}>Gửi thông báo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
    paddingTop: 50
  },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  iconBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'flex-start' },
  scrollContent: { padding: 16 },

  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 22,
  },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  badgeText: { color: '#22c55e', fontSize: 10, fontWeight: '800' },
  invoiceId: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  dateText: { color: COLORS.subText, fontSize: 13, marginTop: 4 },
  receiptIconBox: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(19, 200, 236, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  customerSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'rgba(19, 200, 236, 0.3)',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatar: { width: '100%', height: '100%' },
  customerName: { fontSize: 18, fontWeight: '700' },
  roomInfo: { color: COLORS.subText, fontSize: 14, marginTop: 2 },

  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { fontSize: 14 },
  value: { fontSize: 14 },

  totalCard: {
    backgroundColor: COLORS.primary,
    padding: 24,
    borderRadius: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  totalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabelText: { fontSize: 12, fontWeight: '700', color: 'rgba(0,0,0,0.6)' },
  totalAmount: { fontSize: 32, fontWeight: '900', color: "#000000" },
  totalInWords: { fontSize: 12, fontStyle: 'italic', color: 'rgba(0,0,0,0.5)', marginTop: 8 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  btnPrimary: {
    flex: 1,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnText: { fontWeight: '700', fontSize: 16 },
});