import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../theme/useTheme";

import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RoleCard from "../../components/RoleCard";
import { ROLES } from "../../constants/roles";

export default function RoleSelectionScreen() {
    const navigation = useNavigation();

    const { COLORS } = useTheme();
    const styles = createStyles(COLORS);

    const [role, setRole] = useState(ROLES.CHU_TRO);

    const handleContinue = () => {
        console.log("Selected role:", role);
        if (role === ROLES.CHU_TRO) {
            navigation.navigate("RegisterAccount", { role: ROLES.CHU_TRO });
        } else if (role === ROLES.NHA_CUNG_CAP) {
            navigation.navigate("RegisterAccount", { role: ROLES.NHA_CUNG_CAP });
        }
    };

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                {/* Back */}
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={22} color={COLORS.textMain} />
                    <Text style={styles.backText}>Quay lại</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity>
                    <Text style={styles.support}>Hỗ trợ</Text>
                </TouchableOpacity> */}
            </View>

            {/* Content */}
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Bạn là ai?</Text>
                <Text style={styles.subtitle}>
                    Chọn loại tài khoản để bắt đầu.
                </Text>

                <View style={{ marginTop: 20 }}>
                    <RoleCard
                        value={ROLES.CHU_TRO}
                        icon="apartment"
                        title="Chủ nhà trọ"
                        subtitle="Quản lý"
                        description="Quản lý tài sản, theo dõi thanh toán hàng tháng và xử lý yêu cầu của người thuê."
                        role={role}
                        setRole={setRole}
                    />

                    <RoleCard
                        value={ROLES.NHA_CUNG_CAP}  
                        icon="handyman"
                        title="Nhà cung cấp dịch vụ"
                        subtitle="Dịch vụ"
                        description="Tìm kiếm công việc bảo trì, cung cấp dịch vụ chuyên nghiệp và quản lý thu nhập."
                        role={role}
                        setRole={setRole}
                    />
                </View>
            </ScrollView>

            {/* Bottom */}
            <View style={styles.bottom}>
                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={handleContinue}
                >
                    <Text style={styles.continueText}>Tiếp tục</Text>
                    <MaterialIcons
                        name="arrow-forward"
                        size={18}
                        color={COLORS.buttonText}
                    />
                </TouchableOpacity>
            </View>

        </View>
    );
}

const createStyles = (COLORS) => StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: COLORS.bgLight,
    },

    header: {
        paddingTop: 55,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    back: {
        position: "absolute",
        top: 60,
        left: 20,
        flexDirection: "row",
        alignItems: "center"
    },

    backText: {
        color: COLORS.textMuted,
        marginLeft: 5
    },

    content: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 120
    },

    title: {
        fontSize: 26,
        fontWeight: "bold",
        color: COLORS.textMain,
        marginTop: 20,
    },

    subtitle: {
        color: COLORS.textMuted,
        marginTop: 6
    },

    bottom: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        padding: 20,
        backgroundColor: COLORS.bgLight
    },

    continueBtn: {
        backgroundColor: COLORS.buttonBg,
        paddingVertical: 16,
        borderRadius: 14,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8
    },

    continueText: {
        fontWeight: "bold",
        color: COLORS.buttonText
    },

    note: {
        textAlign: "center",
        fontSize: 12,
        color: COLORS.textMuted,
        marginTop: 12
    }

});
