import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Pressable
} from "react-native";
import LottieView from 'lottie-react-native';

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTrosApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getHoaDonsApi, getThangNamHDApi } from "../../../api/HoaDon";
import { DANH_SACH_TRANG_THAI_HOA_DON } from "../../../constants/TRANG_THAI_HOA_DON";
import ComboBox from "../../../components/ComboBox";

import { formatCurrency } from "../../../utils/formatCurrency";
import { getTenTrangThaiHoaDonByValue } from "../../../constants/TRANG_THAI_HOA_DON";
import { formatDate } from "../../../utils/formatNgaySinh";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const BORDER = "rgba(19,200,236,0.12)";
const SURFACE = "#1a2e32";

export default function InvoiceScreen() {
  const navigation = useNavigation();
  const [dayNhaTroList, setDayNhaTroList] = useState([]);
  const [selectedDayNhaTro, setSelectedDayNhaTro] = useState(null);
  const [selectedTrangThai, setSelectedTrangThai] = useState("");
  const [monthFilterList, setMonthFilterList] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [hoaDons, setHoaDons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getCurrentUser();
      const response = await getDayNhaTrosApi(user.maNd);
      if (response.success) {
        setDayNhaTroList(response.data);
        if (response.data.length > 0) {
          setSelectedDayNhaTro(response.data[0].maDayNt); // Mặc định chọn dãy nhà trọ đầu tiên
        }
      } else
        console.error("Lỗi khi lấy danh sách ngày nhà trọ:", response.message);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchThangNam = async () => {
      if (selectedDayNhaTro) {
        const response = await getThangNamHDApi(selectedDayNhaTro);
        if (response.success) {
          setMonthFilterList(response.data.map(item => ({
            label: `${item.month.toString().padStart(2, "0")}/${item.year}`,
            value: `${item.year}-${item.month.toString().padStart(2, "0")}`
          })));
          if (response.data.length > 0) {
            setSelectedMonth(`${response.data[0].year}-${response.data[0].month.toString().padStart(2, "0")}`);
          }
        }
        else {
          console.log(response.message);
        }
      }
    };
    fetchThangNam();
  }, [selectedDayNhaTro]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDayNhaTro && selectedMonth) {
        console.log("Fetching hoa dons with params:", { selectedDayNhaTro, selectedMonth, selectedTrangThai });
        const [year, month] = selectedMonth.split("-");         // Tách month và year từ chuỗi selectedMonth
        const response = await getHoaDonsApi(selectedDayNhaTro, parseInt(month), parseInt(year), selectedTrangThai);

        if (response.success) {
          setHoaDons(response.data);
          console.log("Danh sách hóa đơn:", response.data);
        } else {
          console.error("Lỗi:", response.message);
        }
      }
    };
    fetchData();
  }, [selectedDayNhaTro, selectedMonth, selectedTrangThai]);

  return (
    <SafeAreaView style={styles.container}>
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
            textColor="#fff"
            placeholderColor="#aaa"
            itemTextColor="#010101"
            style={{ backgroundColor: "#1e1e28" }}
            width={140}
          />
          <ComboBox
            data={DANH_SACH_TRANG_THAI_HOA_DON}
            value={selectedTrangThai}
            onChange={item => setSelectedTrangThai(item.value)}
            textColor="#fff"
            placeholderColor="#aaa"
            itemTextColor="#010101"
            style={{ backgroundColor: "#1e1e28" }}
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
              45.200.000đ
            </Text>
          </View>

          <View style={styles.summaryCardWarn}>
            <Text style={styles.summaryLabel}>
              CHƯA THANH TOÁN
            </Text>
            <Text style={styles.summaryValueWarn}>
              12.850.000đ
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
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: BG
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: BORDER,
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
    color: "#fff"
  },

  iconBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: PRIMARY + "20"
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: SURFACE,
    borderWidth: 1,
    borderColor: PRIMARY + "30",
    marginRight: 8
  },

  chipText: {
    color: "#aaa"
  },
  chipActive: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: PRIMARY + "20",
    borderWidth: 1,
    borderColor: PRIMARY + "30",
    marginRight: 8
  },
  chipTextActive: {
    color: PRIMARY
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
    backgroundColor: SURFACE,
    padding: 10,
    borderRadius: 12,
  },

  filterText: {
    color: "#fff",
    flex: 1
  },

  summaryRow: {
    flexDirection: "row",
    gap: 12,
    padding: 16
  },

  summaryCardPrimary: {
    flex: 1,
    backgroundColor: PRIMARY + "20",
    padding: 14,
    borderRadius: 14
  },

  summaryCardWarn: {
    flex: 1,
    backgroundColor: "#f9731620",
    padding: 14,
    borderRadius: 14
  },

  summaryLabel: {
    color: "#888",
    fontSize: 11
  },

  summaryValuePrimary: {
    color: PRIMARY,
    fontWeight: "bold",
    fontSize: 18
  },

  summaryValueWarn: {
    color: "#f97316",
    fontWeight: "bold",
    fontSize: 18
  },

  sectionTitle: {
    color: "#888",
    paddingHorizontal: 16,
    marginBottom: 10
  },

  card: {
    backgroundColor: SURFACE,
    padding: 14,
    marginHorizontal: 16,
    borderRadius: 14,
    marginBottom: 12
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
    backgroundColor: PRIMARY + "30",
    alignItems: "center",
    justifyContent: "center"
  },

  roomText: {
    color: PRIMARY,
    fontWeight: "bold",
    fontSize: 16
  },

  name: {
    color: "#fff",
    fontWeight: "bold"
  },

  contract: {
    color: "#777",
    fontSize: 12
  },

  badgePaid: {
    backgroundColor: "#10b98120",
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
    color: "#aaa",
    fontSize: 12
  },

  desc: {
    color: "#666",
    fontSize: 12
  },

  amount: {
    color: PRIMARY,
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
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center"
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: BG,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10
  },

  tab: {
    alignItems: "center"
  },

  tabText: {
    fontSize: 10,
    color: "#777"
  },
  select: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0f1f23",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10
  },

  selectText: {
    color: "#fff"
  },
  emptyStateText: {
    color: "#777",
  }
});
