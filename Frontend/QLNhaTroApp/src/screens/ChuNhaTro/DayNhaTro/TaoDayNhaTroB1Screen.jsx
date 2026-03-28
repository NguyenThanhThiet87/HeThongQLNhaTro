import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../../../theme/useTheme";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  Dimensions,
  SafeAreaView
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import AppHeader from "../../../components/AppHeader";
import toast from "../../../utils/toast";

// Nhớ import thư viện chọn ảnh
import * as ImagePicker from 'expo-image-picker';
import { getTinhThanhApi, getQuanHuyenApi, getPhuongXaApi } from "../../../api/DiaChi";

export default function TaoDayNhaTroB1() {
  const navigation = useNavigation();
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

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

  // --- STATE BẢN ĐỒ ---
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [region, setRegion] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const mapRef = useRef(null);

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

  const pickLocationFromMap = async () => {
    // Hiện modal bản đồ ngay lập tức để tránh cảm giác bị đơ
    setShowMap(true);

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      toast.error("Quyền truy cập vị trí bị từ chối");
      return;
    }

    try {
      // Lấy vị trí nhanh nhất có thể (Sử dụng LastKnownPosition trước)
      let lastLocation = await Location.getLastKnownPositionAsync({});
      if (lastLocation) {
        const newRegion = {
          latitude: lastLocation.coords.latitude,
          longitude: lastLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);

        if (!location) {
          setLocation({
            latitude: lastLocation.coords.latitude,
            longitude: lastLocation.coords.longitude,
          });
        }
      }

      // Cập nhật vị trí chính xác hơn (chạy ngầm)
      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const precisionRegion = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      setRegion(precisionRegion);
      mapRef.current?.animateToRegion(precisionRegion, 1000);

      if (!location) {
        setLocation({
          latitude: userLocation.coords.latitude,
          longitude: userLocation.coords.longitude,
        });
      }
    } catch (error) {
      console.log("Error getting location:", error);
    }
  };

  const handleMapPress = (e) => {
    setLocation(e.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    setShowMap(false);
    toast.success("Đã chọn vị trí");
  };

  const handleContinue = () => {
    // 1. Kiểm tra xem người dùng đã nhập đủ các trường bắt buộc chưa
    if (!tenDayTro || !selectedTinh || !selectedQuan || !selectedPhuong || !diaChiChiTiet || !soLuongPhong) {
      toast.error("Vui lòng nhập đầy đủ các trường có dấu (*) màu đỏ.");
      return;
    }

    if (!location) {
      toast.error("Vui lòng chọn vị trí nhà trọ trên bản đồ.");
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
      KinhDo: location?.longitude,
      ViDo: location?.latitude,
    };

    // 4. Chuyển sang màn hình Bước 2 và kèm theo cục dataB1 này
    navigation.navigate("TaoDayNhaTroB2", { dataB1: dataB1 });
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Tạo dãy nhà trọ</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

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

          <View style={styles.divider} />

          {/* CHỌN VỊ TRÍ TRÊN BẢN ĐỒ */}
          <Text style={styles.label}>
            Vị trí trên bản đồ <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TouchableOpacity
            style={[styles.locationBtn, location && { borderColor: COLORS.primary }]}
            onPress={pickLocationFromMap}
          >
            <MaterialIcons name="map" size={24} color={location ? COLORS.primary : "#94a3b8"} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.locationBtnText, location && { color: COLORS.primary }]}>
                {location ? "Đã xác định vị trí" : "Chọn vị trí trên bản đồ"}
              </Text>
              {location && (
                <Text style={styles.locationSubText}>
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </Text>
              )}
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* BẢN ĐỒ MODAL */}
        <Modal visible={showMap} animationType="slide" transparent={false}>
          <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMap(false)}>
                <MaterialIcons name="close" size={28} color={COLORS.textMain} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chọn vị trí nhà trọ</Text>
              <TouchableOpacity onPress={handleConfirmLocation}>
                <Text style={styles.confirmText}>Xong</Text>
              </TouchableOpacity>
            </View>

            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={{ flex: 1 }}
              initialRegion={region}
              onPress={handleMapPress}
            >
              {location && (
                <Marker coordinate={location} draggable onDragEnd={handleMapPress} title="Vị trí nhà trọ" />
              )}
            </MapView>

            <View style={styles.mapTip}>
              <MaterialIcons name="info" size={16} color="white" />
              <Text style={styles.mapTipText}>Chạm vào bản đồ hoặc kéo marker để chọn vị trí</Text>
            </View>
          </SafeAreaView>
        </Modal>

        {/* BUTTON */}
        <TouchableOpacity style={styles.continueBtn} onPress={() => handleContinue()} activeOpacity={0.8}>
          <Text style={styles.continueText}>Tiếp tục</Text>
          <MaterialIcons name="arrow-forward" size={20} color="#101f22" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  scroll: {
    paddingVertical: 16,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },

  progressWrap: { marginBottom: 24 },
  progressTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  stepText: { color: "#13c8ec", fontWeight: "600", fontSize: 14 },
  stepCount: { color: "#94a3b8", fontSize: 12 },
  progressBg: { height: 8, backgroundColor: COLORS.card, borderRadius: 100, borderColor: COLORS.border, borderWidth: 1 },
  progressFill: { width: "33%", height: 8, backgroundColor: "#13c8ec", borderRadius: 100 },
  label: { color: COLORS.textMain, fontSize: 14, marginBottom: 6, marginTop: 16 },
  inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.inputBg, borderRadius: 12, paddingHorizontal: 14, height: 50, borderColor: COLORS.border, borderWidth: 1 },
  input: { flex: 1, paddingVertical: 14, color: COLORS.inputText, fontSize: 15 },
  dropdown: { height: 50, backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 14 },
  placeholderStyle: { fontSize: 15, color: COLORS.inputText },
  selectedTextStyle: { fontSize: 15, color: COLORS.inputText },
  iconStyle: { width: 24, height: 24 },
  inputSearchStyle: { height: 40, fontSize: 14, color: COLORS.inputText, backgroundColor: COLORS.inputBg, borderColor: COLORS.border, borderRadius: 8 },
  dropdownContainer: { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, borderRadius: 8, marginTop: 8 },
  itemTextStyle: { color: COLORS.inputText, fontSize: 15 },
  checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 8 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
  checkboxActive: { backgroundColor: "#13c8ec", borderColor: "#13c8ec" },
  checkboxText: { color: COLORS.textMain, fontSize: 14 },
  continueBtn: { backgroundColor: "#13c8ec", marginTop: 24, paddingVertical: 16, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, shadowColor: "#13c8ec", shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 },
  continueText: { fontWeight: "700", color: "#101f22", fontSize: 16 },

  // ============================================
  // STYLES MỚI CHO PHẦN UPLOAD ẢNH
  // ============================================
  imagePickerContainer: {
    width: "100%",
    height: 180,
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.inputText,
    fontSize: 14,
    fontWeight: "500",
    marginTop: 8,
  },
  imagePlaceholderSub: {
    color: COLORS.textMuted,
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
  },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 20 },
  locationBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginTop: 8,
  },
  locationBtnText: { fontSize: 15, fontWeight: "600", color: "#64748b" },
  locationSubText: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textMain },
  confirmText: { fontSize: 16, fontWeight: "bold", color: "#13c8ec" },
  mapTip: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  mapTipText: { color: 'white', fontSize: 12, fontWeight: '500' },
});