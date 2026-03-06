import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Modal,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

const PRIMARY = "#13c8ec";
const BG = "#101f22";
const CARD = "#16282c";
const NEUTRAL = "#1a2e32";

export default function GhiDienNuocScreen() {
    const navigation = useNavigation();
    const [selectedRoom, setSelectedRoom] = useState("P.101");
    const [cameraVisible, setCameraVisible] = useState(false);
    const [lightboxVisible, setLightboxVisible] = useState(false);

    const rooms = ["P.101", "P.102", "P.103", "P.104", "P.105"];

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity
                        style={styles.back}
                        onPress={() => navigation.goBack()}
                    >
                        <MaterialIcons name="arrow-back-ios" size={20} color="#aaa" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <MaterialIcons name="apartment" size={22} color={PRIMARY} />
                        <View>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Text style={styles.houseName}>Nhà trọ Bình An</Text>
                                <MaterialIcons name="expand-more" size={18} color="#aaa" />
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.historyBtn} onPress={()=> navigation.navigate("LichSuDienNuoc")}>
                        <MaterialIcons name="history" size={22} color={PRIMARY} />
                    </TouchableOpacity>
                </View>

                {/* ROOM TABS */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {rooms.map((r) => (
                        <TouchableOpacity
                            key={r}
                            onPress={() => setSelectedRoom(r)}
                            style={[
                                styles.roomTab,
                                selectedRoom === r && styles.roomTabActive,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.roomTabText,
                                    selectedRoom === r && { color: "#000" },
                                ]}
                            >
                                {r}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 180 }}
            >
                {/* ELECTRIC CARD */}
                <MeterCard
                    type="electric"
                    title="Chỉ số Điện"
                    oldValue="1,250"
                    newValue="1325"
                    consumption="75 kWh"
                    captured
                    onCamera={() => setCameraVisible(true)}
                    onThumbnail={() => setLightboxVisible(true)}
                />

                {/* WATER CARD */}
                <MeterCard
                    type="water"
                    title="Chỉ số Nước"
                    oldValue="450"
                    newValue=""
                    consumption="0 m³"
                />

                {/* INFO */}
                <View style={styles.infoBox}>
                    <MaterialIcons name="info" size={18} color={PRIMARY} />
                    <Text style={styles.infoText}>
                        Nhập số mới trực tiếp hoặc dùng Camera để quét. Sau khi chụp, nhấn
                        vào ảnh thu nhỏ để kiểm tra lại.
                    </Text>
                </View>
            </ScrollView>

            {/* BOTTOM ACTION */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.saveBtn}>
                    <MaterialIcons name="save" size={20} color="#000" />
                    <Text style={styles.saveText}>LƯU {selectedRoom}</Text>
                </TouchableOpacity>
            </View>

            {/* CAMERA MODAL */}
            <Modal visible={cameraVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <Text style={{ color: "#fff" }}>Camera Overlay (Mock)</Text>
                    <TouchableOpacity onPress={() => setCameraVisible(false)}>
                        <Text style={{ color: PRIMARY, marginTop: 20 }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* LIGHTBOX */}
            <Modal visible={lightboxVisible} animationType="fade">
                <View style={styles.modalContainer}>
                    <Image
                        source={{
                            uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBf8CMfeT46sTKtKObbOKcgnzJEp1x8PRzdcBPT7xG0TJ0Ki5DzOCWYMMVFwsTwIMLnAKwfRZF_RByjzrjOeDEenVdND2b-qBwIMamaCAtk7n_7eAmgCW_mWbEQ7E0G_UUUq-626hSX65ijoHHzZJ4tcLoeISoqoGqJegnot8WlZVnGKzrwLL2Er8Jv3VyK9xhNLpYT0qUPXwq1WjOdF7mGG1xkYwLwOYdifi2iYeDmAYnMA67nYT8kU7juysrwk2BSCdnAMZTFPeM",
                        }}
                        style={{ width: 300, height: 400, borderRadius: 16 }}
                    />
                    <TouchableOpacity
                        style={{ marginTop: 20 }}
                        onPress={() => setLightboxVisible(false)}
                    >
                        <Text style={{ color: PRIMARY }}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}
function MeterCard({
    type,
    title,
    oldValue,
    newValue,
    consumption,
    captured,
    onCamera,
    onThumbnail,
}) {
    const isElectric = type === "electric";

    return (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <View
                        style={[
                            styles.iconBox,
                            { backgroundColor: isElectric ? "#facc1520" : "#3b82f620" },
                        ]}
                    >
                        <MaterialIcons
                            name={isElectric ? "bolt" : "water-drop"}
                            size={18}
                            color={isElectric ? "#facc15" : "#3b82f6"}
                        />
                    </View>
                    <Text style={styles.cardTitle}>{title}</Text>
                </View>

                <View
                    style={[
                        styles.statusBadge,
                        captured ? styles.badgeGreen : styles.badgeGray,
                    ]}
                >
                    <MaterialCommunityIcons
                        name={captured ? "check-circle" : "image-off"}
                        size={14}
                        color={captured ? "#22c55e" : "#aaa"}
                    />
                    <Text
                        style={{
                            fontSize: 10,
                            color: captured ? "#22c55e" : "#aaa",
                            fontWeight: "bold",
                        }}
                    >
                        {captured ? "ĐÃ CHỤP ẢNH" : "CHƯA CHỤP"}
                    </Text>
                </View>
            </View>

            <View style={styles.grid}>
                <View style={styles.inputBox}>
                    <Text style={styles.label}>Số cũ</Text>
                    <View style={styles.oldValueBox}>
                        <Text style={{ color: "#aaa", fontSize: 20 }}>{oldValue}</Text>
                    </View>
                </View>

                <View style={styles.inputBox}>
                    <Text style={[styles.label, isElectric && { color: PRIMARY }]}>
                        Số mới
                    </Text>
                    <TextInput
                        style={[
                            styles.input,
                            isElectric && { borderColor: PRIMARY, color: PRIMARY },
                        ]}
                        keyboardType="numeric"
                        placeholder="Nhập số"
                        placeholderTextColor="#666"
                        value={newValue}
                    />
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity
                    style={[
                        styles.cameraBtn,
                        !captured && { backgroundColor: "#2c3e50" },
                    ]}
                    onPress={onCamera}
                >
                    <MaterialIcons name="photo-camera" size={18} color="#000" />
                    <Text style={{ fontWeight: "bold" }}>CHỤP ẢNH</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.thumbnail}
                    onPress={onThumbnail}
                />
            </View>

            <View style={styles.footer}>
                <View style={styles.consumption}>
                    <Text style={{ fontSize: 11, color: PRIMARY }}>TIÊU THỤ:</Text>
                    <Text style={{ fontWeight: "bold", color: PRIMARY }}>
                        {consumption}
                    </Text>
                </View>
                <Text style={styles.date}>Chốt: 05/10/2023</Text>
            </View>
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
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#ffffff10",
    },

    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },

    houseName: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 22,
    },

    roomTab: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 999,
        backgroundColor: NEUTRAL,
        marginRight: 8,
    },

    roomTabActive: {
        backgroundColor: PRIMARY,
    },

    roomTabText: {
        color: "#aaa",
        fontWeight: "600",
    },

    card: {
        backgroundColor: CARD,
        marginVertical: 16,
        padding: 16,
        borderRadius: 16,
    },

    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },

    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },

    badgeGreen: { backgroundColor: "#22c55e20" },
    badgeGray: { backgroundColor: "#ffffff10" },

    grid: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },

    inputBox: { flex: 1 },

    label: {
        fontSize: 11,
        color: "#aaa",
        marginBottom: 4,
    },

    oldValueBox: {
        backgroundColor: "#ffffff10",
        borderRadius: 8,
        padding: 12,
        height: 56,
        justifyContent: "center",
    },

    input: {
        borderWidth: 1,
        borderColor: "#ffffff20",
        borderRadius: 8,
        padding: 12,
        height: 56,
        color: "#fff",
    },

    actionRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
        gap: 8,
    },

    cameraBtn: {
        flex: 1,
        flexDirection: "row",
        gap: 6,
        backgroundColor: PRIMARY,
        padding: 12,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    thumbnail: {
        width: 48,
        height: 48,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: PRIMARY,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
    },

    consumption: {
        flexDirection: "row",
        gap: 6,
        backgroundColor: PRIMARY + "20",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },

    date: {
        fontSize: 11,
        color: "#777",
        fontStyle: "italic",
    },

    infoBox: {
        flexDirection: "row",
        gap: 8,
        margin: 16,
        padding: 12,
        backgroundColor: PRIMARY + "10",
        borderRadius: 12,
    },

    infoText: {
        fontSize: 12,
        color: "#aaa",
        flex: 1,
    },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: BG,
        borderTopWidth: 1,
        borderTopColor: "#ffffff10",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    saveBtn: {
        backgroundColor: PRIMARY,
        padding: 10,
        borderRadius: 16,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
    },

    saveText: {
        fontWeight: "bold",
        color: "#000",
    },

    modalContainer: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
});
