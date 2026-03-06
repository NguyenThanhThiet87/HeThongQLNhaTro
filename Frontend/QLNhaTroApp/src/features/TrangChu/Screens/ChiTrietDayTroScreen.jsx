import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getDayNhaTroApi } from "../../../api/PhongTro";

import { TEN_TRANG_THAI_PHONG, TRANG_THAI_PHONG } from "../../../constants/TRANG_THAI_PHONG";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const SURFACE = "#182b2f";

const RoomCard = ({ name, status, meta, icon, color, onPress }) => {
    return (
        <TouchableOpacity style={styles.roomCard} onPress={onPress}>
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
    const [dayNhaTro, setDayNhaTro] = React.useState(null);
    const [phongs, setPhongs] = React.useState([]);
    const [filteredPhongs, setFilteredPhongs] = React.useState([]);
    const [selectedFilter, setSelectedFilter] = React.useState("all");

    useEffect(() => {
        const fetchData = async () => {
            const result = await getDayNhaTroApi(maDayNt);
            if (result.success) {
                setDayNhaTro(result.data.dayNhaTro);
                setPhongs(result.data.lstPhong || []);
                setFilteredPhongs(result.data.lstPhong || []);
            }
        };
        fetchData();
    }, []);

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

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                {/* Back */}
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color="#aaa" />
                </TouchableOpacity>
                <View>
                    <Text style={styles.headerTitle}>
                        Dãy Trọ Của Tôi
                    </Text>
                </View>
            </View>

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
                                {dayNhaTro?.tenDayNt}
                            </Text>

                        <View style={styles.row}>
                            <MaterialIcons name="location-on" size={16} color={PRIMARY} />
                            <Text style={styles.address}>
                                {dayNhaTro?.diaChi}
                            </Text>
                        </View>

                        <View style={styles.row}>
                            <MaterialIcons name="meeting-room" size={16} color="#888" />
                            <Text style={styles.roomCount}>{dayNhaTro?.slphong} phòng</Text>

                            <View style={styles.separator} />

                            <Text style={styles.active}>
                                {dayNhaTro?.trangThaiNt === true ? "Đang hoạt động" : "Tạm ngưng"}
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.editDetailBtn}>
                            <MaterialIcons name="edit-note" size={16} color="#aaa" />
                            <Text style={styles.editDetailText}>
                                SỬA THÔNG TIN CHI TIẾT
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

                {/* CAMERA SECTION */}

                <View style={styles.sectionHeader}>
                    <View style={styles.row}>
                        <MaterialIcons name="videocam" size={20} color={PRIMARY} />
                        <Text style={styles.sectionTitle}>
                            Camera An Ninh
                        </Text>
                    </View>

                    <Text style={styles.seeAll}>
                        Xem tất cả
                    </Text>
                </View>


                <ScrollView horizontal showsHorizontalScrollIndicator={false}>

                    <View style={styles.cameraCard}>
                        <Image
                            source={{
                                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ_VkIUrI2-cUEAnmsvGObzLmnqWeoh-bgLFHZm6zTdJIScZeOccAQKFpxvUwUKRdhaZkpJaO6JxrgE6BvNXisJATEWthzJluYeVdCKb-BZ9mE21fPhcT_lC0aWr2-oZMb_onkoKUw9lgXyEGBik5zOOOzI9iKEFRt3pHntIw_r6L_pF4vgvfpXhshUjLFAGtDn5u38Lv8svtGSAj4HZGpwJ1z5KaICh_MlceE3_Daxbom1It8vbRv4XsjRr07zaoagIiiitMk5y4",
                            }}
                            style={styles.cameraImage}
                        />

                        <View style={styles.recBadge}>
                            <Text style={styles.recText}>REC</Text>
                        </View>

                        <Text style={styles.cameraLabel}>
                            Cổng chính
                        </Text>

                    </View>

                </ScrollView>


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
                    {filteredPhongs?.map((phong, idx) => {
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
                        />)
                    })}
                </View>

            </ScrollView>

            {/* FLOAT BUTTON */}
            <TouchableOpacity style={styles.fab}>
                <MaterialIcons name="add" size={28} color="#000" />
            </TouchableOpacity>
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
        height: 56,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",

        borderBottomWidth: 1,
        borderBottomColor: "#1f2937",

        backgroundColor: "#101f22"
    },

    back: {
        position: "absolute",
        left: 16,
        height: "100%",
        justifyContent: "center",
        alignItems: "center",

        paddingRight: 10,
        zIndex: 10
    },

    headerTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#fff",
        textAlign: "center"
    },

    scroll: {
        paddingVertical: 16,
        paddingBottom: 120,
    },

    editBtn: {
        backgroundColor: "rgba(19,200,236,0.1)",
        padding: 5,
        borderRadius: 8,
    },

    card: {
        flexDirection: "row",
        gap: 12,
        backgroundColor: SURFACE,
        padding: 14,
        borderRadius: 16,
        marginBottom: 20,
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
        color: "#fff",
        fontWeight: "bold",
    },

    separator: {
        width: 1,
        height: 14,
        backgroundColor: "#333",
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
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },

    seeAll: {
        color: PRIMARY,
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
        color: "#fff",
        fontSize: 9,
    },

    cameraLabel: {
        position: "absolute",
        bottom: 6,
        left: 6,
        color: "#fff",
        fontSize: 11,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },

    roomCard: {
        width: "48%",
        backgroundColor: SURFACE,
        padding: 14,
        borderRadius: 16,
        marginBottom: 12,
    },

    roomIcon: {
        position: "absolute",
        top: 10,
        right: 10,
    },

    roomName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },

    roomMeta: {
        color: "#888",
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
        backgroundColor: PRIMARY,
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
        backgroundColor: SURFACE,
        marginRight: 8,
    },

    filterChipActive: {
        backgroundColor: PRIMARY,
    },

    filterChipText: {
        color: "#aaa",
        fontSize: 13,
        fontWeight: "600",
    },

    filterChipTextActive: {
        color: "#000",
        fontSize: 13,
        fontWeight: "700",
    },

});
