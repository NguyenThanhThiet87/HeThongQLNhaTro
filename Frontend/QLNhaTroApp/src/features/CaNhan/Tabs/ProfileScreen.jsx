import React, { useEffect, useState } from "react";
import {useNavigation} from "@react-navigation/native";

import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { getNguoiDungApi } from "../../../api/NguoiDung";
import { getCurrentUser } from "../../../utils/decodeToken";
import { getTenRole } from "../../../constants/roles";
import * as SecureStore from "expo-secure-store";
import { ActivityIndicator } from "react-native";
const PRIMARY = "#13c8ec";
const BG_DARK = "#101f22";
const SURFACE = "#162a2e";
const BORDER = "#1f3a40";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            const response = await getNguoiDungApi(user.maNd);
            if (response.success) {
                console.log("Thông tin người dùng:", response.data);
                setUser(response.data);
            } else
                console.log("Lỗi lấy thông tin người dùng:", response.message);
        };
        fetchData();
    }, []);

    const handleLogout = async () => {
        setLoading(true);
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");

        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }]
        });
        setLoading(false);
    };

    const SettingItem = ({
        icon,
        title,
        subtitle,
        color = "#64748b",
        bg = "rgba(255,255,255,0.05)",
        borderBottom = true
    }) => (
        <TouchableOpacity
            style={[
                styles.settingItem,
                borderBottom && styles.settingBorder
            ]}
            activeOpacity={0.7}
        >

            <View style={[styles.settingIcon, { backgroundColor: bg }]}>
                <MaterialIcons
                    name={icon}
                    size={20}
                    color={color}
                />
            </View>

            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                    {title}
                </Text>

                {subtitle && (
                    <Text style={styles.settingSubtitle}>
                        {subtitle}
                    </Text>
                )}
            </View>

            <MaterialIcons
                name="chevron-right"
                size={20}
                color="#64748b"
            />

        </TouchableOpacity>
    );


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
                <View style={styles.profileCard}>

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
                            {user?.hoTen || "Nguyễn Văn A"}
                        </Text>

                        <View style={styles.roleRow}>

                            <View style={styles.roleBadge}>
                                <Text style={styles.roleText}>
                                    {getTenRole(user?.maVaiTro)}
                                </Text>
                            </View>

                            <Text style={styles.idText}>
                                ID: #{user?.maNguoiDung || "xxxxxx"}
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

                </View>


                {/* MANAGEMENT */}
                <Text style={styles.groupTitle}>
                    QUẢN LÝ CHUNG
                </Text>

                <View style={styles.groupCard}>

                    <SettingItem
                        icon="bolt"
                        title="Cấu hình giá Điện/Nước"
                        subtitle="Thiết lập đơn giá theo khu vực"
                        color={PRIMARY}
                        bg="rgba(19,200,236,0.15)"
                    />

                    <SettingItem
                        icon="handyman"
                        title="Nhà cung cấp dịch vụ"
                        subtitle="Internet, Vệ sinh, Bảo vệ"
                        color="#f97316"
                        bg="rgba(249,115,22,0.15)"
                    />

                    <SettingItem
                        icon="bar-chart"
                        title="Báo cáo chi tiết"
                        subtitle="Doanh thu, Công nợ, Lợi nhuận"
                        color="#22c55e"
                        bg="rgba(34,197,94,0.15)"
                    />

                    <SettingItem
                        icon="description"
                        title="Hợp đồng mẫu"
                        subtitle="Soạn thảo và quản lý mẫu"
                        color="#a855f7"
                        bg="rgba(168,85,247,0.15)"
                        borderBottom={false}
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
                    />

                    <SettingItem
                        icon="lock"
                        title="Bảo mật & Đăng nhập"
                        borderBottom={false}
                    />

                </View>


                {/* LOGOUT */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} disabled={loading}>
                    <MaterialIcons
                        name="logout"
                        size={20}
                        color={loading ? "#94a3b8" : "#ef4444"}
                    />
                    {loading ? (
                        <ActivityIndicator size="small" color="#94a3b8" style={{ marginLeft: 6 }} />
                    ) : 
                    (
                        <Text style={styles.logoutText}>
                            Đăng xuất
                        </Text>
                    )}

                </TouchableOpacity>


                <Text style={styles.version}>
                    Phiên bản 2.4.0 (Build 1042)
                </Text>


            </ScrollView>

        </View>
    );
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: BG_DARK,
        paddingHorizontal: 16,
        paddingTop: 50
    },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 14
    },


    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: SURFACE,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
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
        borderColor: PRIMARY
    },

    editIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: PRIMARY,
        width: 18,
        height: 18,
        borderRadius: 9,
        justifyContent: "center",
        alignItems: "center"
    },


    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold"
    },

    roleRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4
    },

    roleBadge: {
        backgroundColor: "rgba(19,200,236,0.2)",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10
    },

    roleText: {
        color: PRIMARY,
        fontSize: 11,
        fontWeight: "600"
    },

    idText: {
        marginLeft: 8,
        color: "#94a3b8",
        fontSize: 11
    },


    groupTitle: {
        color: "#94a3b8",
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 4,
        marginTop: 10
    },


    groupCard: {
        backgroundColor: SURFACE,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: BORDER,
        marginBottom: 20
    },


    settingItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14
    },

    settingBorder: {
        borderBottomWidth: 1,
        borderBottomColor: BORDER
    },

    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center"
    },

    settingContent: {
        flex: 1,
        marginLeft: 12
    },

    settingTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500"
    },

    settingSubtitle: {
        color: "#94a3b8",
        fontSize: 12,
        marginTop: 2
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
        color: "#ef4444",
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
