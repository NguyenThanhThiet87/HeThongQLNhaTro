import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput
} from "react-native";

import { MaterialIcons, MaterialIcons as Icon } from "@expo/vector-icons";
import { getHopDongsApi } from "../../../api/HopDong";
import { getDayNhaTrosApi } from "../../../api/PhongTro";
import { getCurrentUser } from "../../../utils/decodeToken";
import { Dropdown } from "react-native-element-dropdown";
import { TRANG_THAI_HOP_DONG, getTenTrangThaiHopDong, DANH_SACH_TRANG_THAI_HOP_DONG, getColorTrangThaiHopDong } from "../../../constants/TRANG_THAI_HOP_DONG";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";
import ComboBox from "../../../components/ComboBox";
import { getMonthDiff } from "../../../utils/formatNgaySinh";
import { ActionConfirmModal } from "../../../components/ActionConfirmModal";

const GREEN = "#10b981";
const ORANGE = "#f59e0b";
const RED = "#ef4444";

export default function contractScreen() {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const [dayNhaTroSelected, setDayNhaTroSelected] = useState(null);
    const [dayNhaTroList, setDayNhaTroList] = useState([]);
    const [hopDongList, setHopDongList] = useState([]);
    const [selectedTrangThai, setSelectedTrangThai] = useState();
    const [searchText, setSearchText] = useState("");

    const filteredHopDongList = hopDongList.filter(item => {
        const searchLower = searchText.toLowerCase();
        const roomMatch = item.soPhong?.toLowerCase().includes(searchLower);
        const nameMatch = item.hopDongNguoiThues?.some(nt => nt.hoTenNguoiThue?.toLowerCase().includes(searchLower));
        return roomMatch || nameMatch;
    });

    const { width, height } = Dimensions.get("window");

    const fetchData = useCallback(async () => {
        const user = await getCurrentUser();
        if (user) {
            const resultDayNhaTro = await getDayNhaTrosApi(user.maNd);
            if (resultDayNhaTro.success) {
                setDayNhaTroList(resultDayNhaTro.data);

                // If no building selected, select the first one
                let currentDayNt = dayNhaTroSelected;
                if (!currentDayNt && resultDayNhaTro.data.length > 0) {
                    currentDayNt = resultDayNhaTro.data[0];
                    setDayNhaTroSelected(currentDayNt);
                }

                if (currentDayNt) {
                    const result = await getHopDongsApi(currentDayNt.maDayNt, selectedTrangThai ? selectedTrangThai : "");
                    if (result.success) {
                        setHopDongList(result.data);
                    }
                }
            }
        }
    }, [dayNhaTroSelected, selectedTrangThai]);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.title}>
                        Hợp đồng thuê
                    </Text>

                    <ComboBox
                        data={dayNhaTroList.map(item => ({ label: item.tenDayNt, value: item.maDayNt }))}
                        value={dayNhaTroSelected?.maDayNt}
                        placeholder="Chọn nhà trọ"
                        onChange={item => {
                            const selected = dayNhaTroList.find(day => day.maDayNt === item.value);
                            setDayNhaTroSelected(selected);
                        }}
                        textColor={COLORS.textMain}
                        placeholderColor={COLORS.textMuted}
                        itemTextColor={COLORS.textMain}
                        style={{ backgroundColor: COLORS.card }}
                        width={140}
                        height={35}
                    />

                </View>

                {/* SEARCH */}
                <View style={styles.searchBox}>

                    <MaterialIcons
                        name="search"
                        size={20}
                        color={COLORS.textMain}
                        style={{ marginRight: 8 }}
                    />

                    <TextInput
                        placeholder="Tìm số phòng (vd: 101), tên..."
                        placeholderTextColor={COLORS.textMuted}
                        style={styles.input}
                        value={searchText}
                        onChangeText={setSearchText}
                    />

                    <MaterialIcons
                        name="qr-code-scanner"
                        size={20}
                        color={COLORS.textMain}
                    />

                </View>


                {/* FILTER */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                >
                    <TouchableOpacity style={[styles.filter, selectedTrangThai == null ? styles.filterActive : null]} key={"all"} onPress={() => setSelectedTrangThai(null)}>
                        <Text style={[styles.filterText, selectedTrangThai == null ? styles.filterActiveText : null]}>Tất cả</Text>
                    </TouchableOpacity>
                    {
                        DANH_SACH_TRANG_THAI_HOP_DONG.map((item) => (
                            <TouchableOpacity style={[styles.filter, selectedTrangThai == item.value ? styles.filterActive : null]} key={item.value} onPress={() => setSelectedTrangThai(item.value)}>
                                <Text style={[styles.filterText, selectedTrangThai == item.value ? styles.filterActiveText : null]}>{item.label}</Text>
                            </TouchableOpacity>
                        ))
                    }

                </ScrollView>

            </View>

            {/* LIST */}
            <ScrollView
                contentContainerStyle={{ padding: 16, paddingBottom: 140 }}
            >
                {
                    filteredHopDongList.length != 0 ? (
                        filteredHopDongList.map(hopDong => (
                            <TouchableOpacity key={hopDong.maHopDong} style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate("ChiTietHopDong", { maHopDong: hopDong.maHopDong })}>
                                <View style={styles.cardTop}>
                                    <View style={styles.roomBoxBlue}>
                                        <Text style={styles.room}>{hopDong.soPhong}</Text>
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.name}>
                                            {hopDong.hopDongNguoiThues[0]?.hoTenNguoiThue}
                                        </Text>
                                    </View>

                                    <View style={styles.badgeGreen}>
                                        <Text style={[styles.badgeGreenText, { color: getColorTrangThaiHopDong(hopDong.maTrangThai) }]}>
                                            {hopDong.tenTrangThaiHopDong}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.cardBottom}>

                                    <View>
                                        <Text style={styles.label}>
                                            Ngày bắt đầu
                                        </Text>
                                        <Text style={styles.value}>
                                            {hopDong.ngayBdhl}
                                        </Text>
                                    </View>
                                    <View style={styles.progressContainer}>

                                        <View style={styles.progressBg}>
                                            <View style={styles.progressFill} />
                                        </View>

                                        <Text style={styles.progressText}>
                                            {getMonthDiff(hopDong?.ngayBdhl, hopDong?.ngayKthl)} tháng
                                        </Text>

                                    </View>

                                    <View style={{ alignItems: "flex-end" }}>
                                        <Text style={styles.label}>
                                            Ngày kết thúc
                                        </Text>
                                        <Text style={styles.value}>
                                            {hopDong.ngayKthl}
                                        </Text>
                                    </View>

                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ marginTop: 0, alignItems: "center", gap: 20 }}>
                            <LottieView
                                source={require("../../../../assets/animations/empty.json")}
                                autoPlay
                                loop
                                style={{ width: width * 0.6, height: height * 0.3 }}
                            />
                            <Text style={styles.emptyStateText}>Không có hợp đồng nào</Text>
                        </View>
                    )
                }
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("TaoHopDongB1")}>
                <MaterialIcons name="add" size={24} color="#fff" />
                <Text style={styles.fabText}>
                    Tạo hợp đồng
                </Text>
            </TouchableOpacity>
        </View>
    );
}



const createStyles = (COLORS) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },

    header: {
        paddingTop: 50,
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
        paddingBottom: 10,
    },
    title: {
        color: COLORS.textMain,
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },

    select: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        width: 130,
        marginBottom: 10,
        alignSelf: "flex-end"
    },
    selectText: {
        color: COLORS.primary,
        fontWeight: "bold",
        marginRight: 4
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 44
    },

    input: {
        flex: 1,
        color: COLORS.textMain
    },

    filterActive: {
        backgroundColor: COLORS.buttonBg,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8
    },

    filterActiveText: {
        color: COLORS.buttonText,
        fontWeight: "bold"
    },

    filter: {
        backgroundColor: COLORS.card,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        borderColor: COLORS.border,
        borderWidth: 1
    },

    filterText: {
        color: COLORS.textMain
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 10,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    cardTop: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },

    roomBoxBlue: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: COLORS.primaryLight,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    roomBoxOrange: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#5a3a1e",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    roomBoxGray: {
        width: 48,
        height: 48,
        borderRadius: 10,
        backgroundColor: "#334155",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10
    },

    khu: {
        fontSize: 10,
        color: "#94a3b8"
    },

    room: {
        color: COLORS.textMain,
        fontWeight: "bold"
    },

    name: {
        color: COLORS.textMain,
        fontWeight: "bold"
    },

    contract: {
        color: COLORS.textMain,
        fontSize: 12
    },

    badgeGreen: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(16,185,129,0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },

    badgeGreenText: {
        fontWeight: "bold",
        fontSize: 12
    },

    badgeOrange: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(245,158,11,0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },

    badgeOrangeText: {
        color: ORANGE,
        fontWeight: "bold",
        fontSize: 12
    },
    progressContainer: {
        flex: 1,
        alignItems: "center"
    },

    progressBg: {
        width: "80%",
        height: 4,
        backgroundColor: "rgba(19,200,236,0.2)",
        borderRadius: 10
    },

    progressFill: {
        width: "65%",
        height: 4,
        backgroundColor: COLORS.primary
    },

    progressText: {
        color: COLORS.primary,
        fontSize: 10,
        marginTop: 4
    },
    dotOrange: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: COLORS.primary,
        marginRight: 6
    },

    badgeRed: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(239,68,68,0.15)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8
    },

    badgeRedText: {
        color: RED,
        fontWeight: "bold",
        fontSize: 12
    },

    dotRed: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: RED,
        marginRight: 6
    },

    cardBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
        alignItems: "center"
    },

    label: {
        color: COLORS.textMain,
        fontSize: 12
    },

    value: {
        color: COLORS.textMain,
        fontWeight: "bold"
    },

    priceRow: {
        borderTopWidth: 1,
        borderColor: COLORS.border,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6
    },

    price: {
        color: COLORS.primary,
        fontWeight: "bold",
        fontSize: 16
    },

    priceUnit: {
        color: COLORS.textMain,
        fontSize: 12
    },

    fab: {
        position: "absolute",
        right: 16,
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30
    },

    fabText: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 6
    },

    nav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: COLORS.bgLight,
        borderTopWidth: 1,
        borderColor: COLORS.border,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    navItem: {
        alignItems: "center"
    },

    navText: {
        fontSize: 11,
        color: COLORS.textMain
    },
    emptyStateText: {
        color: COLORS.textMain,
    }
});
