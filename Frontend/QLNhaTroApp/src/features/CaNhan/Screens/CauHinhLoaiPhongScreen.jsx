import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import { getLoaiPhongApi, deleteLoaiPhongApi } from '../../../api/PhongTro';
import { getCurrentUser } from '../../../utils/decodeToken';
import { formatCurrency } from "../../../utils/formatCurrency";
import ActionConfirmModal from '../../../components/ActionConfirmModal';
import LoadingOverlay from '../../../components/LoadingOverlay';
import toast from "../../../utils/toast";

const COLORS = {
    primary: "#13c8ec",
    bgLight: "#f6f8f8",
    bgDark: "#101f22",
    cardLight: "#ffffff",
    cardDark: "rgba(19, 200, 236, 0.05)", // primary/5
    borderLight: "#e2e8f0", // slate-200
    borderDark: "rgba(19, 200, 236, 0.1)", // primary/10
    textLight: "#0f172a", // slate-900
    textDark: "#f1f5f9", // slate-100
    subTextLight: "#64748b", // slate-500
    subTextDark: "rgba(19, 200, 236, 0.6)", // primary/60
};

const RoomCard = ({ item, isDark, onEdit, onDelete }) => {
    const theme = {
        card: isDark ? COLORS.cardDark : COLORS.cardLight,
        border: isDark ? COLORS.borderDark : COLORS.borderLight,
        text: isDark ? COLORS.textDark : COLORS.textLight,
        subText: isDark ? COLORS.subTextDark : COLORS.subTextLight,
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardContent}>
                <View style={styles.infoArea}>
                    <View>
                        <Text style={[styles.roomTitle, { color: theme.text }]}>{item.tenLoaiP}</Text>
                        <Text style={[styles.roomDesc, { color: theme.subText }]}>
                            {formatCurrency(item.giaChuan)} VNĐ • Tối đa: {item.snguoiToiDa} người
                        </Text>
                    </View>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isDark ? "rgba(19, 200, 236, 0.1)" : "#f1f5f9" }]} onPress={() => onEdit(item)}>
                            <MaterialIcons name="edit" size={14} color={isDark ? COLORS.primary : "#334155"} />
                            <Text style={[styles.actionBtnText, { color: isDark ? COLORS.primary : "#334155" }]}>Sửa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: isDark ? "rgba(239, 68, 68, 0.1)" : "#f1f5f9" }]} onPress={() => onDelete(item.maLoaiP)}>
                            <MaterialIcons name="delete" size={14} color={isDark ? "#f87171" : "#334155"} />
                            <Text style={[styles.actionBtnText, { color: isDark ? "#f87171" : "#334155" }]}>Xóa</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Image source={{ uri:item.urlAnh || "https://res.cloudinary.com/duouljna1/image/upload/v1772871023/quan-ly-nha-tro/loai-phong/mau-phong-tro-co-gac-lung-dep-6.png_gsjlbq.png" }} style={styles.roomThumb} />
            </View>
        </View>
    );
};

export default function CauHinhLoaiPhongScreen() {
    const navigation = useNavigation();
    const isDark = false;

    const theme = {
        bg: isDark ? COLORS.bgDark : COLORS.bgLight,
        header: isDark ? COLORS.bgDark : COLORS.bgLight,
        border: isDark ? "rgba(19, 200, 236, 0.2)" : COLORS.borderLight,
        text: isDark ? COLORS.textDark : COLORS.textLight,
    };
    const [loading, setLoading] = useState(false);

    const [loaiPhongList, setLoaiPhongList] = useState([]);

    const loadLoaiPhong = useCallback(async () => {
        const user = await getCurrentUser();

        const result = await getLoaiPhongApi(user.maNd);
        if (result.success) {
            console.log("Danh sách loại phòng:", result.data);
            setLoaiPhongList(result.data);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadLoaiPhong();
        }, [loadLoaiPhong])
    );

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedMaLP, setSelectedMaLP] = useState(null);

    const handleDelete = (maLP) => {
        setSelectedMaLP(maLP);
        setShowDeleteModal(true);
    }

    const handleConfirmDelete = async (maLP) => {
        setLoading(true);
        const result = await deleteLoaiPhongApi(maLP);
        if (result.success) {
            loadLoaiPhong();
            setShowDeleteModal(false);
            toast.success("Xóa loại phòng thành công!");
        }else
        {
            toast.error("Xóa loại phòng thất bại!"+result.message);
        }
        setLoading(false);
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            {/* Header */}
            <AppHeader
                left={
                    <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back" size={24} color={theme.text} />
                    </TouchableOpacity>
                }
                center={
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Cấu hình Loại phòng</Text>
                }
                right={
                    <TouchableOpacity style={styles.iconCircle}>
                        <MaterialIcons name="search" size={24} color={theme.text} />
                    </TouchableOpacity>
                }
                isDark={false}
            />

            {/* Main List */}
            <ScrollView contentContainerStyle={styles.listPadding}>
                {loaiPhongList.map((item) => (
                    <RoomCard key={item.maLoaiP} item={item} isDark={isDark} onEdit={() => navigation.navigate("SuaLoaiPhong", { maLoaiP: item.maLoaiP })} onDelete={()=>handleDelete(item.maLoaiP)}/>
                ))}
            </ScrollView>

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("ThemLoaiPhong")}>
                <MaterialIcons name="add" size={32} color={COLORS.bgDark} />
            </TouchableOpacity>

            <ActionConfirmModal
                visible={showDeleteModal}
                type="delete"
                title="Xóa loại phòng?"
                message="Hành động này không thể hoàn tác."
                requiredText="detroy"
                yesText="Xóa"
                noText="Hủy"
                onNo={() => setShowDeleteModal(false)}
                onYes={async () => {
                    handleConfirmDelete(selectedMaLP);
                }}
            />
            <LoadingOverlay visible={loading} />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

    listPadding: { padding: 16, paddingBottom: 100 },

    card: {
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardContent: { flexDirection: 'row', padding: 16, gap: 16 },
    infoArea: { flex: 1, justifyContent: 'space-between' },
    roomTitle: { fontSize: 16, fontWeight: '700' },
    roomDesc: { fontSize: 13, marginTop: 4 },

    actionRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8
    },
    actionBtnText: { fontSize: 12, fontWeight: '600' },
    roomThumb: { width: 90, height: 90, borderRadius: 12 },

    fab: {
        position: 'absolute',
        right: 24,
        bottom: 100,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },

    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        height: 64,
        borderTopWidth: 1,
        paddingBottom: 8,
    },
    navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    navLabel: { fontSize: 10, fontWeight: '500', marginTop: 2 },
});