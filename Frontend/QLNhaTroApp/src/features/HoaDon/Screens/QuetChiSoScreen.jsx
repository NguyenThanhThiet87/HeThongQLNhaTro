import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#13c8ec',
  backgroundDark: '#101f22',
  overlay: 'rgba(16, 31, 34, 0.7)',
};

const QuetChiSoScreen = () => {
  const [facing, setFacing] = useState('back');

  // Animation cho đường quét (Scan Line)
  const scanAnim = useRef(new Animated.Value(0)).current;
  // Animation cho số đang nhảy (Pulse)
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const [hasPermission, setHasPermission] =useCameraPermissions();

  useEffect(() => {
    // Xin quyền camera
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Chạy vòng lặp đường quét lên xuống
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Chạy hiệu ứng nhấp nháy cho kết quả
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (width - 64) * 0.56], // 16:9 ratio height
  });

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Đang kiểm tra quyền camera...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ color: '#fff', textAlign: 'center', marginTop: 50 }}>Không có quyền truy cập camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Camera Feed */}
      <CameraView style={styles.cameraFeed} facing={facing} />

      <View style={styles.cameraOverlayBlur} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconBtn, { marginRight: 12 }]}>
              <MaterialIcons name="flash-on" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <MaterialIcons name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanContainer}>
          <View style={styles.frame}>
            {/* Corners */}
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            {/* Scan Line */}
            <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />

            {/* Pulsating Number */}
            <View style={styles.focusArea}>
              <Animated.View style={[styles.numberBadge, { opacity: pulseAnim }]}>
                <Text style={styles.detectedNumber}>00284.5</Text>
              </Animated.View>
            </View>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionMain}>Đang quét chỉ số...</Text>
          <Text style={styles.instructionSub}>Đưa camera sát vào mặt đồng hồ</Text>
        </View>

        {/* Bottom Sheet Result */}
        <View style={styles.bottomSheet}>
          <View style={styles.dragHandle} />

          <View style={styles.resultHeader}>
            <View style={styles.aiTag}>
              <Text style={styles.aiTagText}>KẾT QUẢ NHẬN DIỆN AI</Text>
            </View>
            <Text style={styles.finalNumber}>00284.5</Text>
            <Text style={styles.infoText}>Chỉ số điện tháng 10</Text>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.primaryBtn}>
              <MaterialIcons name="check-circle" size={20} color={COLORS.backgroundDark} />
              <Text style={styles.primaryBtnText}>Dùng kết quả này</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryBtn}>
              <MaterialIcons name="refresh" size={20} color="white" />
              <Text style={styles.secondaryBtnText}>Quét lại</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundDark },
  cameraFeed: { ...StyleSheet.absoluteFillObject },
  cameraOverlayBlur: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(16, 31, 34, 0.4)' },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerRight: { flexDirection: 'row' },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  frame: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.primary,
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },

  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  focusArea: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  numberBadge: {
    backgroundColor: 'rgba(19, 200, 236, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(19, 200, 236, 0.3)',
  },
  detectedNumber: {
    color: COLORS.primary,
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Platform' === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 4,
  },

  instructionBox: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  instructionMain: { color: 'white', fontSize: 14, fontWeight: '500', opacity: 0.9 },
  instructionSub: { color: 'white', fontSize: 12, opacity: 0.6, marginTop: 4 },

  bottomSheet: {
    backgroundColor: 'rgba(16, 31, 34, 0.98)',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(19, 200, 236, 0.2)',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  resultHeader: { alignItems: 'center', marginBottom: 32 },
  aiTag: {
    backgroundColor: 'rgba(19, 200, 236, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  aiTagText: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  finalNumber: { color: 'white', fontSize: 44, fontWeight: 'bold', letterSpacing: 4 },
  infoText: { color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4 },

  buttonGroup: { gap: 12 },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryBtnText: { color: COLORS.backgroundDark, fontWeight: 'bold', fontSize: 16 },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 8,
  },
  secondaryBtnText: { color: 'white', fontWeight: '600', fontSize: 16 },
});

export default QuetChiSoScreen;