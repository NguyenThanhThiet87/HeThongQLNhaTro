import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image, // <-- Nhớ import thêm Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
// Nhớ import thư viện chọn ảnh
import * as ImagePicker from 'expo-image-picker';
import { getTinhThanhApi, getQuanHuyenApi, getPhuongXaApi } from "../../../api/DiaChi";

export default function TaoDayNhaTroB1() {
  const navigation = useNavigation();

  // --- STATE TỪ API ĐỊA CHỈ ---
  const [tinhThanhData, setTinhThanhData] = useState([]);
  const [quanHuyenData, setQuanHuyenData] = useState([]);
  const [phuongXaData, setPhuongXaData] = useState([]);

  // --- STATE LƯU DỮ LIỆU NGƯỜI DÙNG NHẬP ---
  const [tenDayTro, setTenDayTro] = useState("");
  const [soLuongPhong, setSoLuongPhong] = useState("");
  const [diaChiChiTiet, setDiaChiChiTiet] = useState("");

  const [selectedTinh, setSelectedTinh] = useState(null);
  const [selectedQuan, setSelectedQuan] = useState(null);
  const [selectedPhuong, setSelectedPhuong] = useState(null);

  const [active, setActive] = useState(true);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    const loadTinhThanh = async () => {
      const data = await getTinhThanhApi();
      setTinhThanhData(data);
    };
    loadTinhThanh();
  }, []);

  const handleSelectTinh = async (tinhCode) => {
    setSelectedTinh(tinhCode);
    setSelectedQuan(null);
    setSelectedPhuong(null);
    setQuanHuyenData([]);
    setPhuongXaData([]);
    const data = await getQuanHuyenApi(tinhCode);
    setQuanHuyenData(data);
  };

  const handleSelectQuan = async (quanCode) => {
    setSelectedQuan(quanCode);
    setSelectedPhuong(null);
    setPhuongXaData([]);
    const data = await getPhuongXaApi(quanCode);
    setPhuongXaData(data);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh để tải ảnh lên!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    // 1. Kiểm tra xem người dùng đã nhập đủ các trường bắt buộc chưa
    if (!tenDayTro || !selectedTinh || !selectedQuan || !selectedPhuong || !diaChiChiTiet || !soLuongPhong) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ các trường có dấu (*) màu đỏ.");
      return;
    }

    // 2. Lấy tên Tỉnh/Quận/Phường từ ID để ghép thành chuỗi địa chỉ hoàn chỉnh gửi cho API
    const tinhLabel = tinhThanhData.find(t => t.value === selectedTinh)?.label || "";
    const quanLabel = quanHuyenData.find(q => q.value === selectedQuan)?.label || "";
    const phuongLabel = phuongXaData.find(p => p.value === selectedPhuong)?.label || "";

    const diaChiHoanChinh = `${diaChiChiTiet}, ${phuongLabel}, ${quanLabel}, ${tinhLabel}`;

    // 3. Đóng gói toàn bộ dữ liệu Bước 1 vào 1 object
    const dataB1 = {
      TenDayNt: tenDayTro,
      DiaChi: diaChiHoanChinh,
      SlPhong: parseInt(soLuongPhong) || 0, // Ép kiểu về số nguyên
      TrangThaiHd: active,
      ImageUri: imageUri, // Lưu uri ảnh để truyền tới bước cuối cùng up file
    };

    // 4. Chuyển sang màn hình Bước 2 và kèm theo cục dataB1 này
    navigation.navigate("TaoDayNhaTroB2", { dataB1: dataB1 });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm Dãy Trọ Mới</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP PROGRESS (Giữ nguyên) */}
        <View style={styles.progressWrap}>
          <View style={styles.progressTop}>
            <Text style={styles.stepText}>Bước 1</Text>
            <Text style={styles.stepCount}>1/3</Text>
          </View>
          <View style={styles.progressBg}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* FORM */}
        <View style={styles.form}>

          {/* TÊN DÃY TRỌ */}
          <Text style={styles.label}>
            Tên dãy trọ <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Ví dụ: Dãy A - Lầu 1"
              placeholderTextColor="#64748b"
              style={styles.input}
              onChangeText={setTenDayTro}
            />
            <MaterialIcons name="edit" size={20} color="#94a3b8" />
          </View>

          {/* ẢNH BÌA DÃY TRỌ (PHẦN THÊM MỚI) */}
          <Text style={styles.label}>Ảnh bìa dãy trọ</Text>
          <TouchableOpacity style={styles.imagePickerContainer} onPress={pickImage} activeOpacity={0.8}>
            {imageUri ? (
              // Nếu đã chọn ảnh -> Hiện ảnh
              <View style={styles.imageWrapper}>
                <Image source={{ uri: imageUri }} style={styles.coverImage} />
                <View style={styles.changeImageOverlay}>
                  <MaterialIcons name="cameraswitch" size={20} color="#fff" />
                  <Text style={styles.changeImageText}>Đổi ảnh khác</Text>
                </View>
              </View>
            ) : (
              // Nếu chưa chọn ảnh -> Hiện khung đứt nét
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="add-photo-alternate" size={32} color="#94a3b8" />
                <Text style={styles.imagePlaceholderText}>Nhấn để tải ảnh lên</Text>
                <Text style={styles.imagePlaceholderSub}>Khuyến nghị ảnh ngang (16:9)</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* TỈNH / THÀNH PHỐ */}
          <Text style={styles.label}>
            Tỉnh / Thành phố <Text style={{ color: "red" }}>*</Text>
          </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemTextStyle}
            activeColor="#1f3a40"
            autoScroll={false}
            data={tinhThanhData}
            search
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Chọn Tỉnh / Thành phố"
            searchPlaceholder="Tìm kiếm..."
            value={selectedTinh}
            onChange={(item) => handleSelectTinh(item.value)}
            renderRightIcon={() => (
              <MaterialIcons name="expand-more" size={22} color="#94a3b8" />
            )}
          />

          {/* QUẬN + PHƯỜNG (2 CỘT) */}
          <View style={{ flexDirection: "row", gap: 16, marginTop: 10 }}>
            {/* QUẬN */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Quận / Huyện <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.itemTextStyle}
                activeColor="#1f3a40"
                autoScroll={false}
                data={quanHuyenData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn Quận"
                searchPlaceholder="Tìm kiếm..."
                value={selectedQuan}
                onChange={(item) => handleSelectQuan(item.value)}
                renderRightIcon={() => (
                  <MaterialIcons name="expand-more" size={22} color="#94a3b8" />
                )}
              />
            </View>

            {/* PHƯỜNG */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>
                Phường / Xã <Text style={{ color: "red" }}>*</Text>
              </Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.dropdownContainer}
                itemTextStyle={styles.itemTextStyle}
                activeColor="#1f3a40"
                autoScroll={false}
                data={phuongXaData}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Chọn Phường"
                searchPlaceholder="Tìm kiếm..."
                value={selectedPhuong}
                onChange={(item) => setSelectedPhuong(item.value)}
                renderRightIcon={() => (
                  <MaterialIcons name="expand-more" size={22} color="#94a3b8" />
                )}
              />
            </View>
          </View>

          {/* ĐỊA CHỈ CHI TIẾT */}
          <Text style={[styles.label, { marginTop: 16 }]}>
            Địa chỉ chi tiết <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="Số nhà, tên đường..."
              placeholderTextColor="#64748b"
              style={styles.input}
              onChangeText={setDiaChiChiTiet}
            />
            <MaterialIcons name="home" size={20} color="#94a3b8" />
          </View>

          {/* SỐ LƯỢNG PHÒNG */}
          <Text style={styles.label}>
            Số lượng phòng <Text style={{ color: "red" }}>*</Text>
          </Text>
          <View style={styles.inputWrap}>
            <TextInput
              placeholder="0"
              placeholderTextColor="#64748b"
              keyboardType="numeric"
              style={styles.input}
              onChangeText={setSoLuongPhong}
            />
            <MaterialIcons name="meeting-room" size={20} color="#94a3b8" />
          </View>

          {/* CHECKBOX */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setActive(!active)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, active && styles.checkboxActive]}>
              {active && <MaterialIcons name="check" size={16} color="#101f22" />}
            </View>
            <Text style={styles.checkboxText}>Đang hoạt động</Text>
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.continueBtn} onPress={() => handleContinue()} activeOpacity={0.8}>
          <Text style={styles.continueText}>Tiếp tục</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#101f22" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... Các style cũ giữ nguyên ...
  container: { flex: 1, backgroundColor: "#101f22", paddingTop: 50, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#fff" },
  progressWrap: { marginBottom: 24 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  stepText: { color: "#13c8ec", fontWeight: "600", fontSize: 14 },
  stepCount: { color: "#94a3b8", fontSize: 12 },
  progressBg: { height: 8, backgroundColor: "#182b2f", borderRadius: 100 },
  progressFill: { width: "33%", height: 8, backgroundColor: "#13c8ec", borderRadius: 100 },
  label: { color: "#cbd5e1", fontSize: 14, marginBottom: 6, marginTop: 16 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#142529", borderRadius: 12, paddingHorizontal: 14, height: 50 },
  input: { flex: 1, paddingVertical: 14, color: "#fff", fontSize: 15 },
  dropdown: { height: 50, backgroundColor: "#142529", borderRadius: 12, borderWidth: 1, borderColor: "#1f3a40", paddingHorizontal: 14 },
  placeholderStyle: { fontSize: 15, color: "#64748b" },
  selectedTextStyle: { fontSize: 15, color: "#ffffff" },
  iconStyle: { width: 24, height: 24 },
  inputSearchStyle: { height: 40, fontSize: 14, color: "#fff", backgroundColor: "#101f22", borderColor: "#1f3a40", borderRadius: 8 },
  dropdownContainer: { backgroundColor: "#142529", borderColor: "#1f3a40", borderRadius: 8, marginTop: 8 },
  itemTextStyle: { color: "#fff", fontSize: 15 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: "#64748b", justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#13c8ec", borderColor: "#13c8ec" },
  checkboxText: { color: "#cbd5e1" },
  continueBtn: { backgroundColor: "#13c8ec", marginTop: 24, paddingVertical: 16, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, shadowColor: "#13c8ec", shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  continueText: { fontWeight: "700", color: "#101f22", fontSize: 16 },

  // ============================================
  // STYLES MỚI CHO PHẦN UPLOAD ẢNH
  // ============================================
  imagePickerContainer: {
    width: "100%",
    height: 180,
    backgroundColor: "#142529",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1f3a40",
    borderStyle: "dashed", // Viền đứt nét nhìn cho ra dáng khu vực upload
    overflow: "hidden",
    marginTop: 4,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholderText: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  imagePlaceholderSub: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover", // Phủ kín khung
  },
  changeImageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(16, 31, 34, 0.7)", // Lớp mờ màu Dark Mode ở dưới đáy ảnh
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    gap: 6,
  },
  changeImageText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  }
});