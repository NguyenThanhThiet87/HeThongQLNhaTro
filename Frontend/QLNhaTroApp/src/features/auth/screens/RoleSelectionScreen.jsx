import React, { useState } from "react";
import styles from "../styles/RoleSelectionScreen_Styles";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import RoleCard from "../../../components/RoleCard";
import { ROLES } from "../../../constants/roles";

export default function RoleSelectionScreen() {
    const navigation = useNavigation();

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
                    <MaterialIcons name="arrow-back" size={22} color="#aaa" />
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
                        color="#101f22"
                    />
                </TouchableOpacity>
            </View>

        </View>
    );
}
