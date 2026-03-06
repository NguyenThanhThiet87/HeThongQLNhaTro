import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
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

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#1a2c30";
const BORDER = "rgba(19,200,236,0.12)";
const TEXT2 = "#94a3b8";

const GREEN = "#10b981";
const ORANGE = "#f59e0b";
const RED = "#ef4444";

export default function contractScreen() {
    const navigation = useNavigation();
    const [dayNhaTroSelected, setDayNhaTroSelected] = useState(null);
    const [dayNhaTroList, setDayNhaTroList] = useState([]);
    const [hopDongList, setHopDongList] = useState([]);
    const [selectedTrangThai, setSelectedTrangThai] = useState();

    const { width, height } = Dimensions.get("window");

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            const resultDayNhaTro = await getDayNhaTrosApi(user.maNd);
            if (resultDayNhaTro.success) {
                setDayNhaTroList(resultDayNhaTro.data);
                setDayNhaTroSelected(resultDayNhaTro.data[0]); // Mặc định chọn dãy đầu tiên
            } else {
                console.error("Lỗi khi lấy dãy nhà trọ:", resultDayNhaTro.message);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (dayNhaTroSelected) {
            const fetchHopDong = async () => {
                console.log("Fetching hợp đồng for dãy nhà trọ:", dayNhaTroSelected.maDayNt, "with trạng thái:", selectedTrangThai);
                const result = await getHopDongsApi(dayNhaTroSelected.maDayNt, selectedTrangThai ? selectedTrangThai : "");
                if (result.success) {
                    setHopDongList(result.data);
                    console.log("Hợp đồng theo dãy nhà trọ:", result.data);
                } else {
                    console.error("Lỗi khi lấy hợp đồng:", result.message);
                }
            };
            fetchHopDong();
        }
    }, [dayNhaTroSelected, selectedTrangThai]);

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
                        textColor="#fff"
                        placeholderColor="#aaa"
                        itemTextColor="#010101"
                        style={{ backgroundColor: "#1e1e28" }}
                        width={140}
                        height={35}
                    />

                </View>

                {/* SEARCH */}
                <View style={styles.searchBox}>

                    <MaterialIcons
                        name="search"
                        size={20}
                        color={TEXT2}
                        style={{ marginRight: 8 }}
                    />

                    <TextInput
                        placeholder="Tìm số phòng (vd: 101), tên..."
                        placeholderTextColor={TEXT2}
                        style={styles.input}
                    />

                    <MaterialIcons
                        name="qr-code-scanner"
                        size={20}
                        color={TEXT2}
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
                    hopDongList.length != 0 ? (
                        hopDongList.map(hopDong => (
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
        paddingBottom: 10,
    },
    title: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10
    },

    select: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(19,200,236,0.1)",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        width: 130,
        marginBottom: 10,
        alignSelf: "flex-end"
    },
    selectText: {
        color: PRIMARY,
        fontWeight: "bold",
        marginRight: 4
    },
    searchBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: CARD,
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 44
    },

    input: {
        flex: 1,
        color: "#fff"
    },

    filterActive: {
        backgroundColor: PRIMARY,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8
    },

    filterActiveText: {
        color: "#fff",
        fontWeight: "bold"
    },

    filter: {
        backgroundColor: CARD,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8
    },

    filterText: {
        color: TEXT2
    },

    card: {
        backgroundColor: CARD,
        padding: 10,
        borderRadius: 12,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: BORDER
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
        backgroundColor: "#1e3a5f",
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
        color: "#fff",
        fontWeight: "bold"
    },

    name: {
        color: "#fff",
        fontWeight: "bold"
    },

    contract: {
        color: TEXT2,
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
        backgroundColor: PRIMARY
    },

    progressText: {
        color: PRIMARY,
        fontSize: 10,
        marginTop: 4
    },
    dotOrange: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: ORANGE,
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
        color: TEXT2,
        fontSize: 12
    },

    value: {
        color: "#fff",
        fontWeight: "bold"
    },

    priceRow: {
        borderTopWidth: 1,
        borderColor: BORDER,
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 6
    },

    price: {
        color: PRIMARY,
        fontWeight: "bold",
        fontSize: 16
    },

    priceUnit: {
        color: TEXT2,
        fontSize: 12
    },

    fab: {
        position: "absolute",
        right: 16,
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: PRIMARY,
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
        backgroundColor: BG,
        borderTopWidth: 1,
        borderColor: BORDER,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },

    navItem: {
        alignItems: "center"
    },

    navText: {
        fontSize: 11,
        color: "#64748b"
    },
    emptyStateText: {
        color: "#777",
    }
});
