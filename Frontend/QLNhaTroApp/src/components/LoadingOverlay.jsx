import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, View } from 'react-native';

export default function LoadingOverlay({ visible = false, message = 'Đang xử lý...' }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#13c8ec" />
          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    minWidth: 160,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 10,
  },
  message: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
  },
});