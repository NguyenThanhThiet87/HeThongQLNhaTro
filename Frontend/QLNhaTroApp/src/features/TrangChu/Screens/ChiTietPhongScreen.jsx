import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getPhongTroApi } from "../../../api/PhongTro";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const SURFACE = "#182b2f";

export default function ChiTietPhongScreen({ navigation, route }) {
    const { id } = route.params;
    const [phongTro, setPhongTro] = React.useState(null);
    const [hopDong, setHopDong] = React.useState(null);

    useEffect(() => {
        const fetchPhongTro = async () => {
            const result = await getPhongTroApi(id);
            console.log("Chi tiết phòng:", result);
            setPhongTro(result.data.phong);
            setHopDong(result.data.hopDongThues);
        };
        fetchPhongTro();
    }, []);

    function person(name, avatar) {
        return (
            <View style={styles.personRow} key={name}>
                <Image source={{ uri: avatar }} style={styles.personAvatar} />
                <Text style={styles.personName}>{name}</Text>
            </View>
        );
    }

    function action(icon, label) {
        return (
            <TouchableOpacity style={styles.actionCard} key={label}>
                <MaterialIcons name={icon} size={24} color={PRIMARY} />
                <Text style={styles.actionText}>{label}</Text>
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>

            {/* HEADER */}

            <View style={styles.header}>

                <TouchableOpacity
                    style={styles.back}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back-ios" size={20} color="#aaa" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Chi tiết Phòng
                </Text>

                <View style={{ width: 40 }} />

            </View>


            {/* CONTENT */}

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scroll}
            >

                {/* ROOM INFO */}

                <View style={styles.card}>

                    <View style={styles.roomHeaderRow}>

                        <View>
                            <Text style={styles.roomName}>{phongTro?.soPhong}</Text>
                            <Text style={styles.roomMeta}>
                                {phongTro?.tenLoaiPhong}
                            </Text>
                        </View>

                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>
                                {phongTro?.tenTrangThaiPhong}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.priceRow}>
                        <Text style={styles.price}>
                            {phongTro?.giaThucTe?.toLocaleString("vi-VN") || "0"}đ
                        </Text>

                        <Text style={styles.priceUnit}>
                            / tháng
                        </Text>
                    </View>

                </View>


                {/* REPRESENTATIVE */}

                <Text style={styles.sectionLabel}>
                    NGƯỜI ĐẠI DIỆN
                </Text>

                <View style={styles.cardRow}>

                    <Image
                        source={{
                            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAt-hCj1pvF0fy3E-NHIRTbXu1dM7lI8zIhZFQUCxd9OBnPpMy2jAIxUEYSHancflb33RVgZ8avWLIq6cQ6hm1YLMPFRc7eX_yOu0Wd8BgYYf744ecMYMRoCU2xEzjfcZfgNoyiQBHkKWWnf8-JVkvzxon-e-CtISTESiZyNCal9rFejFVtUqrSksF6JCCLmnWWJxvKlLZ2nHKP1oRzpXxSIro3Sw4dqTpoeuRsz3MFhx69QA306P2RfFa8uyMvT8Lwc6pLdHuGcu8",
                        }}
                        style={styles.repAvatar}
                    />

                    <View style={{ flex: 1 }}>
                        <Text style={styles.repName}>
                            {phongTro?.tenChuNt}
                        </Text>

                        <Text style={styles.repRole}>
                            Người ký hợp đồng
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.callBtn}>
                        <MaterialIcons name="phone" size={20} color={PRIMARY} />
                    </TouchableOpacity>

                </View>


                {/* OCCUPANTS */}

                <Text style={styles.sectionLabel}>
                    DANH SÁCH NGƯỜI Ở
                </Text>

                <View style={styles.card}>

                    {person(
                        "Nguyễn Văn An",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBENj8UigTgW_6E7bjp-9D94_-kTZukx2shtsvX_Im3YN1Z_FeknCSuhcFh7YO6ZJeNJmqz4SL3x23qa7QWAl37hw0JeHkWIaZ-6wrilGYSUzQuRX5e4oamDbEK5MyCVnzBHWWO9pUdxm_QYsNGZ0nGxb5BGqm0vYRAqzAUmCRj58YmpN9iR1f7_5MkyOoOsnpbfK2EceFw-5pG3CDasQHLawYaiYWzsBkPB5LcWG12r2R0Wnx_HM306PHEljZZsFiKFiBhkxw_OmA"
                    )}

                    {person(
                        "Lê Thị Bình",
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuAYoBog8aTJJyowUiMswfRyEJMOG-5SHKf07VpK1OdP5W1KwEep_T6BdpGw7JXvZwbQVMpXnf6TKJRcnnQVMhfKZo0qeggW92wHBn7wsfgzSKCDMD4FISwmUYkwCMtl3HhntGJQPDIPqfBnFHwacKTyMhqLhRb5WRW4tRbk3cqfa43bqBF2xsVxOiIz-Bsezlx04drd8S_2WQKc-Z9h5fWg_8XxQbEM_4QWytzPt-fAh3LULXL2SyySvHv7VGit5p0egoaJJHRA690"
                    )}

                </View>


                {/* CONTRACT */}

                <Text style={styles.sectionLabel}>
                    HỢP ĐỒNG
                </Text>

                <View style={styles.card}>

                    <View style={styles.contractRow}>

                        <View>
                            <Text style={styles.contractLabel}>
                                THỜI HẠN
                            </Text>

                            <Text style={styles.contractDate}>
                                01/01/2024 - 01/01/2025
                            </Text>
                        </View>

                        <TouchableOpacity style={styles.contractBtn}>
                            <Text style={styles.contractBtnText}>
                                Xem chi tiết
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.progress}>
                        <View style={styles.progressFill} />
                    </View>

                </View>


                {/* EQUIPMENT */}

                <TouchableOpacity style={styles.equipmentBtn}>

                    <MaterialIcons name="kitchen" size={24} color={PRIMARY} />

                    <Text style={styles.equipmentText}>
                        Xem thiết bị trong phòng
                    </Text>

                </TouchableOpacity>


                {/* ACTIONS */}

                <Text style={styles.sectionLabel}>
                    THAO TÁC
                </Text>

                <View style={styles.actionGrid}>

                    {action("person-add", "Thêm người")}
                    {action("edit", "Sửa phòng")}
                    {action("electric-meter", "Chốt điện nước")}

                </View>


                {/* DELETE */}

                <TouchableOpacity style={styles.deleteBtn}>
                    <Text style={styles.deleteText}>
                        Xóa hợp đồng / Trả phòng
                    </Text>
                </TouchableOpacity>


            </ScrollView>

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
        paddingBottom: 100,
    },


    card: {
        backgroundColor: SURFACE,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },

    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: SURFACE,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },


    roomHeaderRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        alignItems: "center",
    },

    roomName: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },

    roomMeta: {
        color: "#aaa",
        fontSize: 13,
    },

    statusBadge: {
        backgroundColor: "rgba(34,197,94,0.2)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },

    statusText: {
        color: "#22c55e",
        fontSize: 11,
        fontWeight: "bold",
    },


    priceRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 6,
    },

    price: {
        fontSize: 24,
        fontWeight: "bold",
        color: PRIMARY,
    },

    priceUnit: {
        color: "#aaa",
    },


    sectionLabel: {
        color: "#666",
        fontSize: 11,
        marginBottom: 8,
        marginLeft: 4,
        fontWeight: "bold",
    },


    repAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },

    repName: {
        color: "#fff",
        fontWeight: "bold",
    },

    repRole: {
        color: "#aaa",
        fontSize: 12,
    },

    callBtn: {
        padding: 10,
        backgroundColor: "rgba(19,200,236,0.15)",
        borderRadius: 999,
    },


    personRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    personAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
    },

    personName: {
        color: "#fff",
    },


    contractRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    contractLabel: {
        color: "#777",
        fontSize: 10,
    },

    contractDate: {
        color: "#fff",
        fontWeight: "bold",
    },

    contractBtn: {
        backgroundColor: "rgba(19,200,236,0.15)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    contractBtnText: {
        color: PRIMARY,
        fontSize: 12,
        fontWeight: "bold",
    },


    progress: {
        height: 6,
        backgroundColor: "#333",
        borderRadius: 999,
    },

    progressFill: {
        width: "66%",
        height: "100%",
        backgroundColor: PRIMARY,
    },


    equipmentBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: SURFACE,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },


    equipmentText: {
        color: "#fff",
        fontWeight: "bold",
    },


    actionGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    actionCard: {
        width: "32%",
        backgroundColor: SURFACE,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
    },

    actionText: {
        color: "#fff",
        fontSize: 11,
        marginTop: 6,
        textAlign: "center",
    },


    deleteBtn: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#ef4444",
    },

    deleteText: {
        color: "#ef4444",
        textAlign: "center",
        fontWeight: "bold",
    },

});
