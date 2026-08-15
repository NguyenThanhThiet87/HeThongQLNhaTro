import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { getHoaDonApi } from "../../../api/HoaDon";
import { TRANG_THAI_HOA_DON, getTenTrangThaiHoaDonByValue } from "../../../constants/TRANG_THAI_HOA_DON";
import { formatDate } from "../../../utils/formatNgaySinh";
import { exportInvoiceToPDF } from "../../../services/invoiceService";
import { formatCurrency, convertNumberToWords } from "../../../utils/formatCurrency";
import AppHeader from "../../../components/AppHeader";
import toast from "../../../utils/toast";

export default function InvoiceDetailScreen({ route }) {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

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
    };
    fetchData();
  }, [maHd]);

  const DetailRow = ({ label, value, isBold, isTotal, color }) => (
    <View style={[styles.detailRow, isTotal && styles.detailRowTotal]}>
      <Text style={[styles.label, isBold ? styles.labelBold : styles.labelSub]}>
        {label}
      </Text>
      <Text style={[
        styles.value,
        isBold && styles.valueBold,
        color && { color }
      ]}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, styles.headerTitleColor]}>Chi tiết hóa đơn</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* General Info Card */}
        <View style={[styles.infoCard, styles.infoCardBg]}>
          <View style={styles.infoRow}>
            <View>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {getTenTrangThaiHoaDonByValue(hoaDon?.maTthoaDon)}
                </Text>
              </View>
              <Text style={[styles.invoiceId, styles.invoiceIdColor]}>
                HD #{hoaDon?.maHoaDon}
              </Text>
              <Text style={styles.dateText}>
                Ngày lập: {formatDate(hoaDon?.ngayLap)}
              </Text>
            </View>
            <View style={styles.receiptIconBox}>
              <MaterialIcons name="receipt" size={36} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <TouchableOpacity style={styles.customerSection} onPress={() => navigation.navigate("Contract", { screen: "HoSo", params: { maNd: hoaDon?.nguoiDaiDien?.maNt } })}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: hoaDon?.nguoiDaiDien?.avatar || "https://i.pravatar.cc/300" }}
              style={styles.avatar}
            />
          </View>
          <View>
            <Text style={[styles.customerName, styles.customerNameColor]}>
              {hoaDon?.nguoiDaiDien?.hoTen}
            </Text>
            <Text style={styles.roomInfo}>
              Phòng: <Text style={styles.roomInfoPrimary}>{hoaDon?.soPhong}</Text>
            </Text>
          </View>
        </TouchableOpacity>

        {/* Billing Sections */}
        <View style={styles.detailsBody}>
          {/* Điện Section */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, styles.sectionHeaderBorder]}>
              <MaterialIcons name="bolt" size={20} color="#eab308" />
              <Text style={[styles.sectionTitle, styles.sectionTitleColor]}>
                CHI TIẾT TIỀN ĐIỆN
              </Text>
            </View>
            <DetailRow label="Chỉ số cũ:" value={`${hoaDon?.chiSoDienNuoc?.csdienCu || 0} kWh`} />
            <DetailRow label="Chỉ số mới:" value={`${hoaDon?.chiSoDienNuoc?.csdienMoi || 0} kWh`} />
            <DetailRow
              label="Tiêu thụ:"
              value={`${hoaDon?.chiSoDienNuoc?.csdienMoi - hoaDon?.chiSoDienNuoc?.csdienCu || 0} kWh`}
              color={COLORS.primary}
              isBold
            />
            <DetailRow label="Đơn giá:" value={`${formatCurrency(hoaDon?.chiSoDienNuoc?.giaDien || 0)} đ`} />
            <DetailRow label="Thành tiền:" value={`${formatCurrency(hoaDon?.tienDien || 0)} đ`} isBold />
          </View>

          {/* Nước Section */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, styles.sectionHeaderBorder]}>
              <MaterialIcons name="water" size={20} color="#3b82f6" />
              <Text style={[styles.sectionTitle, styles.sectionTitleColor]}>
                CHI TIẾT TIỀN NƯỚC
              </Text>
            </View>
            <DetailRow label="Chỉ số cũ:" value={`${hoaDon?.chiSoDienNuoc?.csnuocCu || 0} m³`} />
            <DetailRow label="Chỉ số mới:" value={`${hoaDon?.chiSoDienNuoc?.csnuocMoi || 0} m³`} />
            <DetailRow
              label="Tiêu thụ:"
              value={`${hoaDon?.chiSoDienNuoc?.csnuocMoi - hoaDon?.chiSoDienNuoc?.csnuocCu || 0} m³`}
              color={COLORS.primary}
              isBold
            />
            <DetailRow label="Đơn giá:" value={`${formatCurrency(hoaDon?.chiSoDienNuoc?.giaNuoc || 0)} đ`} />
            <DetailRow label="Thành tiền:" value={`${formatCurrency(hoaDon?.tienNuoc || 0)} đ`} isBold />
          </View>

          {/* Dịch vụ khác */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader, styles.sectionHeaderBorder]}>
              <MaterialIcons name="apps" size={20} color={COLORS.primary} />
              <Text style={[styles.sectionTitle, styles.sectionTitleColor]}>
                DỊCH VỤ KHÁC
              </Text>
            </View>
            <DetailRow
              label={`Tiền phòng (tháng ${new Date(hoaDon?.ngayLap).getMonth() + 1}):`}
              value={formatCurrency(hoaDon?.tienPhong || 0)}
            />
          </View>
        </View>

        {/* Total Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabelText}>TỔNG CỘNG THANH TOÁN</Text>
          </View>
          <Text style={styles.totalAmount}>{formatCurrency(hoaDon?.tongTien || 0)}</Text>
          <Text style={styles.totalInWords}>
            {convertNumberToWords(hoaDon?.tongTien || 0) || 'Không có giá trị'}
          </Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Floating Actions */}
      <View style={[styles.footer, styles.footerBg]}>
        <TouchableOpacity
          style={[styles.btnSecondary, styles.btnSecondaryBg]}
          onPress={() => exportInvoiceToPDF(hoaDon)}
        >
          <MaterialIcons name="picture-as-pdf" size={20} color={COLORS.text} />
          <Text style={[styles.btnText, styles.btnTextColor]}>Xuất PDF</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            hoaDon?.maTthoaDon == TRANG_THAI_HOA_DON.DA_THANH_TOAN && { opacity: 0.5 }
          ]}
          disabled={hoaDon?.maTthoaDon == TRANG_THAI_HOA_DON.DA_THANH_TOAN}
        >
          <MaterialIcons name="send" size={20} color={COLORS.bgDark} />
          <Text style={[styles.btnText, styles.btnTextBgDark]}>Gửi thông báo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  headerTitleColor: { color: COLORS.textMain },
  iconCircle: { padding: 8, borderRadius: 20 },
  scroll: {
    paddingVertical: 16,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 22,
  },
  infoCardBg: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border,
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
  invoiceIdColor: { color: COLORS.textMain },
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
  customerNameColor: { color: COLORS.textMain },
  roomInfo: { color: COLORS.subText, fontSize: 14, marginTop: 2 },
  roomInfoPrimary: { color: COLORS.primary, fontWeight: 'bold' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 8,
    marginBottom: 12,
    gap: 8,
  },
  sectionHeaderBorder: { borderBottomColor: COLORS.border },
  sectionTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
  sectionTitleColor: { color: COLORS.textMain },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  detailRowTotal: { borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8 },
  label: { fontSize: 14 },
  labelBold: { color: COLORS.text, fontWeight: '700' },
  labelSub: { color: COLORS.subText, fontWeight: '500' },
  value: { fontSize: 14 },
  valueBold: { fontWeight: '700' },
  totalCard: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 20,
    shadowColor: COLORS.card,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  totalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  totalLabelText: { fontSize: 12, fontWeight: '700', color: COLORS.textMain },
  totalAmount: { fontSize: 32, fontWeight: '900', color: COLORS.textMain },
  totalInWords: { fontSize: 12, fontStyle: 'italic', color: COLORS.textMuted, marginTop: 8 },
  spacer: { height: 100 },
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
  footerBg: { backgroundColor: COLORS.bgLight, borderTopColor: COLORS.border },
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
  btnSecondaryBg: { backgroundColor: COLORS.card },
  btnText: { fontWeight: '700', fontSize: 16 },
  btnTextColor: { color: COLORS.text },
  btnTextBgDark: { color: COLORS.bgDark },
});