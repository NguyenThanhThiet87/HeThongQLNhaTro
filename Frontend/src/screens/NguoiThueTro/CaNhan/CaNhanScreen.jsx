import React, { useEffect, useState } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { SettingItem } from "../../../components/SettingItem";
import LoadingOverlay from "../../../components/LoadingOverlay";

import { getTenVaiTroNguoiThueByValue } from "../../../constants/VAI_TRO_NGUOI_THUE";
import { useUserNtProfile } from "../../../hooks/user/useUserProfile";
import { useLogout } from "../../../hooks/auth/useLogout";

export default function CaNhanScreen() {
    const { COLORS, isDark, toggleTheme } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();

    const { user, loading: profileLoading } = useUserNtProfile();
    const { handleLogout, loading: logoutLoading } = useLogout();

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 140 }}
            >

                {/* HEADER */}
                <Text style={styles.header}>
                    Tài khoản
                </Text>

                {/* PROFILE CARD */}
                <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate("ThongTinCaNhan", { maNd: user?.maNd })}>

                    <View style={styles.avatarContainer}>
                        <Image
                            source={{
                                uri: user?.avatar || "https://i.pravatar.cc/300"
                            }}
                            style={styles.avatar}
                        />

                        <View style={styles.editIcon}>
                            <MaterialIcons
                                name="edit"
                                size={12}
                                color="#fff"
                            />
                        </View>

                    </View>


                    <View style={{ flex: 1, marginLeft: 14 }}>

                        <Text style={styles.name}>
                            {user?.hoTen}
                        </Text>

                        <View style={styles.roleRow}>

                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>
                                    {getTenVaiTroNguoiThueByValue(user?.vaiTroNguoiThue)}
                                </Text>
                            </View>

                            <Text style={styles.idText}>
                                ID: #{user?.maNt || "xxxxxx"}
                            </Text>

                        </View>

                    </View>


                    <TouchableOpacity>
                        <MaterialIcons
                            name="qr-code"
                            size={22}
                            color="#64748b"
                        />
                    </TouchableOpacity>

                </TouchableOpacity>


                {/* GIAO DỊCH */}
                <Text style={styles.groupTitle}>
                    GIAO DỊCH
                </Text>

                <View style={styles.groupCard}>
                    <SettingItem
                        icon="history"
                        title="Lịch sử giao dịch"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        onHandle={() => navigation.navigate("Bill", { screen: "LichSuGiaoDich" })}
                    />
                    <SettingItem
                        icon="description"
                        title="Hợp đồng của tôi"
                        borderBottom={false}
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        onHandle={() => navigation.navigate("XemChiTietHopDong", { maHopDong: user?.maHopDong })}
                    />
                </View>

                {/* APP SETTINGS */}
                <Text style={styles.groupTitle}>
                    ỨNG DỤNG
                </Text>

                <View style={styles.groupCard}>

                    <SettingItem
                        icon="notifications"
                        title="Thông báo"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                    />

                    <SettingItem
                        icon="lock"
                        title="Bảo mật & Đăng nhập"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        onHandle={() => navigation.navigate("CaiDatBaoMatScreen")}
                    />
                    <SettingItem
                        icon="settings"
                        title="Cài đặt chung"
                        borderBottom={false}
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        onHandle={() => navigation.navigate("CaiDatChungScreen")}
                    />
                </View>

                {/* LOGOUT */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <MaterialIcons
                        name="logout"
                        size={20}
                        color={COLORS.danger}
                    />
                    <Text style={styles.logoutText}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>

                <Text style={styles.version}>
                    Phiên bản 2.4.0 (Build 1042)
                </Text>

            </ScrollView>
            <LoadingOverlay visible={profileLoading || logoutLoading} />
        </View>
    );
}



const createStyles = (COLORS) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        paddingHorizontal: 16,
        paddingTop: 50
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: COLORS.textMain,
        marginBottom: 14
    },


    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: COLORS.card,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 24
    },


    avatarContainer: {
        position: "relative"
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 2,
        borderColor: COLORS.primary
    },

    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center"
    },


    name: {
        color: COLORS.textMain,
        fontSize: 18,
        fontWeight: "bold"
    },

    roleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },

    roleBadge: {
        backgroundColor: COLORS.primaryLight,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    },

    roleText: {
        color: COLORS.primary,
        fontSize: 11,
        fontWeight: "600"
    },

    idText: {
        marginLeft: 8,
        color: COLORS.textMuted,
        fontSize: 11
    },


    groupTitle: {
        color: COLORS.textMain,
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 4,
        marginTop: 10,
        fontWeight: "600"
    },


    groupCard: {
        backgroundColor: COLORS.card,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 20
    },

    logoutBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(239,68,68,0.3)",
        backgroundColor: "rgba(239,68,68,0.1)",
        marginTop: 10
    },

    logoutText: {
        color: COLORS.danger,
        fontWeight: "600",
        marginLeft: 6
    },


    version: {
        textAlign: "center",
        color: "#64748b",
        fontSize: 11,
        marginTop: 14
    }

});
