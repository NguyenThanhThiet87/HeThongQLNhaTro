import React from "react";
import { Modal, View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";

export default function SelectModal({
    visible,
    onClose,
    data,
    selected,
    onSelect,
    getLabel,
    style,
    itemStyle,
    selectedItemStyle,
    title = "Chọn mục"
}) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={[styles.overlay, style]}>
                <View style={styles.modalBox}>
                    <Text style={styles.title}>{title}</Text>
                    <ScrollView style={styles.scroll}>
                        {data.map((item, idx) => (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    styles.item,
                                    selected === item ? styles.selectedItem : null,
                                    itemStyle,
                                    selected === item && selectedItemStyle
                                ]}
                                onPress={() => {
                                    onSelect(item);
                                    onClose();
                                }}
                            >
                                <Text style={styles.itemText}>{getLabel ? getLabel(item) : item}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0008"
    },
    modalBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        minWidth: 220
    },
    title: {
        marginBottom: 10,
        fontWeight: "bold",
        fontSize: 16,
        color: "#222"
    },
    scroll: {
        maxHeight: 220
    },
    item: {
        padding: 10,
        borderRadius: 6,
        marginBottom: 4,
        backgroundColor: "#fff"
    },
    selectedItem: {
        backgroundColor: "#13c8ec20"
    },
    itemText: {
        color: "#222",
        fontSize: 15
    },
    closeText: {
        color: "red",
        marginTop: 10,
        textAlign: "center",
        fontWeight: "bold"
    }
});