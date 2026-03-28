import React, { useState, useEffect } from "react";
import { useTheme } from "../../../theme/useTheme";

import { useRoute } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { getLoaiPhongApi, taoDayNhaTroApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import { ActivityIndicator } from "react-native";
import AppHeader from "../../../components/AppHeader";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { formatCurrency } from "../../../utils/formatCurrency";

export default function TaoDayNhaTroB3Screen() {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const route = useRoute();

    // Lấy dataB2 từ route params (được gửi từ Bước 2)
    const { dataB2 } = route.params || {};
    // Giải nén luôn số lượng phòng từ dataB1
    const soLuongPhong = dataB2?.dataB1?.SlPhong || 0;

    // State quản lý danh sách
    const [roomTypes, setRoomTypes] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [loading, setLoading] = useState(false);

    // 1. GỌI API & TỰ ĐỘNG SINH DANH SÁCH PHÒNG
    useEffect(() => {
        const fetchLoaiPhongVaSinhPhong = async () => {
            try {
                const user = await getCurrentUser();
                const result = await getLoaiPhongApi(user.maNd);

                if (result.success && result.data.length > 0) {
                    // 1.1. Format lại danh sách loại phòng
                    const formattedData = result.data.map(item => ({
                        label: item.tenLoaiP || item.TenLoaiP,
                        value: item.maLoaiP || item.MaLoaiP,
                        price: item.giaChuan || item.GiaChuan,
                        labelName: item.tenLoaiP || item.TenLoaiP
                    }));
                    setRoomTypes(formattedData);

                    // 1.2. Sinh danh sách phòng tự động
                    const selectedMaLoaiP = dataB2?.MaLoaiP;
                    const selectedRoomType = formattedData.find(t => t.value === selectedMaLoaiP) || formattedData[0];

                    const initialRooms = Array.from({ length: soLuongPhong }).map((_, index) => ({
                        id: `room_${Date.now()}_${index}`,
                        name: `P.${101 + index}`,
                        price: selectedRoomType.price,
                        loaiPhong: selectedMaLoaiP,
                    }));
                    setRooms(initialRooms);

                } else {
                    console.log("Lỗi: Không lấy được loại phòng hoặc danh sách rỗng.");
                }
            } catch (error) {
                console.error("Lỗi khi gọi API loại phòng:", error);
            }
        };

        fetchLoaiPhongVaSinhPhong();
    }, []);

    // 2. Cập nhật giá trị phòng khi gõ phím
    const updateRoom = (id, field, value) => {
        setRooms(rooms.map(room => {
            if (room.id !== id) return room;

            let updatedRoom = { ...room, [field]: value };

            // Logic Format tiền tệ
            if (field === "price") {
                updatedRoom.price = value.replace(/[^0-9]/g, ""); // Bỏ ký tự không phải số
            }

            // Logic: Nếu đổi Loại phòng -> Tự động cập nhật Giá theo loại phòng đó
            if (field === "loaiPhong") {
                const selectedType = roomTypes.find(t => t.value === value);
                if (selectedType) {
                    updatedRoom.price = selectedType.price.toString(); // Cập nhật giá theo loại phòng đã chọn
                }
            }

            return updatedRoom;
        }));
    };

    // 3. Xóa & Thêm thủ công
    const deleteRoom = (id) => {
        setRooms(rooms.filter(room => room.id !== id));
    };

    const addManualRoom = () => {
        // Lấy đại loại phòng đầu tiên làm mặc định khi bấm dấu +
        const defaultType = roomTypes.length > 0 ? roomTypes[0] : null;

        const newRoom = {
            id: `room_${Date.now()}_${Math.random()}`,
            name: `P.${100 + rooms.length + 1}`,
            price: defaultType ? defaultType.price.toString() : "0",
            loaiPhong: defaultType ? defaultType.value : ""
        };
        setRooms([...rooms, newRoom]);
    };

    const handleHoanTatVaLuu = async () => {
        console.log("Dữ liệu chuẩn bị gửi lên API:", {
            dayNhaTroData: dataB2.dataB1,
            danhSachPhong: rooms
        });

        if (rooms.length === 0) {
            console.log("Lỗi", "Vui lòng thêm ít nhất 1 phòng trọ.");
            return;
        }

        setLoading(true);

        try {
            const danhSachPhongXuLy = rooms.map(room => {
                console.log("Xử lý phòng:", room);
                return {
                    SoPhong: room.name.toString(), // Đảm bảo luôn là chuỗi
                    GiaThucTe: parseFloat(room.price) || 0,     // Gửi dạng Decimal
                    MaLoaiP: room.loaiPhong,          // Đảm bảo là Int
                    MaTtphong: 1,
                    MaTtrPhong: 1
                };
            });

            // Gọi API
            const result = await taoDayNhaTroApi(dataB2.dataB1, danhSachPhongXuLy);

            if (result.success) {
                console.log("Thành công!", "Đã tạo dãy trọ và danh sách phòng thành công.");
                navigation.navigate("PropertyDetail"); //
            } else {
                console.error("Chi tiết lỗi từ Server:", result);
            }
        } catch (error) {
            console.log("Lỗi", "Có sự cố xảy ra: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Chi tiết dãy trọ</Text>
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
                {/* STEP PROGRESS */}
                <View style={styles.progressWrap}>
                    <View style={styles.progressTop}>
                        <Text style={styles.stepText}>Bước 3</Text>
                        <Text style={styles.stepCount}>3/3</Text>
                    </View>

                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: "100%" }]} />
                    </View>
                </View>

                {/* SECTION TITLE */}
                <View style={styles.sectionTitleRow}>
                    <Text style={styles.sectionTitle}>Danh sách phòng</Text>
                    <TouchableOpacity style={styles.editAllBtn}>
                        <MaterialIcons name="edit-note" size={16} color="#13c8ec" />
                        <Text style={styles.editAllText}>Đặt lại tên hàng loạt</Text>
                    </TouchableOpacity>
                </View>

                {/* ROOM LIST */}
                <View style={styles.roomList}>
                    {rooms.map((room, index) => (
                        <View key={room.id} style={styles.roomCard}>
                            {/* Phần thân Card */}
                            <View style={{ flex: 1 }}>
                                {/* Row 1: Tên phòng + Giá */}
                                <View style={styles.roomFormGrid}>
                                    {/* Số thứ tự tích hợp nhỏ */}
                                    <View style={styles.roomIndexMini}>
                                        <Text style={styles.roomIndexTextMini}>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </Text>
                                    </View>

                                    {/* Tên phòng */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Tên phòng</Text>
                                        <TextInput
                                            style={styles.input}
                                            value={room.name}
                                            onChangeText={(val) => updateRoom(room.id, "name", val)}
                                            placeholder="Tên phòng"
                                            placeholderTextColor="#64748b"
                                        />
                                    </View>

                                    {/* Giá thuê */}
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Giá thuê (VNĐ)</Text>
                                        <TextInput
                                            style={[styles.input, styles.priceInput]}
                                            value={formatCurrency(room.price)}
                                            onChangeText={(val) => updateRoom(room.id, "price", val)}
                                            keyboardType="numeric"
                                            placeholder="0"
                                            placeholderTextColor="#64748b"
                                        />
                                    </View>
                                </View>

                                {/* Row 2: LOẠI PHÒNG (Dropdown) */}
                                <View style={{ marginTop: 12 }}>
                                    <Text style={styles.inputLabel}>Loại phòng</Text>
                                    <Dropdown
                                        style={styles.dropdownSmall}
                                        selectedTextStyle={styles.selectedTextSmall}
                                        itemTextStyle={styles.itemTextSmall}
                                        containerStyle={styles.dropdownContainerSmall}
                                        activeColor={COLORS.inputBgDisabled} // Màu nền khi chọn item
                                        itemContainerStyle={{ backgroundColor: COLORS.inputBg }}
                                        data={roomTypes}
                                        maxHeight={200}
                                        labelField="label"
                                        valueField="value"
                                        value={room.loaiPhong}
                                        onChange={(item) => updateRoom(room.id, "loaiPhong", item.value)}
                                        renderRightIcon={() => (
                                            <MaterialIcons name="expand-more" size={18} color="#94a3b8" />
                                        )}
                                    />
                                </View>
                            </View>

                            {/* Nút Xóa nằm ngoài rìa */}
                            <TouchableOpacity
                                style={styles.deleteBtn}
                                onPress={() => deleteRoom(room.id)}
                            >
                                <MaterialIcons name="delete-outline" size={24} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>

                {/* BUTTON THÊM THỦ CÔNG */}
                <TouchableOpacity style={styles.addManualBtn} onPress={addManualRoom}>
                    <MaterialIcons name="add-circle-outline" size={20} color="#94a3b8" />
                    <Text style={styles.addManualText}>Thêm phòng thủ công</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* BOTTOM NAVIGATION */}
            <View style={styles.bottomNav}>
                {/* Button */}
                <TouchableOpacity style={[styles.continueBtn]} onPress={handleHoanTatVaLuu}>
                    <Text style={styles.continueText}>Hoàn tất và lưu</Text>
                </TouchableOpacity>
            </View>

            <LoadingOverlay visible={loading} />
        </View>
    );
}

// Bảng Style giữ nguyên như bản trước
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
    progressFill: { height: 8, backgroundColor: "#13c8ec", borderRadius: 100 },

    sectionTitleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: "600", color: COLORS.textMain },
    editAllBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
    editAllText: { fontSize: 12, fontWeight: "500", color: "#13c8ec" },

    roomList: { gap: 16 },
    roomCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    roomFormGrid: { flexDirection: "row", gap: 12, alignItems: "flex-end" },

    roomIndexMini: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: COLORS.cardSelectedBg,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6
    },
    roomIndexTextMini: { fontSize: 12, fontWeight: "700", color: COLORS.inputText },

    inputGroup: { flex: 1 },
    inputLabel: { fontSize: 11, fontWeight: "500", color: COLORS.inputText, marginBottom: 6 },
    input: {
        padding: 0,
        paddingVertical: 6,
        fontSize: 15,
        fontWeight: "600",
        color: COLORS.inputText,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border
    },
    priceInput: { color: "#13c8ec" },

    dropdownSmall: {
        height: 38,
        backgroundColor: COLORS.card,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: 12,
    },
    selectedTextSmall: { fontSize: 13, color: COLORS.inputText, fontWeight: "500" },
    itemTextSmall: { fontSize: 13, color: COLORS.inputText },
    dropdownContainerSmall: { backgroundColor: "#182b2f", borderColor: COLORS.border, borderRadius: 8 },

    deleteBtn: { padding: 8, marginLeft: 12 },

    addManualBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: "dashed",
        borderColor: COLORS.border,
        marginTop: 16,
    },
    addManualText: { fontSize: 14, fontWeight: "500", color: COLORS.inputText },

    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        gap: 16,
        padding: 16,
        backgroundColor: COLORS.card,
        borderTopWidth: 1,
        borderTopColor: COLORS.border
    },
    backButtonBottom: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: "center",
        justifyContent: "center"
    },
    backButtonText: { color: COLORS.buttonText, fontWeight: "600", fontSize: 14 },
    continueBtn: {
        flex: 2,
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },
    continueText: { fontWeight: "700", color: COLORS.buttonText, fontSize: 14 },
});