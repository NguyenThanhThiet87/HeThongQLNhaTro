import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
import { useFocusEffect } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    TextInput,
    SafeAreaView,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTroApi, suaDayNhaTroApi } from "../../../api/PhongTro";

import { TEN_TRANG_THAI_PHONG, TRANG_THAI_PHONG } from "../../../constants/TRANG_THAI_PHONG";
import LottieView from 'lottie-react-native';
import AppHeader from "../../../components/AppHeader";
import ActionConfirmModal from "../../../components/ActionConfirmModal";
import { deletePhongApi } from "../../../api/PhongTro";
import toast from "../../../utils/toast";
import LoadingOverlay from "../../../components/LoadingOverlay";

const PRIMARY = "#13c8ec";

const RoomCard = ({ name, status, meta, icon, color, onPress, onLongPress }) => {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    return (
        <TouchableOpacity style={styles.roomCard} onPress={onPress} onLongPress={onLongPress}>
            <MaterialIcons
                name={icon}
                size={22}
                color={color}
                style={styles.roomIcon}
            />
            <Text style={styles.roomName}>{name}</Text>
            <Text style={styles.roomMeta}>{meta}</Text>
            <Text style={[styles.badge, { color }]}>{status}</Text>
        </TouchableOpacity>
    );
};

export default function PropertyDetailScreen({ route }) {
    const navigation = useNavigation();
    const maDayNt = route.params.id;
    const { width, height } = Dimensions.get("window");
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const [loading, setLoading] = React.useState(false);

    const [dayNhaTro, setDayNhaTro] = React.useState(null);
    const [phongs, setPhongs] = React.useState([]);
    const [filteredPhongs, setFilteredPhongs] = React.useState([]);
    const [selectedFilter, setSelectedFilter] = React.useState("all");

    // --- STATE EDITING ---
    const [editModalVisible, setEditModalVisible] = React.useState(false);
    const [editData, setEditData] = React.useState({
        tenDayNt: "",
        diaChi: "",
        trangThaiNt: true,
        kinhDo: 0,
        viDo: 0,
        imageUri: null,
    });
    const [showMap, setShowMap] = React.useState(false);
    const [mapRegion, setMapRegion] = React.useState({
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const fetchData = async () => {
        try {
            const refreshResult = await getDayNhaTroApi(maDayNt);
            if (refreshResult && refreshResult.success) {
                setDayNhaTro(refreshResult.data.dayNhaTro);
                setPhongs(refreshResult.data.lstPhong || []);
                setFilteredPhongs(refreshResult.data.lstPhong || []);
            }
        } catch (error) {
            console.error("fetchData Error:", error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleFilteredPhongs = function (key) {
        setSelectedFilter(key);
        if (key === "all") {
            setFilteredPhongs(phongs);
        } else {
            const filtered = phongs.filter(p => p.tenTrangThaiPhong === TEN_TRANG_THAI_PHONG[key]);
            setFilteredPhongs(filtered);
        }
        return phongs.filter(p => p.tenTrangThaiPhong === TEN_TRANG_THAI_PHONG[key]);
    };

    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [roomToDelete, setRoomToDelete] = React.useState(null);

    const handleLongPressDelete = (phong) => {
        setRoomToDelete(phong);
        setDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        const result = await deletePhongApi(roomToDelete.maPhong);
        if (result.success) {
            // Cập nhật lại danh sách phòng sau khi xóa
            fetchData();
        } else {
            console.log("Lỗi xóa phòng:", result.message);
        }

        setDeleteModalVisible(false);
        setRoomToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteModalVisible(false);
        setRoomToDelete(null);
    };

    // --- LOGIC EDITING ---
    const mapRef = React.useRef(null);
    const openEditModal = () => {
        const hasPos = dayNhaTro.viDo && dayNhaTro.kinhDo;
        const initialLat = Number(dayNhaTro.viDo) || 10.762622;
        const initialLng = Number(dayNhaTro.kinhDo) || 106.660172;

        setEditData({
            tenDayNt: dayNhaTro.tenDayNt,
            diaChi: dayNhaTro.diaChi,
            trangThaiNt: dayNhaTro.trangThaiNt,
            kinhDo: initialLng,
            viDo: initialLat,
            imageUri: dayNhaTro.urlAnh,
        });

        setMapRegion({
            latitude: initialLat,
            longitude: initialLng,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
        });
        setEditModalVisible(true);
    };

    const handleOpenMap = async () => {
        // Mở bản đồ ngay lập tức
        setShowMap(true);

        const hasPos = dayNhaTro.viDo && dayNhaTro.kinhDo;

        // Nếu đã có vị trí của dãy trọ rồi, ta ưu tiên hiển thị vị trí đó
        if (hasPos) {
            const currentSelected = {
                latitude: Number(editData.viDo),
                longitude: Number(editData.kinhDo),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setMapRegion(currentSelected);
            setTimeout(() => {
                mapRef.current?.animateToRegion(currentSelected, 500);
            }, 500);
            return;
        }

        // Nếu chưa có vị trí, lấy vị trí hiện tại của thiết bị (giống Bước 1)
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let lastLocation = await Location.getLastKnownPositionAsync({});
            if (lastLocation) {
                const newRegion = {
                    latitude: lastLocation.coords.latitude,
                    longitude: lastLocation.coords.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                };
                setMapRegion(newRegion);
                mapRef.current?.animateToRegion(newRegion, 500);
                if (!editData.viDo || editData.viDo === 10.762622) { // 10.762622 là mặc định HCM
                    setEditData(prev => ({ ...prev, viDo: newRegion.latitude, kinhDo: newRegion.longitude }));
                }
            }

            let userLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            const precisionRegion = {
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setMapRegion(precisionRegion);
            mapRef.current?.animateToRegion(precisionRegion, 500);
            if (!editData.viDo || editData.viDo === 10.762622) {
                setEditData(prev => ({ ...prev, viDo: precisionRegion.latitude, kinhDo: precisionRegion.longitude }));
            }
        } catch (e) {
            console.log("Error getting location in edit:", e);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
        });
        if (!result.canceled) {
            setEditData({ ...editData, imageUri: result.assets[0].uri });
        }
    };

    const handleUpdateDormitory = async () => {
        setLoading(true);
        try {
            const result = await suaDayNhaTroApi(maDayNt, {
                TenDayNt: editData.tenDayNt,
                DiaChi: editData.diaChi,
                TrangThaiHd: editData.trangThaiNt,
                KinhDo: editData.kinhDo,
                ViDo: editData.viDo,
                ImageUri: editData.imageUri,
            });

            console.log("Cập nhật dãy trọ - Kết quả:", result);

            if (result.success) {
                toast.success("Cập nhật dãy trọ thành công!");
                setEditModalVisible(false);
                await fetchData(); // Chờ lấy xong dữ liệu mới
            } else {
                toast.error("Lỗi cập nhật: " + result.message);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật dãy trọ:", error);
            toast.error("Có lỗi xảy ra trong quá trình lưu dữ liệu.");
        } finally {
            setLoading(false);
        }
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
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >

                {/* PROPERTY INFO CARD */}
                <View style={styles.card}>
                    <Image
                        source={{
                            uri: dayNhaTro?.urlAnh,
                        }}
                        style={styles.propertyImage}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.roomCount}>
                            Nhà trọ {dayNhaTro?.tenDayNt}
                        </Text>

                        <View style={styles.row}>
                            <MaterialIcons name="location-on" size={16} color={PRIMARY} />
                            <Text style={styles.address}>
                                {dayNhaTro?.diaChi}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <MaterialIcons name="meeting-room" size={16} color={COLORS.textMuted} />
                            <Text style={styles.roomCount}>{dayNhaTro?.slphong} phòng</Text>

                            <View style={styles.separator} />

                            <Text style={styles.active}>
                                {dayNhaTro?.trangThaiNt === true ? "Đang hoạt động" : "Tạm ngưng"}
                            </Text>
                        </View>

                        {dayNhaTro?.kinhDo && (
                            <View style={styles.row}>
                                <MaterialIcons name="my-location" size={14} color="#94a3b8" />
                                <Text style={styles.coordText}>
                                    {Number(dayNhaTro.viDo).toFixed(5)}, {Number(dayNhaTro.kinhDo).toFixed(5)}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity style={styles.editDetailBtn} onPress={openEditModal}>
                            <MaterialIcons name="edit-note" size={16} color="#aaa" />
                            <Text style={styles.editDetailText}>
                                SỬA THÔNG TIN CHI TIẾT
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                {/* ROOM LIST HEADER */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>
                        Danh sách phòng
                    </Text>
                </View>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScroll}
                >
                    <TouchableOpacity key="all" style={[styles.filterChip, selectedFilter === "all" && styles.filterChipActive]} onPress={() => handleFilteredPhongs("all")}>
                        <Text style={styles.filterChipTextActive}>Tất cả</Text>
                    </TouchableOpacity>
                    {
                        Object.keys(TRANG_THAI_PHONG).map(key => (
                            <TouchableOpacity key={key} style={[styles.filterChip, selectedFilter === key && styles.filterChipActive]} onPress={() => handleFilteredPhongs(key)}>
                                <Text style={styles.filterChipTextActive}>{TEN_TRANG_THAI_PHONG[key]}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </ScrollView>

                {/* ROOM GRID */}
                <View style={styles.grid}>
                    {filteredPhongs.length != 0 ? (
                        filteredPhongs?.map((phong, idx) => {
                            let icon = "person";
                            let color = "#22c55e";

                            // Tùy chỉnh icon và màu theo trạng thái phòng
                            switch (phong.tenTrangThaiPhong) {
                                case "Trống":
                                    icon = "no-accounts";
                                    color = PRIMARY;
                                    break;
                                case "Nợ tiền":
                                    icon = "error-outline";
                                    color = "#ef4444";
                                    break;
                                case "Bảo trì":
                                    icon = "construction";
                                    color = "#f59e0b";
                                    break;
                                case "Đang thuê":
                                default:
                                    icon = "person";
                                    color = "#22c55e";
                            }
                            return (<RoomCard
                                key={phong.id || phong.soPhong || idx}
                                name={phong.soPhong}
                                status={phong.tenTrangThaiPhong}
                                meta={phong.tenLoaiPhong}
                                icon={icon}
                                color={color}
                                onPress={() => navigation.navigate("ChiTietPhong", { id: phong.maPhong })}
                                onLongPress={() => handleLongPressDelete(phong)}
                            />)
                        })) : (
                        <View style={{ marginTop: 0, alignItems: "center", gap: 0 }}>
                            <LottieView
                                source={require("../../../../assets/animations/empty.json")}
                                autoPlay
                                loop
                                style={{ width: width * 0.9, height: height * 0.3 }}
                            />
                            <Text style={{ color: "#fff" }}>Không có phòng nào</Text>
                        </View>

                    )}
                </View>

            </ScrollView>

            {/* FLOAT BUTTON */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ThemPhong", { maDayNt })}>
                <MaterialIcons name="add" size={28} color="#000" />
            </TouchableOpacity>

            <ActionConfirmModal
                visible={deleteModalVisible}
                title="Xác nhận xóa phòng"
                message={`Bạn có chắc muốn xóa phòng ${roomToDelete?.soPhong}?`}
                yesText="Xóa"
                noText="Hủy"
                type="delete"
                requiredText="delete"
                onYes={handleConfirmDelete}
                onNo={handleCancelDelete}
            />

            {/* MODAL SỬA THÔNG TIN */}
            <Modal visible={editModalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                            <MaterialIcons name="close" size={28} color={COLORS.textMain} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>Sửa thông tin dãy trọ</Text>
                        <TouchableOpacity onPress={handleUpdateDormitory}>
                            <Text style={styles.confirmText}>Lưu</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={{ flex: 1, padding: 16 }}>
                        <Text style={styles.editLabel}>Tên dãy trọ</Text>
                        <TextInput
                            style={styles.editInput}
                            value={editData.tenDayNt}
                            onChangeText={(val) => setEditData({ ...editData, tenDayNt: val })}
                            placeholder="Nhập tên dãy trọ..."
                            placeholderTextColor={COLORS.textMuted}
                        />

                        <Text style={styles.editLabel}>Địa chỉ</Text>
                        <TextInput
                            style={styles.editInput}
                            value={editData.diaChi}
                            onChangeText={(val) => setEditData({ ...editData, diaChi: val })}
                            placeholder="Nhập địa chỉ..."
                            placeholderTextColor={COLORS.textMuted}
                        />

                        <TouchableOpacity
                            style={styles.editImagePicker}
                            onPress={pickImage}
                        >
                            {editData.imageUri ? (
                                <Image source={{ uri: editData.imageUri }} style={styles.editPreview} />
                            ) : (
                                <View style={styles.editPlaceholder}>
                                    <MaterialIcons name="add-a-photo" size={32} color="#94a3b8" />
                                    <Text style={{ color: "#94a3b8" }}>Đổi ảnh bìa</Text>
                                </View>
                            )}
                        </TouchableOpacity>

                        <Text style={styles.editLabel}>Vị trí trên bản đồ</Text>
                        <TouchableOpacity
                            style={styles.editLocationBtn}
                            onPress={handleOpenMap}
                        >
                            <MaterialIcons name="map" size={24} color={COLORS.primary} />
                            <Text style={styles.editLocationText}>
                                {editData.viDo && editData.kinhDo
                                    ? `Đã xác định: ${Number(editData.viDo).toFixed(5)}, ${Number(editData.kinhDo).toFixed(5)}`
                                    : "Chọn vị trí trên bản đồ"}
                            </Text>
                            <MaterialIcons name="chevron-right" size={24} color="#94a3b8" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.editStatusRow}
                            onPress={() => setEditData({ ...editData, trangThaiNt: !editData.trangThaiNt })}
                        >
                            <View style={[styles.editCheckbox, editData.trangThaiNt && styles.editCheckboxActive]}>
                                {editData.trangThaiNt && <MaterialIcons name="check" size={16} color="black" />}
                            </View>
                            <Text style={{ color: COLORS.textMain, fontSize: 16 }}>Đang hoạt động</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* MODAL CHỌN VỊ TRÍ (NESTED) */}
                    <Modal visible={showMap} animationType="fade">
                        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
                            <View style={styles.modalHeader}>
                                <TouchableOpacity onPress={() => setShowMap(false)}>
                                    <MaterialIcons name="arrow-back" size={28} color={COLORS.textMain} />
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>Chọn tọa độ</Text>
                                <TouchableOpacity onPress={() => setShowMap(false)}>
                                    <Text style={styles.confirmText}>Xong</Text>
                                </TouchableOpacity>
                            </View>
                            <MapView
                                ref={mapRef}
                                provider={PROVIDER_GOOGLE}
                                style={{ flex: 1 }}
                                initialRegion={mapRegion}
                                onPress={(e) => {
                                    const { latitude, longitude } = e.nativeEvent.coordinate;
                                    setEditData({ ...editData, viDo: latitude, kinhDo: longitude });
                                }}
                            >
                                <Marker
                                    coordinate={{ latitude: Number(editData.viDo), longitude: Number(editData.kinhDo) }}
                                    draggable
                                    onDragEnd={(e) => {
                                        const { latitude, longitude } = e.nativeEvent.coordinate;
                                        setEditData({ ...editData, viDo: latitude, kinhDo: longitude });
                                    }}
                                />
                            </MapView>
                        </SafeAreaView>
                    </Modal>

                </SafeAreaView>
            </Modal>
            <LoadingOverlay visible={loading} />
        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scroll: {
        paddingVertical: 16,
        paddingBottom: 120,
        paddingHorizontal: 16,
    },

    editBtn: {
        backgroundColor: "rgba(19,200,236,0.1)",
        padding: 5,
        borderRadius: 8,
    },

    card: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: COLORS.card,
        padding: 14,
        borderRadius: 16,
        marginBottom: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    propertyImage: {
        width: 64,
        height: 64,
        borderRadius: 10,
    },


    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    address: {
        color: "#aaa",
        fontSize: 13,
    },

    roomCount: {
        color: COLORS.textMain,
        fontWeight: "bold",
    },

    separator: {
        width: 1,
        height: 14,
        backgroundColor: COLORS.textMuted,
        marginHorizontal: 8,
    },

    active: {
        color: "#22c55e",
        fontSize: 12,
    },


    editDetailBtn: {
        flexDirection: "row",
        gap: 6,
        marginTop: 10,
    },

    editDetailText: {
        color: "#aaa",
        fontSize: 11,
        fontWeight: "bold",
    },


    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    sectionTitle: {
        color: COLORS.textMain,
        fontWeight: "bold",
        fontSize: 16,
    },

    seeAll: {
        color: COLORS.primary,
        fontSize: 12,
    },


    cameraCard: {
        width: 160,
        height: 90,
        marginRight: 12,
        marginBottom: 20,
    },

    cameraImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },

    recBadge: {
        position: "absolute",
        top: 6,
        left: 6,
        backgroundColor: "red",
        paddingHorizontal: 5,
        borderRadius: 4,
    },

    recText: {
        color: COLORS.textMain,
        fontSize: 9,
    },

    cameraLabel: {
        position: "absolute",
        bottom: 6,
        left: 6,
        color: COLORS.textMain,
        fontSize: 11,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    roomCard: {
        width: "48%",
        backgroundColor: COLORS.card,
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    roomIcon: {
        position: "absolute",
        top: 10,
        right: 10,
    },

    roomName: {
        color: COLORS.textMain,
        fontSize: 18,
        fontWeight: "bold",
    },

    roomMeta: {
        color: COLORS.textMuted,
        fontSize: 12,
        marginBottom: 6,
    },

    badge: {
        fontSize: 11,
        fontWeight: "bold",
    },


    fab: {
        position: "absolute",
        right: 20,
        bottom: 100,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    filterScroll: {
        marginBottom: 16,
    },

    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: COLORS.card,
        marginRight: 8,
    },

    filterChipActive: {
        backgroundColor: COLORS.primary,
    },

    filterChipText: {
        color: COLORS.textMuted,
        fontSize: 13,
        fontWeight: "600",
    },

    filterChipTextActive: {
        color: COLORS.inputText,
        fontSize: 13,
        fontWeight: "700",
    },

    coordText: { fontSize: 12, color: "#94a3b8", marginLeft: 4 },

    // EDIT MODAL STYLES
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.textMain },
    confirmText: { fontSize: 16, fontWeight: "bold", color: PRIMARY },
    editLabel: { fontSize: 14, color: COLORS.textMain, marginTop: 20, marginBottom: 8, fontWeight: "600" },
    editInput: {
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 14,
        color: COLORS.textMain,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    editImagePicker: {
        width: "100%",
        height: 180,
        backgroundColor: COLORS.card,
        borderRadius: 12,
        marginTop: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: COLORS.border,
        borderStyle: "dashed",
    },
    editPreview: { width: "100%", height: "100%", resizeMode: "cover" },
    editPlaceholder: { flex: 1, justifyContent: "center", alignItems: "center", gap: 8 },
    editLocationBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    editLocationText: { flex: 1, marginLeft: 12, color: COLORS.textMain },
    editStatusRow: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: 24, marginBottom: 40 },
    editCheckbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
    editCheckboxActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
});
