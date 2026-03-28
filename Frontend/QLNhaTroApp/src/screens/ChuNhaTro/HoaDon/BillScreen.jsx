import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable,
  StatusBar
} from "react-native";
import LottieView from 'lottie-react-native';

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTrosApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getHoaDonsApi, getThangNamHDApi } from "../../../api/HoaDon";
import { DANH_SACH_TRANG_THAI_HOA_DON, TRANG_THAI_HOA_DON } from "../../../constants/TRANG_THAI_HOA_DON";
import ComboBox from "../../../components/ComboBox";

import { formatCurrency } from "../../../utils/formatCurrency";
import { getTenTrangThaiHoaDonByValue } from "../../../constants/TRANG_THAI_HOA_DON";
import { formatDate } from "../../../utils/formatNgaySinh";

const PRIMARY = "#13c8ec";

export default function InvoiceScreen() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const [dayNhaTroList, setDayNhaTroList] = useState([]);
  const [selectedDayNhaTro, setSelectedDayNhaTro] = useState(null);
  const [selectedTrangThai, setSelectedTrangThai] = useState("");
  const [monthFilterList, setMonthFilterList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hoaDons, setHoaDons] = useState([]);

  const fetchDayNhaTros = useCallback(async () => {
    const user = await getCurrentUser();
    if (!user) return;
    const response = await getDayNhaTrosApi(user.maNd);
    if (response.success) {
      setDayNhaTroList(response.data);
      if (response.data.length > 0 && !selectedDayNhaTro) {
        setSelectedDayNhaTro(response.data[0].maDayNt);
      }
    } else {
      console.error("Lỗi khi lấy danh sách dãy nhà trọ:", response.message);
    }
  }, [selectedDayNhaTro]);

  const fetchThangNam = useCallback(async () => {
    if (selectedDayNhaTro) {
      const response = await getThangNamHDApi(selectedDayNhaTro);
      if (response.success) {
        const months = response.data.map(item => ({
          label: `${item.month.toString().padStart(2, "0")}/${item.year}`,
          value: `${item.year}-${item.month.toString().padStart(2, "0")}`
        }));
        setMonthFilterList(months);
        if (response.data.length > 0 && !selectedMonth) {
          setSelectedMonth(`${response.data[0].year}-${response.data[0].month.toString().padStart(2, "0")}`);
        }
      } else {
        console.log("Lỗi lấy tháng năm:", response.message);
      }
    }
  }, [selectedDayNhaTro, selectedMonth]);

  const fetchHoaDons = useCallback(async () => {
    if (selectedDayNhaTro && selectedMonth) {
      const [year, month] = selectedMonth.split("-");
      const response = await getHoaDonsApi(selectedDayNhaTro, parseInt(month), parseInt(year), selectedTrangThai);

      if (response.success) {
        setHoaDons(response.data);
      } else {
        console.error("Lỗi lấy danh sách hóa đơn:", response.message);
      }
    }
  }, [selectedDayNhaTro, selectedMonth, selectedTrangThai]);

  useFocusEffect(
    useCallback(() => {
      fetchDayNhaTros();
      fetchThangNam();
      fetchHoaDons();
    }, [fetchDayNhaTros, fetchThangNam, fetchHoaDons])
  );

  useEffect(() => {
    fetchThangNam();
  }, [selectedDayNhaTro]);

  useEffect(() => {
    fetchHoaDons();
  }, [selectedDayNhaTro, selectedMonth, selectedTrangThai]);

  const [totalThu, setTotalThu] = useState(0);
  const [totalChuaThanhToan, setTotalChuaThanhToan] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const newTotalThu = hoaDons.filter(hd => hd.maTthoaDon == TRANG_THAI_HOA_DON.DA_THANH_TOAN).reduce((sum, hd) => sum + hd.tongTien, 0);
      const newTotalChuaThanhToan = hoaDons.filter(hd => hd.maTthoaDon == TRANG_THAI_HOA_DON.CHUA_THANH_TOAN).reduce((sum, hd) => sum + hd.tongTien, 0);
      setTotalThu(newTotalThu);
      setTotalChuaThanhToan(newTotalChuaThanhToan);
    };
    fetchData();
  }, [hoaDons]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      {/* HEADER */}
      <View style={styles.header}>

        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Hóa đơn</Text>

          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="search" size={22} color={PRIMARY} />
          </TouchableOpacity>
        </View>

        {/* CHIP FILTER */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {
              dayNhaTroList.map((day) => (
                <TouchableOpacity key={day.maDayNt} style={selectedDayNhaTro === day.maDayNt ? styles.chipActive : styles.chip} onPress={() => setSelectedDayNhaTro(day.maDayNt)}>
                  <Text style={selectedDayNhaTro === day.maDayNt ? styles.chipTextActive : styles.chipText}>{day.tenDayNt}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        </ScrollView>

        {/* FILTER ROW */}
        <View style={styles.filterRow}>
          <ComboBox
            data={monthFilterList}
            placeholder="Chọn tháng"
            value={selectedMonth}
            onChange={item => setSelectedMonth(item.value)}
            textColor={COLORS.inputText}
            placeholderColor={COLORS.textMuted}
            itemTextColor={COLORS.textMain}
            style={{ backgroundColor: COLORS.inputBg }}
            width={140}
          />
          <ComboBox
            data={DANH_SACH_TRANG_THAI_HOA_DON}
            value={selectedTrangThai}
            onChange={item => setSelectedTrangThai(item.value)}
            textColor={COLORS.inputText}
            placeholderColor={COLORS.textMuted}
            itemTextColor={COLORS.textMain}
            style={{ backgroundColor: COLORS.inputBg }}
            width={170}
          />
        </View>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>

        {/* SUMMARY */}
        <View style={styles.summaryRow}>

          <View style={styles.summaryCardPrimary}>
            <Text style={styles.summaryLabel}>TỔNG ĐÃ THU</Text>
            <Text style={styles.summaryValuePrimary}>
              {formatCurrency(totalThu)}đ
            </Text>
          </View>

          <View style={styles.summaryCardWarn}>
            <Text style={styles.summaryLabel}>
              CHƯA THANH TOÁN
            </Text>
            <Text style={styles.summaryValueWarn}>
              {formatCurrency(totalChuaThanhToan)}đ
            </Text>
          </View>

        </View>

        <Text style={styles.sectionTitle}>
          DANH SÁCH HÓA ĐƠN
        </Text>
        {
          hoaDons.length != 0 ? (
            hoaDons.map((item) => (
              <TouchableOpacity key={item.maHoaDon} style={styles.card} onPress={() => navigation.navigate("ChiTietHoaDon", { maHd: item.maHoaDon })}>

                <View style={styles.cardTop}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>

                    <View style={styles.roomBox}>
                      <Text style={styles.roomText}>{item.soPhong}</Text>
                    </View>

                    <Text style={styles.name}>
                      {item.tenNguoiDaiDien}
                    </Text>

                  </View>
                  <View style={styles.badgePaid}>
                    <Text style={styles.badgePaidText}>
                      {getTenTrangThaiHoaDonByValue(item.maTthoaDon)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.date}>
                      Ngày lập: {formatDate(item.ngayLap)}
                    </Text>
                  </View>

                  <Text style={styles.amount}>
                    {formatCurrency(item.tongTien)}đ
                  </Text>
                </View>

              </TouchableOpacity>
            ))
          ) : (
            <View style={{ marginTop: 0, alignItems: "center", gap: 20 }}>
              <LottieView
                source={require("../../../../assets/animations/empty.json")}
                autoPlay
                loop
                style={{ width: "100%", height: "100%" }}
              />
              <Text style={styles.emptyStateText}>Không có hóa đơn nào</Text>
            </View>
          )
        }
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("GhiDienNuoc", { maDayNt: selectedDayNhaTro, month: selectedMonth })}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}
const createStyles = (COLORS) => StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bgLight,
    paddingTop: StatusBar.currentHeight
  },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  headerTop:
  {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textMain
  },

  iconBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary + "20"
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },

  chipText: {
    color: COLORS.textMain
  },
  chipActive: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: COLORS.buttonBg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 8
  },
  chipTextActive: {
    color: COLORS.buttonText
  },

  filterRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10
  },

  filterBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.card,
    padding: 10,
    borderRadius: 12,
  },

  filterText: {
    color: COLORS.textMain,
    flex: 1
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16
  },

  summaryCardPrimary: {
    flex: 1,
    backgroundColor: COLORS.cardSelectedBg + "20",
    padding: 14,
    borderRadius: 14,
    borderColor: COLORS.border,
    borderWidth: 1
  },

  summaryCardWarn: {
    flex: 1,
    backgroundColor: "#f9731620",
    padding: 14,
    borderRadius: 14,
    borderColor: COLORS.border,
    borderWidth: 1
  },

  summaryLabel: {
    color: COLORS.textMain,
    fontSize: 11
  },

  summaryValuePrimary: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18
  },

  summaryValueWarn: {
    color: COLORS.danger,
    fontWeight: "bold",
    fontSize: 18
  },

  sectionTitle: {
    color: COLORS.textMain,
    paddingHorizontal: 16,
    marginBottom: 10
  },

  card: {
    backgroundColor: COLORS.card,
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderColor: COLORS.border,
    borderWidth: 1
  },

  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center"
  },

  roomBox: {
    width: 46,
    height: 46,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: "center",
    justifyContent: "center"
  },

  roomText: {
    color: PRIMARY,
    fontWeight: "bold",
    fontSize: 16
  },

  name: {
    color: COLORS.textMain,
    fontWeight: "bold"
  },

  contract: {
    color: COLORS.textMuted,
    fontSize: 12
  },

  badgePaid: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  badgePaidText: {
    color: "#10b981",
    fontSize: 10,
    fontWeight: "bold"
  },

  badgeUnpaid: {
    backgroundColor: "#f9731620",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  badgeUnpaidText: {
    color: "#f97316",
    fontSize: 10,
    fontWeight: "bold"
  },

  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  date: {
    color: COLORS.textMuted,
    fontSize: 12
  },

  desc: {
    color: COLORS.textMain,
    fontSize: 12
  },

  amount: {
    color: COLORS.primary,
    fontWeight: "bold",
    fontSize: 18
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center"
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: COLORS.card,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10
  },

  tab: {
    alignItems: "center"
  },

  tabText: {
    fontSize: 10,
    color: COLORS.textMuted
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.card,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  selectText: {
    color: COLORS.textMain
  },
  emptyStateText: {
    color: COLORS.textMuted,
  }
});
