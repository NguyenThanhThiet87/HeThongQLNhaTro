import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    KeyboardAvoidingView, 
    Platform             
} from "react-native";
import toast from "../../../utils/toast";

import { Dropdown } from "react-native-element-dropdown";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getLoaiPhongApi, taoLoaiPhongApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import AppHeader from "../../../components/AppHeader";
import { formatCurrency } from "../../../utils/formatCurrency";
import LoadingOverlay from "../../../components/LoadingOverlay";

export default function TaoDayNhaTroB2Screen() {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(false);

    const dataB1 = route.params?.dataB1;

    // 1. Dữ liệu Loại phòng
    const [roomTypes, setRoomTypes] = useState([]);
    useEffect(() => {

        const fetchLoaiPhong = async () => {
            try {
                const user = await getCurrentUser();
                const result = await getLoaiPhongApi(user.maNd);

                if (result.success) {
                    const formattedData = result.data.map(item => ({
                        label: item.tenLoaiP,
                        value: item.maLoaiP,
                        price: item.giaChuan,
                        labelName: item.tenLoaiP
                    }));
                    setRoomTypes(formattedData);
                    console.log("Danh sách loại phòng đã lấy về:", result.data);
                } else {
                    console.log("Lỗi lấy loại phòng:", result.message);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API loại phòng:", error);
            }
        };

        fetchLoaiPhong();
    }, []);

    // 2. State quản lý Form chính
    const [selectedRoomType, setSelectedRoomType] = useState("");
    const currentPrice = roomTypes.find(type => type.value === selectedRoomType)?.price || 0;
    const currentLabel = roomTypes.find(type => type.value === selectedRoomType)?.labelName || "";

    // 3. State quản lý Modal
    const [modalVisible, setModalVisible] = useState(false);
    const [newTypeTen, setNewTypeTen] = useState("");
    const [newTypeGia, setNewTypeGia] = useState("");
    const [newTypeSoNguoi, setNewTypeSoNguoi] = useState("");
    const [newTypeMoTa, setNewTypeMoTa] = useState("");

    const handleSaveNewRoomType = async () => {
        setLoading(true);

        if (!newTypeTen || !newTypeGia || !newTypeSoNguoi) {
            toast.error("Vui lòng nhập đầy đủ thông tin cơ bản!");
            return;
        }

        const numericPrice = parseInt(newTypeGia.replace(/[^0-9]/g, ''), 10);

        const user = await getCurrentUser();

        const newRoomTypeData = {
            MaChuNt: user.maNd,
            TenLoaiP: newTypeTen,
            SnguoiToiDa: parseInt(newTypeSoNguoi, 10),
            GiaChuan: numericPrice, // Đổi GiaChuan thành GiaMacDinh theo API C# tui dặn trước đó
            MoTa: newTypeMoTa,
        };

        try {
            const response = await taoLoaiPhongApi(newRoomTypeData);

            console.log("Response from taoLoaiPhongApi:", response);

            if (response.success) {
                const newMaLoaiP = response.data.maLoaiP; 

                const newType = {
                    label: `${newTypeTen} (${newTypeSoNguoi} người)`,
                    value: newMaLoaiP, 
                    price: numericPrice,
                    labelName: newTypeTen,
                };

                setRoomTypes([...roomTypes, newType]);
                setSelectedRoomType(newMaLoaiP);

                setNewTypeTen("");
                setNewTypeGia("");
                setNewTypeSoNguoi("");
                setNewTypeMoTa("");
                setModalVisible(false);

                toast.success("Đã thêm loại phòng mới!");
                
            } else {
                toast.error("Không thể tạo loại phòng: " + response.message);
            }
        } catch (error) {
            toast.error("Lỗi mạng", "Không thể kết nối đến máy chủ.");
            console.error(error);
        }
        setLoading(false);
    };

    const handleContinue = () => {
        console.log("Loại phòng đã chọn:", selectedRoomType);
        if (!selectedRoomType) {
            toast.error("Thiếu thông tin", "Vui lòng chọn loại phòng mặc định.");
            return;
        }

        const dataB2 = {
            dataB1: dataB1, 
            MaLoaiP: selectedRoomType, 
        };

        navigation.navigate("TaoDayNhaTroB3", { dataB2: dataB2 });
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
                <View style={styles.progressWrap}>
                    <View style={styles.progressTop}>
                        <Text style={styles.stepText}>Bước 2</Text>
                        <Text style={styles.stepCount}>2/3</Text>
                    </View>
                    <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: "66%" }]} />
                    </View>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.mainTitle}>Thiết lập mặc định cho tất cả phòng</Text>
                    <Text style={styles.subTitle}>
                        Các thông tin này sẽ được áp dụng tự động khi tạo phòng mới. Bạn có thể chỉnh sửa từng phòng sau.
                    </Text>
                </View>

                {/* LOẠI PHÒNG CARD */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="category" size={20} color="#13c8ec" />
                        <Text style={styles.cardTitle}>Loại phòng</Text>
                    </View>

                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        itemTextStyle={styles.itemTextStyle}
                        containerStyle={styles.dropdownContainer}
                        activeColor= {COLORS.primaryLight}
                        itemContainerStyle={{ backgroundColor: COLORS.card }}
                        data={roomTypes}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Chọn loại phòng"
                        value={selectedRoomType}
                        onChange={(item) => setSelectedRoomType(item.value)}
                        renderRightIcon={() => (
                            <MaterialIcons name="expand-more" size={22} color="#94a3b8" />
                        )}
                    />

                    <TouchableOpacity style={styles.addTypeBtn} onPress={() => setModalVisible(true)}>
                        <MaterialIcons name="add" size={16} color="#13c8ec" />
                        <Text style={styles.addTypeText}>Thêm loại phòng mới</Text>
                    </TouchableOpacity>
                </View>

                {/* GIÁ THUÊ CARD */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialIcons name="payments" size={20} color="#13c8ec" />
                        <Text style={styles.cardTitle}>Giá thuê tiêu chuẩn</Text>
                    </View>

                    <Text style={styles.inputLabel}>Giá thuê (VND/Tháng)</Text>

                    <View style={[styles.inputWrap, { backgroundColor: COLORS.inputBg, borderColor: COLORS.border, height: 52 }]}>
                        <Text style={[styles.input, { color: "#13c8ec", fontWeight: "700", paddingVertical: 0 }]}>
                            {formatCurrency(currentPrice)}
                        </Text>
                        <View style={styles.currencyBadge}>
                            <Text style={styles.currencyText}>đ</Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <MaterialIcons name="info" size={14} color="#64748b" />
                        <Text style={styles.infoText}>
                            Giá này được lấy mặc định từ loại phòng '{currentLabel}'.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* BOTTOM BUTTONS */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.continueBtn} onPress={() => handleContinue()}>
                    <Text style={styles.continueText}>Tiếp tục</Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#101f22" />
                </TouchableOpacity>
            </View>

            {/* ========================================================= */}
            {/* MODAL THÊM LOẠI PHÒNG (ĐÃ FIX BÀN PHÍM BẰNG KEYBOARD AVOIDING VIEW) */}
            {/* ========================================================= */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    {/* Bọc KeyboardAvoidingView để đẩy modal lên khi gõ bàn phím */}
                    <KeyboardAvoidingView 
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{ width: "100%", alignItems: "center" }}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Thêm Loại Phòng Mới</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                                    <MaterialIcons name="close" size={24} color="#94a3b8" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.modalLabel}>Tên loại phòng <Text style={{ color: "red" }}>*</Text></Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="VD: Phòng có gác lửng..."
                                placeholderTextColor="#64748b"
                                value={newTypeTen}
                                onChangeText={setNewTypeTen}
                            />

                            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalLabel}>Giá chuẩn (VNĐ) <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="0"
                                        placeholderTextColor="#64748b"
                                        keyboardType="numeric"
                                        value={formatCurrency(newTypeGia)}
                                        onChangeText={setNewTypeGia}
                                    />
                                </View>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.modalLabel}>Người tối đa <Text style={{ color: "red" }}>*</Text></Text>
                                    <TextInput
                                        style={styles.modalInput}
                                        placeholder="1-5"
                                        placeholderTextColor="#64748b"
                                        keyboardType="numeric"
                                        value={newTypeSoNguoi}
                                        onChangeText={setNewTypeSoNguoi}
                                    />
                                </View>
                            </View>

                            <Text style={[styles.modalLabel, { marginTop: 16 }]}>Mô tả chi tiết</Text>
                            <TextInput
                                style={[styles.modalInput, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                                placeholder="Mô tả tiện ích, diện tích..."
                                placeholderTextColor="#64748b"
                                multiline={true}
                                value={newTypeMoTa}
                                onChangeText={setNewTypeMoTa}
                            />

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.modalCancelText}>Hủy bỏ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveNewRoomType}>
                                    <Text style={styles.modalSaveText}>Lưu loại phòng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
            <LoadingOverlay visible={loading} />
        </View>
    );
}

// Giữ nguyên toàn bộ StyleSheet bên dưới của bạn
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
    titleSection: { marginBottom: 24 },
    mainTitle: { fontSize: 20, fontWeight: "700", color: COLORS.textMain, marginBottom: 8 },
    subTitle: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
    card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.border },
    cardHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
    cardTitle: { fontSize: 16, fontWeight: "600", color: COLORS.textMain },

    dropdown: { height: 52, backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 16 },
    placeholderStyle: { fontSize: 15, color: COLORS.textMuted },
    selectedTextStyle: { fontSize: 15, color: COLORS.textMain },
    dropdownContainer: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 12, marginTop: 8 },
    itemTextStyle: { color: COLORS.textMain, fontSize: 15 },
    addTypeBtn: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginTop: 12, padding: 4 },
    addTypeText: { color: "#13c8ec", fontSize: 14, fontWeight: "500", marginLeft: 4 },

    inputLabel: { fontSize: 12, fontWeight: "500", color: COLORS.textMuted, marginBottom: 6, marginLeft: 4 },
    inputWrap: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.inputBg, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, overflow: "hidden" },
    input: { flex: 1, paddingVertical: 0, paddingHorizontal: 16, color: COLORS.textMain, fontSize: 18, fontWeight: "500" },
    currencyBadge: { backgroundColor: COLORS.inputBg, paddingHorizontal: 16, height: "100%", justifyContent: "center", borderLeftWidth: 1, borderLeftColor: COLORS.border },
    currencyText: { color: COLORS.textMuted, fontWeight: "500", fontSize: 16 },
    infoRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    infoText: { fontSize: 12, color: COLORS.textMuted, marginLeft: 4 },

    bottomNav: {
        position: "absolute", bottom: 0, left: 0,
        right: 0, flexDirection: "row", gap: 16, padding: 16, backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border
    },
    backButtonBottom: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, alignItems: "center", justifyContent: "center" },
    backButtonText: { color: COLORS.textMuted, fontWeight: "600", fontSize: 15 },
    continueBtn: { flex: 2, backgroundColor: "#13c8ec", paddingVertical: 14, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
    continueText: { fontWeight: "700", color: "#101f22", fontSize: 16 },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        width: "100%",
        backgroundColor: COLORS.card,
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        shadowColor: "#000",
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: 12,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: COLORS.textMain,
    },
    modalLabel: {
        fontSize: 13,
        color: COLORS.textMuted,
        marginBottom: 6,
        marginLeft: 2,
    },
    modalInput: {
        backgroundColor: COLORS.inputBg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 10,
        color: COLORS.textMain,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 24,
    },
    modalCancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: "transparent",
    },
    modalCancelText: {
        color: COLORS.textMuted,
        fontWeight: "600",
        fontSize: 15,
    },
    modalSaveBtn: {
        backgroundColor: "#13c8ec",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        shadowColor: "#13c8ec",
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    modalSaveText: {
        color: "#101f22",
        fontWeight: "700",
        fontSize: 15,
    },
});