import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../theme/useTheme";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
    StatusBar
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getTenRoleByValue } from "../../../constants/roles";
import LoadingOverlay from "../../../components/LoadingOverlay";
import { SettingItem } from "../../../components/SettingItem";
import { useUserCntProfile } from "../../../hooks/user/useUserOwnerProfile";
import { useLogout } from "../../../hooks/auth/useLogout";
import { FONT_SIZES, FONT_WEIGHTS } from "../../../theme/typography";

export default function ProfileScreen() {
    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const navigation = useNavigation();
    const { user, loading: profileLoading } = useUserCntProfile();
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
                <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate("ThongTinCaNhan", { maNd: user?.maChuNt })}>

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
                                    {getTenRoleByValue(user?.maVaiTro)}
                                </Text>
                            </View>

                            <Text style={styles.idText}>
                                ID: #{user?.maNguoiDung || user?.maChuNt || user?.maNd || "xxxxxx"}
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


                {/* MANAGEMENT */}
                <Text style={styles.groupTitle}>
                    QUẢN LÝ CHUNG
                </Text>

                <View style={styles.groupCard}>

                    <SettingItem
                        icon="handyman"
                        title="Cấu hình loại phòng"
                        subtitle="Thiết lập loại phòng"
                        color="#f97316"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        bg="rgba(249,115,22,0.15)"
                        onHandle={() => navigation.navigate("CauHinhLoaiPhong")}
                    />

                    <SettingItem
                        icon="bar-chart"
                        title="Báo cáo chi tiết"
                        subtitle="Doanh thu, Công nợ, Lợi nhuận"
                        color="#22c55e"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        bg="rgba(34,197,94,0.15)"
                    />

                    <SettingItem
                        icon="description"
                        title="Hợp đồng"
                        subtitle="Tạo và quản lý hợp đồng thuê"
                        color="#a855f7"
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        bg="rgba(168,85,247,0.15)"
                        borderBottom={false}
                        onHandle={() => navigation.navigate("HopDong")}
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
                        colorTitle={COLORS.textMain}
                        colorBorder={COLORS.border}
                        onHandle={() => navigation.navigate("CaiDatChungScreen")}
                        borderBottom={false}
                    />
                </View>


                {/* LOGOUT */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={logoutLoading}>
                    <MaterialIcons
                        name="logout"
                        size={20}
                        color="#ef4444"
                    />
                    <Text style={styles.logoutText}>
                        Đăng xuất
                    </Text>
                </TouchableOpacity>


                <Text style={styles.version}>
                    Phiên bản 2.4.0 (Build 1042)
                </Text>


            </ScrollView>

            <LoadingOverlay visible={logoutLoading} />
        </View>
    );
}



const createStyles = (COLORS) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40) : 40,
    },

    header: {
        fontSize: FONT_SIZES.header,
        fontWeight: FONT_WEIGHTS.bold,
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
