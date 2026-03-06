import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getDayNhaTrosApi, getPhongTrosApi } from "../../../api/PhongTro";
import SelectModal from "../../../components/SelectModal";
import SelectBox from "../../../components/SelectBox";
import Input from "../../../components/Input";


import { getDienNuocCuApi, saveDienNuocMoiApi } from "../../../api/HoaDon";
import { TRANG_THAI_PHONG } from "../../../constants/TRANG_THAI_PHONG";
import toast from "../../../utils/toast";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#16282c";
const NEUTRAL = "#1a2e32";

export default function GhiDienNuocScreen({ route }) {
    const { maDayNt, month } = route.params;

    const navigation = useNavigation();
    const [cameraVisible, setCameraVisible] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const [dayNhaTroList, setDayNhaTroList] = useState([]);
    const [selectedDayNhaTro, setSelectedDayNhaTro] = useState(null);
    const [phongList, setPhongList] = useState([]);
    const [selectedPhong, setSelectedPhong] = useState(null);
    const [enablePhong, setEnablePhong] = useState(false);

    const [dienCu, setDienCu] = useState(0);
    const [dienNew, setDienNew] = useState(0);
    const [dienTieuThu, setDienTieuThu] = useState(0);
    const [nuocCu, setNuocCu] = useState(0);
    const [nuocNew, setNuocNew] = useState(0);
    const [nuocTieuThu, setNuocTieuThu] = useState(0);

    //Phòng đã được ghi trước đó trong tháng
    const [chiSoDienNuocDaGhi, setChiSoDienNuocDaGhi] = useState(null);

    // trạng thái chụp ảnh
    const [dienCaptured, setDienCaptured] = useState(false);
    const [nuocCaptured, setNuocCaptured] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            const response = await getDayNhaTrosApi(user.maNd);
            if (response.success) {
                setDayNhaTroList(response.data);
                if (response.data.length > 0) {
                    setSelectedDayNhaTro(response.data[0]);
                }
            } else
                console.error("Lỗi khi lấy danh sách ngày nhà trọ:", response.message);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchPhongList = async () => {
            if (selectedDayNhaTro) {
                const response = await getPhongTrosApi(selectedDayNhaTro.maDayNt);
                if (response.success) {
                    setPhongList(response.data.filter(r => r.maTtphong === TRANG_THAI_PHONG.DANG_THUE));
                    setSelectedPhong(response.data[0]);
                } else {
                    console.error("Lỗi khi lấy danh sách phòng trọ:", response.message);
                }
            }
        };
        fetchPhongList();
    }, [selectedDayNhaTro]);

    useEffect(() => {
        const fetchDienNuocCu = async () => {
            if (selectedPhong) {
                const response = await getDienNuocCuApi(selectedPhong.maPhong, month.month, month.year);
                console.log("Response from getDienNuocCuApi:", response);
                if (response.success) {
                    setDienCu(response.data.dienCu);
                    setNuocCu(response.data.nuocCu);
                    setEnablePhong(true);
                    setChiSoDienNuocDaGhi(null);
                } else {
                    setChiSoDienNuocDaGhi(response.data);
                    setEnablePhong(false);

                }
            }
        }
        fetchDienNuocCu();
    }, [selectedPhong]);

    const [dienError, setDienError] = useState("");
    const [nuocError, setNuocError] = useState("");

    const handleChangeDienNuocNew = (valueNew, valueOld, onSet, onSetTieuThu, onError) => {
        const onlyNumber = valueNew.replace(/[^0-9]/g, "");
        if (Number(onlyNumber) < valueOld) {
            onError("Số mới phải lớn hơn số cũ");
            return;
        }
        onSet(onlyNumber);
        onError("");
        onSetTieuThu(onlyNumber - valueOld);
    }

    const handleSave = async () => {
        if (!dienNew) {
            setDienError("Vui lòng nhập số mới");
        }
        if (!nuocNew) {
            setNuocError("Vui lòng nhập số mới");
        }

        const result = await saveDienNuocMoiApi(selectedPhong.maPhong, month.month, month.year, Number(dienNew), Number(nuocNew));
        console.log("Result from saveDienNuocMoiApi:", result);
        if (result.success) {
            toast.success(result.message);
            navigation.goBack();
        } else {
            toast.error("Lỗi khi ghi chỉ số mới: " + result.message);
        }
    }

    const handleNext = () => {
        const idx = phongList.findIndex(p => p.maPhong === selectedPhong.maPhong);
        const nextIdx = idx === phongList.length - 1 ? -1 : idx + 1;
        if (nextIdx === -1) {
            toast.info("Đã hoàn thành ghi chỉ số cho tất cả phòng trọ trong dãy nhà trọ");
            return;
        }
        setSelectedPhong(phongList[nextIdx]);

        setDienNew(0);
        setNuocNew(0);
        setDienTieuThu(0);
        setNuocTieuThu(0);
    }
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={styles.headerTitle}>Ghi Sổ</Text>
                        <SelectBox
                            value={selectedDayNhaTro?.tenDayNt}
                            placeholder="Chọn nhà trọ"
                            onPress={() => setModalVisible(true)}
                        />
                        <SelectModal
                            visible={modalVisible}
                            onClose={() => setModalVisible(false)}
                            data={dayNhaTroList}
                            selected={selectedDayNhaTro}
                            onSelect={setSelectedDayNhaTro}
                            getLabel={item => item?.tenDayNt}
                        />
                    </View>
                    <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate("LichSuDienNuoc")}>
                        <MaterialIcons name="history" size={22} color={PRIMARY} />
                    </TouchableOpacity>
                </View>
                {/* ROOM TABS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {phongList.map((r) => (
                        <TouchableOpacity
                            key={r.maPhong}
                            onPress={() => setSelectedPhong(r)}
                            style={[
                                styles.roomTab,
                                selectedPhong === r && styles.roomTabActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.roomTabText,
                                    selectedPhong === r && { color: "#000" },
                                ]}
                            >
                                {r.soPhong}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
            >
                {
                    phongList.length == 0 ? (
                        <Text style={{ color: "#fff", textAlign: "center", marginTop: 50 }}>Không có phòng trọ nào đang thuê trong dãy nhà trọ này</Text>
                    ) : (
                        enablePhong === true ?
                            (
                                <>
                                    <View style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                <View style={[styles.iconBox, { backgroundColor: "#facc1520" }]}>
                                                    <MaterialIcons name="bolt" size={18} color="#facc15" />
                                                </View>
                                                <Text style={styles.cardTitle}>Chỉ số Điện</Text>
                                            </View>
                                            <View style={[
                                                styles.statusBadge,
                                                dienCaptured ? styles.badgeGreen : styles.badgeGray,
                                            ]}>
                                                <MaterialCommunityIcons
                                                    name={dienCaptured ? "check-circle" : "image-off"}
                                                    size={14}
                                                    color={dienCaptured ? "#22c55e" : "#aaa"}
                                                />
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: dienCaptured ? "#22c55e" : "#aaa",
                                                    fontWeight: "bold",
                                                }}>
                                                    {dienCaptured ? "ĐÃ CHỤP ẢNH" : "CHƯA CHỤP"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.grid}>
                                            <Input
                                                label="Số cũ"
                                                value={dienCu}
                                                enabled={false}
                                                radius={8}
                                                width={120}
                                                height={40}
                                            />
                                            <View style={styles.inputBox}>
                                                <Input
                                                    label="Số mới"
                                                    value={dienNew}
                                                    onChangeText={(value) => handleChangeDienNuocNew(value, dienCu, setDienNew, setDienTieuThu, setDienError)}
                                                    showError={true}
                                                    error={dienError}
                                                    radius={8}
                                                    width={150}
                                                    height={40}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.cameraBtn,
                                                    !dienCaptured && { backgroundColor: "#2c3e50" },
                                                ]}
                                                onPress={() => setCameraVisible(true)}
                                            >
                                                <MaterialIcons name="photo-camera" size={18} color="#000" />
                                                <Text style={{ fontSize: 11, fontWeight: "bold" }}>CHỤP ẢNH</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.thumbnail}
                                                onPress={() => setLightboxVisible(true)}
                                            />
                                        </View>
                                        <View style={styles.footer}>
                                            <View style={styles.consumption}>
                                                <Text style={{ fontSize: 11, color: PRIMARY }}>TIÊU THỤ:</Text>
                                                <Text style={{ fontSize: 11, fontWeight: "bold", color: PRIMARY }}>
                                                    {dienTieuThu || 0} kWh
                                                </Text>
                                            </View>
                                            <Text style={styles.date}>Chốt:{new Date().toLocaleDateString()}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <View style={styles.cardHeader}>
                                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                                <View style={[styles.iconBox, { backgroundColor: "#3b82f620" }]}>
                                                    <MaterialIcons name="water-drop" size={18} color="#3b82f6" />
                                                </View>
                                                <Text style={styles.cardTitle}>Chỉ số Nước</Text>
                                            </View>
                                            <View style={[
                                                styles.statusBadge,
                                                nuocCaptured ? styles.badgeGreen : styles.badgeGray,
                                            ]}>
                                                <MaterialCommunityIcons
                                                    name={nuocCaptured ? "check-circle" : "image-off"}
                                                    size={14}
                                                    color={nuocCaptured ? "#22c55e" : "#aaa"}
                                                />
                                                <Text style={{
                                                    fontSize: 10,
                                                    color: nuocCaptured ? "#22c55e" : "#aaa",
                                                    fontWeight: "bold",
                                                }}>
                                                    {nuocCaptured ? "ĐÃ CHỤP ẢNH" : "CHƯA CHỤP"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={styles.grid}>
                                            <Input
                                                label="Số cũ"
                                                value={nuocCu}
                                                enabled={false}
                                                radius={8}
                                                width={120}
                                                height={40}
                                            />
                                            <View style={styles.inputBox}>
                                                <Input
                                                    label="Số mới"
                                                    value={nuocNew}
                                                    onChangeText={(value) => handleChangeDienNuocNew(value, nuocCu, setNuocNew, setNuocTieuThu, setNuocError)}
                                                    showError={true}
                                                    error={nuocError}
                                                    radius={8}
                                                    width={150}
                                                    height={40}
                                                />
                                            </View>
                                        </View>
                                        <View style={styles.actionRow}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.cameraBtn,
                                                    !nuocCaptured && { backgroundColor: "#2c3e50" },
                                                ]}
                                                onPress={() => setCameraVisible(true)}
                                            >
                                                <MaterialIcons name="photo-camera" size={18} color="#000" />
                                                <Text style={{ fontSize: 11, fontWeight: "bold" }}>CHỤP ẢNH</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.thumbnail}
                                                onPress={() => setLightboxVisible(true)}
                                            />
                                        </View>
                                        <View style={styles.footer}>
                                            <View style={styles.consumption}>
                                                <Text style={{ fontSize: 11, color: PRIMARY }}>TIÊU THỤ:</Text>
                                                <Text style={{ fontSize: 11, fontWeight: "bold", color: PRIMARY }}>
                                                    {nuocTieuThu || 0} m³
                                                </Text>
                                            </View>
                                            <Text style={styles.date}>Chốt: {new Date().toLocaleDateString()}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoBox}>
                                        <MaterialIcons name="info" size={18} color={PRIMARY} />
                                        <Text style={styles.infoText}>
                                            Nhập số mới trực tiếp hoặc dùng Camera để quét. Sau khi chụp, nhấn
                                            vào ảnh thu nhỏ để kiểm tra lại.
                                        </Text>
                                    </View>
                                </>
                            )
                            : (
                                <View style={styles.card}>
                                    <Text style={[styles.cardTitle, { marginBottom: 16 }]}>Chỉ số đã ghi</Text>
                                    <View style={{ flexDirection: "column", gap: 16, marginBottom: 18 }}>
                                        {/* Điện */}
                                        <View style={[styles.infoBoxComplete, { flex: 1 }]}>
                                            <MaterialIcons name="bolt" size={22} color="#facc15" style={{ marginRight: 8 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#aaa", fontSize: 13 }}>Điện cũ: <Text style={{ color: "#fff", fontWeight: "bold" }}>{chiSoDienNuocDaGhi?.csdienCu}</Text></Text>
                                                <Text style={{ color: "#aaa", fontSize: 13 }}>Điện mới: <Text style={{ color: "#fff", fontWeight: "bold" }}>{chiSoDienNuocDaGhi?.csdienMoi}</Text></Text>
                                                <Text style={{ color: "#facc15", fontSize: 16, fontWeight: "bold", marginTop: 8 }}>
                                                    <MaterialIcons name="trending-up" size={16} color="#3b82f6" />
                                                    {(chiSoDienNuocDaGhi?.csdienMoi ?? 0) - (chiSoDienNuocDaGhi?.csdienCu ?? 0)} kWh
                                                </Text>
                                            </View>
                                        </View>
                                        {/* Nước */}
                                        <View style={[styles.infoBoxComplete, { flex: 1 }]}>
                                            <MaterialIcons name="water-drop" size={22} color="#3b82f6" style={{ marginRight: 8 }} />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ color: "#aaa", fontSize: 13 }}>Nước cũ: <Text style={{ color: "#fff", fontWeight: "bold" }}>{chiSoDienNuocDaGhi?.csnuocCu}</Text></Text>
                                                <Text style={{ color: "#aaa", fontSize: 13 }}>Nước mới: <Text style={{ color: "#fff", fontWeight: "bold" }}>{chiSoDienNuocDaGhi?.csnuocMoi}</Text></Text>
                                                <Text style={{ color: "#3b82f6", fontSize: 16, fontWeight: "bold", marginTop: 8 }}>
                                                    <MaterialIcons name="trending-up" size={16} color="#3b82f6" />
                                                    {(chiSoDienNuocDaGhi?.csnuocMoi ?? 0) - (chiSoDienNuocDaGhi?.csnuocCu ?? 0)} m³
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Text style={styles.date}>Chốt: {chiSoDienNuocDaGhi?.thang || 0}/{chiSoDienNuocDaGhi?.nam || 0}</Text>
                                    <TouchableOpacity >
                                        <Text style={{ color: "#fff" }}>Xem chi tiết</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                    )
                }
            </ScrollView>
            {/* BOTTOM ACTION */}
            <View style={styles.bottomBar}>
                {enablePhong == true ? (
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <MaterialIcons name="save" size={20} color="#000" />
                        <Text style={styles.saveText}>CHỐT</Text>
                    </TouchableOpacity>) : (
                    <TouchableOpacity style={styles.saveBtn} onPress={handleNext}>
                        <MaterialIcons name="save" size={20} color="#000" />
                        <Text style={styles.saveText}>TIẾP</Text>
                    </TouchableOpacity>)}

            </View>
            {/* CAMERA MODAL */}
            <Modal visible={cameraVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <Text style={{ color: "#fff" }}>Camera Overlay (Mock)</Text>
                    <TouchableOpacity onPress={() => setCameraVisible(false)}>
                        <Text style={{ color: PRIMARY, marginTop: 20 }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {/* LIGHTBOX */}
            <Modal visible={lightboxVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <Image
                        source={{
                            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8CMfeT46sTKtKObbOKcgnzJEp1x8PRzdcBPT7xG0TJ0Ki5DzOCWYMMVFwsTwIMLnAKwfRZF_RByjzrjOeDEenVdND2b-qBwIMamaCAtk7n_7eAmgCW_mWbEQ7E0G_UUUq-626hSX65ijoHHzZJ4tcLoeISoqoGqJegnot8WlZVnGKzrwLL2Er8Jv3VyK9xhNLpYT0qUPXwq1WjOdF7mGG1xkYwLwOYdifi2iYeDmAYnMA67nYT8kU7juysrwk2BSCdnAMZTFPeM",
                        }}
                        style={{ width: 300, height: 400, borderRadius: 16 }}
                    />
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => setLightboxVisible(false)}
                    >
                        <Text style={{ color: PRIMARY }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#101f22",
        paddingTop: 50,
        paddingHorizontal: 20,
    },

    header: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff10",
    },

    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff"
    },
    houseName: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 22,
    },

    roomTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: NEUTRAL,
        marginRight: 8,
    },

    roomTabActive: {
        backgroundColor: PRIMARY,
    },

    roomTabText: {
        color: "#aaa",
        fontWeight: "600",
    },

    card: {
        backgroundColor: CARD,
        marginVertical: 16,
        padding: 16,
        borderRadius: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },

    badgeGreen: { backgroundColor: "#22c55e20" },
    badgeGray: { backgroundColor: "#ffffff10" },

    grid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    inputBox: { flex: 1 },

    label: {
        fontSize: 11,
        color: "#aaa",
        marginBottom: 4,
    },

    oldValueBox: {
        backgroundColor: "#ffffff10",
        borderRadius: 8,
        padding: 10,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ffffff20",
        borderRadius: 8,
        padding: 12,
        height: 40,
        color: "#fff",
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 8,
    },

    cameraBtn: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
        backgroundColor: PRIMARY,
        padding: 12,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: PRIMARY,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },

    consumption: {
        flexDirection: "row",
        gap: 6,
        backgroundColor: PRIMARY + "20",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    date: {
        fontSize: 11,
        color: "#777",
        fontStyle: "italic",
    },

    infoBox: {
        flexDirection: "row",
        gap: 8,
        margin: 16,
        padding: 12,
        backgroundColor: PRIMARY + "10",
        borderRadius: 12,
    },


    infoText: {
        fontSize: 12,
        color: "#aaa",
        flex: 1,
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: BG,
        borderTopWidth: 1,
        borderTopColor: "#ffffff10",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    saveBtn: {
        backgroundColor: PRIMARY,
        padding: 10,
        borderRadius: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },

    saveText: {
        fontWeight: "bold",
        color: "#000",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },

    infoBoxComplete: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#ffffff08",
        borderRadius: 12,
        padding: 12,
        gap: 8,
    },
});
