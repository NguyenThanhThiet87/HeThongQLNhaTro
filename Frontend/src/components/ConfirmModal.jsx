import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

export default function ConfirmModal({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = "Đồng ý",
    cancelText = "Hủy"
}) {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.5)'
            }}>
                <View style={{
                    backgroundColor: '#fff',
                    padding: 24,
                    borderRadius: 12,
                    width: '80%'
                }}>
                    {title && (
                        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>
                            {title}
                        </Text>
                    )}
                    <Text style={{ marginBottom: 20 }}>
                        {message}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <TouchableOpacity
                            style={{ marginRight: 16 }}
                            onPress={onCancel}
                        >
                            <Text style={{ color: '#888' }}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={onConfirm}
                        >
                            <Text style={{ color: '#06b6d4', fontWeight: 'bold' }}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}