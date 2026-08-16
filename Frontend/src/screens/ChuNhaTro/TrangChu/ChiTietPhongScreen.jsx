import React, { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";
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
import AppHeader from "../../../components/AppHeader";
import { formatCurrency } from "../../../utils/formatCurrency";
import { TEN_TRANG_THAI_PHONG } from "../../../constants/TRANG_THAI_PHONG";
import { formatDate } from "../../../utils/formatNgaySinh";

const PRIMARY = "#13c8ec";

export default function ChiTietPhongScreen({ navigation, route }) {
    const { id } = route.params;
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const [phongTro, setPhongTro] = React.useState(null);
    const [hopDong, setHopDong] = React.useState(null);

    useFocusEffect(
        useCallback(() => {
            const fetchPhongTro = async () => {
                const result = await getPhongTroApi(id);
                setPhongTro(result.data.phong);
                setHopDong(result.data.hopDongThue);
            };
            fetchPhongTro();
        }, [id])
    );

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
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Chi tiết phòng </Text>
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
                            {formatCurrency(phongTro?.giaThucTe || 0)}đ
                        </Text>

                        <Text style={styles.priceUnit}>
                            / tháng
                        </Text>
                    </View>

                </View>


                {/* REPRESENTATIVE */}
                {phongTro?.tenTrangThaiPhong != TEN_TRANG_THAI_PHONG.TRONG ? (
                    <>
                        <Text style={styles.sectionLabel}>
                            NGƯỜI ĐẠI DIỆN
                        </Text>

                        <TouchableOpacity style={styles.cardRow} onPress={() => navigation.navigate("Profile", { screen: "HopDong", params: { screen: "HoSo", params: { maNd: hopDong?.dsNguoiThue?.[0]?.maNt } } })}>

                            <Image
                                source={{
                                    uri: hopDong?.dsNguoiThue?.[0]?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuAt-hCj1pvF0fy3E-NHIRTbXu1dM7lI8zIhZFQUCxd9OBnPpMy2jAIxUEYSHancflb33RVgZ8avWLIq6cQ6hm1YLMPFRc7eX_yOu0Wd8BgYYf744ecMYMRoCU2xEzjfcZfgNoyiQBHkKWWnf8-JVkvzxon-e-CtISTESiZyNCal9rFejFVtUqrSksF6JCCLmnWWJxvKlLZ2nHKP1oRzpXxSIro3Sw4dqTpoeuRsz3MFhx69QA306P2RfFa8uyMvT8Lwc6pLdHuGcu8",
                                }}
                                style={styles.repAvatar}
                            />

                            <View style={{ flex: 1 }}>
                                <Text style={styles.repName}>
                                    {hopDong?.dsNguoiThue?.[0]?.hoTen}
                                </Text>

                                <Text style={styles.repRole}>
                                    Người ký hợp đồng
                                </Text>
                            </View>

                            <TouchableOpacity style={styles.callBtn}>
                                <MaterialIcons name="phone" size={20} color={PRIMARY} />
                            </TouchableOpacity>

                        </TouchableOpacity>


                        <Text style={styles.sectionLabel}>
                            DANH SÁCH NGƯỜI Ở
                        </Text>

                        <View style={styles.card}>
                            {
                                hopDong?.dsNguoiThue
                                    ?.filter((_, index) => index !== 0)
                                    .map((item, index) => person(
                                        item.hoTen || `Người thuê thứ ${index + 2}`,
                                        item.avatar || ""
                                    ))
                            }
                        </View>

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
                                        {formatDate(hopDong?.ngayBdhl) || "Chưa xác định"} - {formatDate(hopDong?.ngayKthl) || "Chưa xác định"}
                                    </Text>
                                </View>

                                <TouchableOpacity style={styles.contractBtn} onPress={() => navigation.navigate("Profile", { screen: "HopDong", params: { screen: "ChiTietHopDong", params: { maHopDong: hopDong?.maHopDong } } })}>
                                    <Text style={styles.contractBtnText}>
                                        Xem chi tiết
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.progress}>
                                <View style={styles.progressFill} />
                            </View>

                        </View>
                    </>
                ) : null}


                {/* EQUIPMENT */}

                <TouchableOpacity style={styles.equipmentBtn} onPress={() => navigation.navigate("PhongThietBi", { maPhong: phongTro?.maPhong, maDayNt: phongTro?.maDayNt })}>

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
                    <TouchableOpacity style={styles.actionCard} key={"them-nguoi"} onPress={() => navigation.navigate("Profile", { screen: "HopDong", params: { screen: "TaoHopDongB1", params: { maDayNtParam: phongTro?.maDayNt, maPhongParam: phongTro.maPhong } } })}>
                        <MaterialIcons name="person-add" size={24} color={PRIMARY} />
                        <Text style={styles.actionText}>Thêm người</Text>
                    </TouchableOpacity>

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


const createStyles = (COLORS) => StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    scroll: {
        paddingVertical: 16,
        paddingBottom: 100,
        paddingHorizontal: 16,
    },

    card: {
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    cardRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: COLORS.cardSelectedBg,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderColor: COLORS.border,
        borderWidth: 1,
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
        color: COLORS.textMain,
    },

    roomMeta: {
        color: COLORS.textMuted,
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
        fontSize: 15,
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
        color: COLORS.textMuted,
    },


    sectionLabel: {
        color: COLORS.textMain,
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
        color: COLORS.textMain,
        fontWeight: "bold",
    },

    repRole: {
        color: COLORS.textMuted,
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
        borderColor: COLORS.border,
        borderWidth: 1,
        padding: 8,
        borderRadius: 12,
        backgroundColor: COLORS.cardSelectedBg,
    },

    personAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 10,
        backgroundColor: COLORS.border,
    },

    personName: {
        color: COLORS.textMain,
    },


    contractRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    contractLabel: {
        color: COLORS.textMuted,
        fontSize: 10,
    },

    contractDate: {
        color: COLORS.textMain,
        fontWeight: "bold",
    },

    contractBtn: {
        backgroundColor: COLORS.buttonBg,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },

    contractBtnText: {
        color: COLORS.buttonText,
        fontSize: 12,
        fontWeight: "bold",
    },


    progress: {
        height: 6,
        backgroundColor: COLORS.border,
        borderRadius: 999,
    },

    progressFill: {
        width: "66%",
        height: "100%",
        backgroundColor: COLORS.buttonBg,
        borderRadius: 999,
    },


    equipmentBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },


    equipmentText: {
        color: COLORS.buttonText,
        fontWeight: "bold",
    },


    actionGrid: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 20,
    },

    actionCard: {
        width: "32%",
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        alignItems: "center",
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    actionText: {
        color: COLORS.textMain,
        fontSize: 11,
        marginTop: 6,
        textAlign: "center",
    },


    deleteBtn: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.danger,
    },

    deleteText: {
        color: COLORS.danger,
        textAlign: "center",
        fontWeight: "bold",
    },

});
