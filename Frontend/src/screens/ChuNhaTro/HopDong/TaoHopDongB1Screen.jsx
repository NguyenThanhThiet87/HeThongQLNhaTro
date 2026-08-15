import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Switch
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import { getDayNhaTrosApi, getPhongTrosApi } from "../../../api/PhongTro";

import { getCurrentUser } from "../../../utils/decodeToken";

import { Dropdown } from "react-native-element-dropdown";
import { formatCurrency } from "../../../utils/formatCurrency";
import toast from '../../../utils/toast';
import { validateGiaDien, validateGiaNuoc } from "../../../utils/formatGiaDienNuoc";
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatNgaySinh } from "../../../utils/formatNgaySinh";
import AppHeader from "../../../components/AppHeader";
import { TRANG_THAI_PHONG } from "../../../constants/TRANG_THAI_PHONG";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#1a2c30";
const BORDER = "rgba(255,255,255,0.05)";
const TEXT2 = "#94a3b8";

export default function TaoHopDongB1Screen({ route }) {
    const { maDayNt, maPhongParam } = route.params || {};

    if(maDayNt && dayNhaTro.length > 0 && dayNhaTro.some(dt => dt.maDayNt === maDayNt)) {
        setSelectedDayNhaTro(maDayNt);
    }

    if(maPhongParam && phongs && phongs.some(p => p.maPhong === maPhongParam)) { 
        console.log("Received maPhongParam:", maPhongParam);
        setSelectedPhong(maPhongParam);
    }

    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const [cycle, setCycle] = useState(1);

    const [phongs, setPhongs] = useState(null);
    const [dayNhaTro, setDayNhaTro] = useState([]);

    const [selectedDayNhaTro, setSelectedDayNhaTro] = useState(null);
    const [selectedPhong, setSelectedPhong] = useState(null);
    const [giaThue, setGiaThue] = useState("");
    const [tienDatCoc, settienDatCoc] = useState("");
    const [giaDien, setGiaDien] = useState("");
    const [giaNuoc, setGiaNuoc] = useState("");
    const today = new Date();
    const defaultngayBdhl = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1).toString().padStart(2, "0")}/${today.getFullYear()}`;
    const [ngayBdhl, setngayBdhl] = useState(defaultngayBdhl);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [thoiHan, setThoiHan] = useState("12"); // mặc định 1 năm

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            const result = await getDayNhaTrosApi(user.maNd);
            if (result.success) {
                setDayNhaTro(result.data);
                setSelectedDayNhaTro(result.data[0]?.maDayNt || null);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchPhongs = async () => {
            if (selectedDayNhaTro) {
                const result = await getPhongTrosApi(selectedDayNhaTro);
                console.log("Phòng:", result);
                if (result.success) {
                    setPhongs(result.data.filter(p => p.maTtphong == TRANG_THAI_PHONG.TRONG));
                    setGiaThue(result.data[0]?.giaThucTe?.toString() || "");
                    setSelectedPhong(result.data[0]?.maPhong || null);
                }
            }
        };
        fetchPhongs();
    }, [selectedDayNhaTro]);

    const onChangeDate = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const d = selectedDate;
            const formatted = `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`;
            setngayBdhl(formatted);
        }
    };

    const handleSelectPhong = (maPhong) => {
        setSelectedPhong(maPhong);
        const phong = phongs.find(p => p.maPhong === maPhong);
        if (phong) {
            setGiaThue(phong.giaThucTe?.toString() || "");
        }
    }

    const handleChangeText = (text, set) => {
        const numericText = text.replace(/[^0-9]/g, '');
        set(numericText);
    }

    const handleNext = () => {
        // Validate giá điện nước trước khi chuyển bước
        if (!selectedPhong) {
            toast.error("Vui lòng chọn phòng!");
            return;
        }
        if (!giaThue) {
            toast.error("Giá thuê không được để trống!");
            return;
        }
        if (!tienDatCoc) {
            toast.error("Tiền cọc không được để trống!");
            return;
        }

        if (!validateGiaDien(giaDien)) {
            toast.error("Giá điện phải từ 1.728đ đến 3.015đ/kWh theo quy định!");
            return;
        }
        if (!validateGiaNuoc(giaNuoc)) {
            toast.error("Giá nước phải từ 3.500đ đến 18.000đ/người theo quy định!");
            return;
        }

        const ngayKthl = new Date(new Date(ngayBdhl.split("/").reverse().join("-")).setMonth(new Date(ngayBdhl.split("/").reverse().join("-")).getMonth() + parseInt(thoiHan)));

        navigation.navigate("TaoHopDongB2", {
            dataB1: {
                maPhong: selectedPhong,
                giaThue,
                tienDatCoc,
                giaDien,
                giaNuoc,
                donViDien: "kWh",
                donViNuoc: "m3",
                ngayBdhl: formatNgaySinh(ngayBdhl),
                ngayKthl: formatNgaySinh(ngayKthl)
            }
        });
    }

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
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Tạo hợp đồng thuê</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* STEP PROGRESS (Giữ nguyên) */}
                <View style={styles.progressWrap}>
                    <View style={styles.progressTop}>
                        <Text style={styles.stepText}>Bước 1</Text>
                        <Text style={styles.stepCount}>1/2</Text>
                    </View>
                    <View style={styles.progressBg}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                {/* PHONG */}
                <Text style={styles.sectionLabel}>
                    1. THÔNG TIN PHÒNG
                </Text>

                <View style={styles.card}>

                    <View style={styles.rowGap}>
                        <Text style={styles.label}>Dãy trọ</Text>
                        <Dropdown
                            style={styles.select}
                            placeholderStyle={styles.selectText}
                            selectedTextStyle={styles.selectText}
                            data={dayNhaTro.map(dt => ({
                                label: dt.tenDayNt,
                                value: dt.maDayNt
                            }))}
                            labelField="label"
                            valueField="value"
                            placeholder="Chọn dãy trọ..."
                            value={selectedDayNhaTro}
                            onChange={item => setSelectedDayNhaTro(item.value)}
                            renderRightIcon={() => (
                                <MaterialIcons name="expand-more" size={20} color={TEXT2} />
                            )}
                        />
                    </View>

                    <View style={styles.rowGap}>
                        <Text style={styles.label}>Phòng</Text>
                        <Dropdown
                            style={styles.select}
                            placeholderStyle={styles.selectText}
                            selectedTextStyle={styles.selectText}
                            data={
                                phongs
                                    ? phongs.map(phong => ({
                                        label: phong.tenPhong || phong.soPhong || "Phòng",
                                        value: phong.maPhong
                                    }))
                                    : []
                            }
                            labelField="label"
                            valueField="value"
                            placeholder="Chọn phòng"
                            value={selectedPhong}
                            onChange={item => handleSelectPhong(item.value)}
                            renderRightIcon={() => (
                                <MaterialIcons name="expand-more" size={20} color={TEXT2} />
                            )}
                        />
                    </View>

                </View>

                {/* GIA */}
                <Text style={styles.sectionLabel}>
                    2. THIẾT LẬP GIÁ THUÊ
                </Text>

                <View style={styles.card}>


                    <Text style={styles.label}>
                        Giá thuê (VNĐ/tháng)
                    </Text>

                    <View style={styles.inputBox}>
                        <TextInput
                            editable={false}
                            style={styles.input}
                            value={formatCurrency(giaThue)}
                        />
                        <Text style={styles.unit}>VNĐ</Text>
                    </View>

                    <Text style={styles.label}>
                        Tiền đặt cọc
                    </Text>

                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            value={formatCurrency(tienDatCoc)}
                            onChangeText={(text) => handleChangeText(text, settienDatCoc)}
                        />
                        <Text style={styles.unit}>VNĐ</Text>
                    </View>


                    <Text style={styles.label}>
                        Chu kỳ thanh toán
                    </Text>

                    <View style={styles.row}>

                        {[1, 3, 6].map(v => (
                            <TouchableOpacity
                                key={v}
                                onPress={() => setCycle(v)}
                                style={[
                                    styles.cycleBtn,
                                    cycle === v && styles.cycleActive
                                ]}
                            >

                                <Text style={[
                                    styles.cycleText,
                                    cycle === v && styles.cycleTextActive
                                ]}>
                                    {v} Tháng
                                </Text>

                            </TouchableOpacity>
                        ))}

                    </View>
                </View>



                {/* DICH VU */}
                <View style={styles.rowBetween}>

                    <Text style={styles.sectionLabel}>
                        3. DỊCH VỤ & TIỆN ÍCH
                    </Text>

                    <Text style={styles.defaultBtn}>
                        Thiết lập mặc định
                    </Text>

                </View>



                <View style={styles.card}>


                    {/* DIEN */}
                    <View style={styles.service}>

                        <View style={styles.row}>

                            <View style={[styles.serviceIcon, { backgroundColor: "rgba(234,179,8,0.15)" }]}>
                                <MaterialIcons name="bolt" size={20} color="#eab308" />
                            </View>

                            <View>
                                <Text style={styles.serviceTitle}>Điện</Text>
                                <Text style={styles.serviceSub}>Tính theo số đồng hồ</Text>
                            </View>

                        </View>

                        <View style={styles.inputBox}>
                            <TextInput style={styles.input} value={formatCurrency(giaDien)} onChangeText={(text) => handleChangeText(text, setGiaDien)} />
                            <Text style={styles.unit}>đ/Kwh</Text>
                        </View>

                    </View>


                    {/* NUOC */}
                    <View style={styles.service}>

                        <View style={styles.row}>

                            <View style={[styles.serviceIcon, { backgroundColor: "rgba(59,130,246,0.15)" }]}>
                                <MaterialIcons name="water-drop" size={20} color="#3b82f6" />
                            </View>

                            <View>
                                <Text style={styles.serviceTitle}>Nước</Text>
                                <Text style={styles.serviceSub}>Tính theo số đồng hồ</Text>
                            </View>

                        </View>

                        <View style={styles.inputBox}>
                            <TextInput style={styles.input} value={formatCurrency(giaNuoc)} onChangeText={(text) => handleChangeText(text, setGiaNuoc)} />
                            <Text style={styles.unit}>đ/m3</Text>
                        </View>

                    </View>

                </View>

                <Text style={styles.sectionLabel}>
                    4. THÔNG TIN HỢP ĐỒNG
                </Text>

                <View style={styles.card}>
                    <Text style={styles.label}>
                        Ngày bắt đầu hiệu lực
                    </Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputBox}>
                        <MaterialIcons name="calendar-today" size={20} color="#94a3b8" />
                        <Text style={[styles.input, { paddingVertical: 12 }]}>
                            {ngayBdhl || "dd/mm/yyyy"}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={ngayBdhl ? new Date(ngayBdhl.split("/").reverse().join("-")) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            minimumDate={new Date()}
                        />
                    )}

                    <Text style={styles.label}>
                        Thời hạn hợp đồng
                    </Text>
                    <Dropdown
                        style={styles.select}
                        placeholderStyle={styles.selectText}
                        selectedTextStyle={styles.selectText}
                        data={[
                            { label: "1 năm", value: "12" },
                            { label: "2 năm", value: "24" },
                            { label: "3 năm", value: "36" }
                        ]}
                        labelField="label"
                        valueField="value"
                        placeholder="Chọn thời hạn hợp đồng"
                        value={thoiHan}
                        onChange={item => setThoiHan(item.value)}
                        renderRightIcon={() => (
                            <MaterialIcons name="expand-more" size={20} color={TEXT2} />
                        )}
                    />
                </View>

                {/* BUTTON */}
                <TouchableOpacity style={styles.nextBtn} onPress={() => handleNext()}>

                    <Text style={styles.nextText}>
                        Tiếp theo: Thông tin người thuê
                    </Text>

                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />

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
    progressFill: { width: "50%", height: 8, backgroundColor: "#13c8ec", borderRadius: 100 },

    sectionLabel: {
        color: COLORS.textMain,
        fontWeight: "bold",
        marginBottom: 8
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20
    },

    label: {
        color: COLORS.textMain,
        marginBottom: 6
    },

    select: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: COLORS.inputBgDisabled,
        padding: 12,
        borderRadius: 12,
        marginBottom: 10,
        borderColor: COLORS.border,
        borderWidth: 1
    },

    selectText: {
        color: COLORS.inputText
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.inputBgDisabled,
        borderRadius: 12,
        paddingHorizontal: 10,
        marginBottom: 12,
        borderColor: COLORS.border,
        borderWidth: 1
    },

    input: {
        flex: 1,
        color: COLORS.inputText,
        paddingVertical: 10
    },

    unit: {
        color: COLORS.textMain,
        fontSize: 12
    },

    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginBottom: 5
    },

    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    rowGap: {
        marginBottom: 10
    },

    cycleBtn: {
        flex: 1,
        padding: 10,
        borderRadius: 12,
        backgroundColor: COLORS.inputBgDisabled,
        alignItems: "center"
    },

    cycleActive: {
        backgroundColor: "rgba(19,200,236,0.2)"
    },

    cycleText: {
        color: "#94a3b8"
    },

    cycleTextActive: {
        color: PRIMARY,
        fontWeight: "bold"
    },

    infoBox: {
        flexDirection: "row",
        gap: 8,
        backgroundColor: "rgba(59,130,246,0.15)",
        padding: 10,
        borderRadius: 10
    },

    infoText: {
        color: "#93c5fd",
        fontSize: 12
    },

    service: {
        marginBottom: 16
    },

    serviceIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center"
    },

    serviceTitle: {
        color: COLORS.textMain,
        fontWeight: "bold"
    },

    serviceSub: {
        color: TEXT2,
        fontSize: 12
    },

    defaultBtn: {
        color: PRIMARY,
        fontWeight: "bold"
    },

    bottom: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: CARD,
        borderTopWidth: 1,
        borderColor: BORDER
    },

    nextBtn: {
        backgroundColor: PRIMARY,
        padding: 16,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },

    nextText: {
        color: "#fff",
        fontWeight: "bold"
    },

    iconBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    }
});
