import React, { useState } from 'react';
import {
    StyleSheet, View, Text, ScrollView, TextInput,
    TouchableOpacity, Image, SafeAreaView, StatusBar, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Giả định Dark Mode đang bật
const isDarkMode = true;
const COLORS = {
    primary: "#13c8ec",
    bgLight: "#f6f8f8",
    bgDark: "#101f22",
    slate: {
        200: '#e2e8f0',
        400: '#94a3b8',
        500: '#64748b',
        800: '#1e293b',
    }
};

const theme = {
    bg: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
    text: isDarkMode ? '#ffffff' : '#0f172a',
    card: isDarkMode ? '#1e293b' : '#ffffff',
    input: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
};

export default function TinNhanScreen() {
    const [activeTab, setActiveTab] = useState('Theo Phòng');
    const navigation = useNavigation();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
            
            {/* Header Section */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={18} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>Tin nhắn</Text>
                    <TouchableOpacity style={styles.editBtn}>
                        <MaterialIcons name="edit-note" size={26} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={[styles.searchContainer, { backgroundColor: theme.input }]}>
                    <MaterialIcons name="search" size={20} color={COLORS.slate[400]} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm hội thoại..."
                        placeholderTextColor={COLORS.slate[400]}
                    />
                </View>

                {/* Segmented Control (Tabs) */}
                <View style={[styles.tabContainer, { backgroundColor: theme.input }]}>
                    {['Theo Phòng', 'Theo Dãy', 'Cá nhân'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tabItem,
                                activeTab === tab && { backgroundColor: isDarkMode ? COLORS.primary : '#fff' }
                            ]}
                        >
                            <Text style={[
                                styles.tabText,
                                { color: activeTab === tab ? (isDarkMode ? '#fff' : '#000') : COLORS.slate[500] },
                                activeTab === tab && styles.tabTextActive
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Mass Announcement Button */}
                <TouchableOpacity style={styles.announcementBtn} onPress={() => navigation.navigate("GuiThongBaoHangLoat")}>
                    <MaterialIcons name="campaign" size={24} color="#fff" />
                    <Text style={styles.announcementBtnText}>Gửi thông báo hàng loạt</Text>
                </TouchableOpacity>

                {/* Conversation List */}
                <View style={styles.listContainer}>

                    {/* Item 1: Active/Unread */}
                    <TouchableOpacity style={[styles.convItem, styles.convItemActive]}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarIconBg}>
                                <MaterialIcons name="meeting-room" size={28} color={COLORS.primary} />
                            </View>
                            <View style={styles.onlineStatus} />
                        </View>
                        <View style={styles.convMain}>
                            <View style={styles.convHeader}>
                                <Text style={[styles.convTitle, { color: theme.text }]}>Phòng 302 - Khu A</Text>
                                <Text style={styles.convTimeActive}>Vừa xong</Text>
                            </View>
                            <View style={styles.convFooter}>
                                <Text style={[styles.convMsg, { color: '#cbd5e1', fontWeight: '600' }]} numberOfLines={1}>
                                    Dạ vâng, em đã gửi tiền phòng...
                                </Text>
                                <View style={styles.unreadBadge}>
                                    <Text style={styles.unreadText}>2</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Item 2: Regular */}
                    <TouchableOpacity style={styles.convItem}>
                        <View style={[styles.avatarIconBg, { backgroundColor: COLORS.slate[800] }]}>
                            <MaterialIcons name="home" size={28} color={COLORS.slate[500]} />
                        </View>
                        <View style={styles.convMainBorder}>
                            <View style={styles.convHeader}>
                                <Text style={[styles.convTitle, { color: theme.text }]}>Phòng 105 - Tầng trệt</Text>
                                <Text style={styles.convTime}>14:20</Text>
                            </View>
                            <View style={styles.convFooter}>
                                <Text style={[styles.convMsg, { fontStyle: 'italic' }]} numberOfLines={1}>
                                    Bạn: Đã nhận được yêu cầu sửa nước
                                </Text>
                                <MaterialIcons name="done-all" size={16} color={COLORS.slate[400]} />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Item 3: User Avatar */}
                    <TouchableOpacity style={styles.convItem}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?u=ha' }}
                            style={styles.avatarImg}
                        />
                        <View style={styles.convMainBorder}>
                            <View style={styles.convHeader}>
                                <Text style={[styles.convTitle, { color: theme.text }]}>Nguyễn Thu Hà (P.204)</Text>
                                <Text style={styles.convTime}>Thứ 2</Text>
                            </View>
                            <Text style={styles.convMsg}>Em cảm ơn chủ nhà nhiều ạ!</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 16, paddingBottom: 16, paddingTop: 50 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
    editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(19, 200, 236, 0.1)', justifyContent: 'center', alignItems: 'center' },

    searchContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 40, borderRadius: 12, marginBottom: 16 },
    searchInput: { flex: 1, marginLeft: 8, fontSize: 15, color: '#fff' },

    tabContainer: { flexDirection: 'row', padding: 4, borderRadius: 12 },
    tabItem: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
    tabText: { fontSize: 12, fontWeight: '500' },
    tabTextActive: { fontWeight: '700' },

    scrollContent: { paddingHorizontal: 16 },
    announcementBtn: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20
    },
    announcementBtnText: { color: '#fff', fontWeight: '700', marginLeft: 8, fontSize: 16 },

    listContainer: { gap: 4 },
    convItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16 },
    convItemActive: { backgroundColor: 'rgba(19, 200, 236, 0.1)', borderWidth: 1, borderColor: 'rgba(19, 200, 236, 0.2)' },
    avatarWrapper: { position: 'relative' },
    avatarIconBg: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(19, 200, 236, 0.2)', justifyContent: 'center', alignItems: 'center' },
    avatarImg: { width: 56, height: 56, borderRadius: 28 },
    onlineStatus: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#22c55e', borderWidth: 2, borderColor: COLORS.bgDark },

    convMain: { flex: 1, marginLeft: 14 },
    convMainBorder: { flex: 1, marginLeft: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', paddingBottom: 12 },
    convHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
    convTitle: { fontSize: 16, fontWeight: '700' },
    convTime: { fontSize: 11, color: COLORS.slate[500] },
    convTimeActive: { fontSize: 11, color: COLORS.primary, fontWeight: '600' },
    convFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
    convMsg: { fontSize: 14, color: COLORS.slate[400], flex: 1, marginRight: 8 },

    unreadBadge: { backgroundColor: COLORS.primary, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    unreadText: { color: '#fff', fontSize: 10, fontWeight: '800' },

    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 30 : 15, borderTopWidth: 1 },
    tabItemBottom: { alignItems: 'center', gap: 4 },
    tabLabelBottom: { fontSize: 10 },
    redDot: { position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 1.5, borderColor: COLORS.bgDark },
    homeIndicator: { position: 'absolute', bottom: 8, width: 120, height: 5, backgroundColor: COLORS.slate[800], borderRadius: 3, alignSelf: 'center', left: '40%' }
});