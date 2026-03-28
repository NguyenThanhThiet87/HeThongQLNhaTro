import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LoadingOverlay({ visible = false, message = 'Đang xử lý...' }) {
  if (!visible) return null;

  return (
    <View style={styles.fullScreenOverlay}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#13c8ec" />
          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 9999, // Đảm bảo nằm trên cùng của Stack
    elevation: 9999,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)', // Giảm độ mờ để nhìn mượt hơn
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    gap: 10,
    // Đổ bóng cho đẹp
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
  },
  message: {
    fontSize: 14,
    color: '#334155',
    textAlign: 'center',
    fontWeight: '500'
  },
});