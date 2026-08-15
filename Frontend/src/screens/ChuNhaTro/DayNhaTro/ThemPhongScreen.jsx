import React, { useState, useEffect } from "react";
import { useTheme } from "../../../theme/useTheme";
import { useNavigation } from "@react-navigation/native";
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Dropdown } from "react-native-element-dropdown";
import { getLoaiPhongApi, taoPhongApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import AppHeader from "../../../components/AppHeader";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { formatCurrency } from "../../../utils/formatCurrency";
import toast from "../../../utils/toast";

export default function ThemPhongScreen({ route }) {
    const { maDayNt } = route.params || {};
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();

    // State
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [soPhong, setSoPhong] = useState("");
    const [loaiPhong, setLoaiPhong] = useState("");
    const [giaThue, setGiaThue] = useState("");

    // Error fields
    const [soPhongError, setSoPhongError] = useState("");
    const [loaiPhongError, setLoaiPhongError] = useState("");
    const [giaThueError, setGiaThueError] = useState("");
   

    // Lấy danh sách loại phòng
    useEffect(() => {
        const fetchLoaiPhong = async () => {
            try {
                const user = await getCurrentUser();
                const result = await getLoaiPhongApi(user.maNd);
                if (result.success && result.data.length > 0) {
                    const formattedData = result.data.map(item => ({
                        label: item.tenLoaiP || item.TenLoaiP,
                        value: item.maLoaiP || item.MaLoaiP,
                        price: item.giaChuan || item.GiaChuan
                    }));
                    setRoomTypes(formattedData);
                    if (formattedData.length > 0) {
                        setLoaiPhong(formattedData[0].value);
                    }
                }
            } catch (error) {
                toast.error("Lỗi lấy loại phòng");
            }
        };
        fetchLoaiPhong();
    }, []);

    // Khi chọn loại phòng, tự động cập nhật giá
    useEffect(() => {
        const selectedType = roomTypes.find(t => t.value === loaiPhong);
        if (selectedType) {
            setGiaThue(selectedType.price.toString());
        }
    }, [loaiPhong]);

    // Xử lý nhập giá
    const handleChangeGiaThue = (text) => {
        const numericText = text.replace(/[^0-9]/g, "");
        setGiaThue(numericText);
    };

    // Lưu phòng
    const handleSave = async () => {
        setLoading(true);
        // Validate
        let isValid = true;
        if (!soPhong.trim()) {
            setSoPhongError("Số phòng không được để trống");
            isValid = false;
        } else setSoPhongError("");

        if (!loaiPhong) {
            setLoaiPhongError("Chọn loại phòng");
            isValid = false;
        } else setLoaiPhongError("");

        if (!giaThue.trim() || isNaN(giaThue)) {
            setGiaThueError("Giá thuê phải là số");
            isValid = false;
        } else setGiaThueError("");

        if (!isValid) {
            setLoading(false);
            return;
        }

        try {
            const user = await getCurrentUser();
            const data = {
                MaDayNt: maDayNt,
                SoPhong: soPhong.trim(),
                MaLoaiP: loaiPhong,
                GiaThucTe: parseFloat(giaThue),
                MaTtphong: 1,
                MaTtrPhong: 1
            };
            const result = await taoPhongApi(data);
            if (result.success) {
                toast.success("Tạo phòng thành công!");
                navigation.goBack();
            } else {
                toast.error("Lỗi tạo phòng: " + result.message);
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Tạo phòng mới</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
                    {/* Số phòng */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Số phòng</Text>
                        <TextInput
                            style={styles.input}
                            value={soPhong}
                            onChangeText={setSoPhong}
                            placeholder="Nhập số phòng"
                            placeholderTextColor="#64748b"
                        />
                        {soPhongError ? <Text style={styles.errorText}>{soPhongError}</Text> : null}
                    </View>

                    {/* Loại phòng */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Loại phòng</Text>
                        <Dropdown
                            style={styles.dropdownSmall}
                            selectedTextStyle={styles.selectedTextSmall}
                            itemTextStyle={styles.itemTextSmall}
                            containerStyle={styles.dropdownContainerSmall}
                            data={roomTypes}
                            maxHeight={200}
                            labelField="label"
                            valueField="value"
                            value={loaiPhong}
                            onChange={item => setLoaiPhong(item.value)}
                            renderRightIcon={() => (
                                <MaterialIcons name="expand-more" size={18} color="#94a3b8" />
                            )}
                        />
                        {loaiPhongError ? <Text style={styles.errorText}>{loaiPhongError}</Text> : null}
                    </View>

                    {/* Giá thuê */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Giá thuê (VNĐ)</Text>
                        <TextInput
                            style={[styles.input, styles.priceInput]}
                            value={formatCurrency(giaThue)}
                            onChangeText={handleChangeGiaThue}
                            keyboardType="numeric"
                            placeholder="0"
                            placeholderTextColor="#64748b"
                        />
                        {giaThueError ? <Text style={styles.errorText}>{giaThueError}</Text> : null}
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* Nút lưu */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleSave}>
                    <Text style={styles.continueText}>Lưu phòng</Text>
                </TouchableOpacity>
            </View>
            <LoadingOverlay visible={loading} />
        </SafeAreaView>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.card },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },
    scroll: {
        paddingVertical: 16,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },
    inputGroup: { marginBottom: 20 },
    inputLabel: { fontSize: 13, fontWeight: "500", color: COLORS.inputText, marginBottom: 6 },
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
    dropdownContainerSmall: { backgroundColor: COLORS.card, borderColor: COLORS.border, borderRadius: 8 },
    errorText: { color: "#ef4444", fontSize: 12, marginTop: 2 },
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
    continueBtn: {
        flex: 1,
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