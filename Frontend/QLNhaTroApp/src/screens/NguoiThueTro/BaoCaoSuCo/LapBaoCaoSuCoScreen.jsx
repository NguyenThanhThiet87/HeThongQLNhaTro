import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

import AppHeader from '../../../components/AppHeader';
import { useTheme } from '../../../theme/useTheme';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getPhongThietBiApi, guiBaoCaoSuCoApi } from "../../../api/SuCo";
import { useAuth } from '../../../context/AuthContext';
import LoadingOverlay from '../../../components/LoadingOverlay';


const { width } = Dimensions.get('window');

const LapBaoCaoSuCoScreen = ({ route, navigation }) => {
  const { maPhong } = route.params || {}; // Lấy mã phòng từ params nếu có
  console.log("maPhong", maPhong)

  const { user } = useAuth();

  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const [selectedDevices, setSelectedDevices] = useState([]);
  const [devices, setDevices] = useState([]);

  const toggleDevice = (device) => {
    const isSelected = selectedDevices.some(d => d.maThBi === device.maThBi);
    if (isSelected) {
      setSelectedDevices(selectedDevices.filter(d => d.maThBi !== device.maThBi));
    } else {
      setSelectedDevices([...selectedDevices, { ...device, description: '', media: [] }]);
    }
  };

  const updateDeviceDescription = (maThBi, text) => {
    setSelectedDevices(selectedDevices.map(d =>
      d.maThBi === maThBi ? { ...d, description: text } : d
    ));
  };

  const pickMedia = async (maThBi) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh/video để tải lên!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setSelectedDevices(selectedDevices.map(d =>
        d.maThBi === maThBi ? { ...d, media: [...d.media, { uri: asset.uri, type: asset.type }] } : d
      ));
    }
  };

  const removeMedia = (maThBi, mediaIndex) => {
    setSelectedDevices(selectedDevices.map(d => {
      if (d.maThBi === maThBi) {
        const newMedia = [...d.media];
        newMedia.splice(mediaIndex, 1);
        return { ...d, media: newMedia };
      }
      return d;
    }));
  };

  useEffect(() => {
    const fetchThietBis = async () => {
      const res = await getPhongThietBiApi(maPhong);
      if (res.success) {
        console.log(res.data)
        setDevices(res.data);
      }
    };
    fetchThietBis();
  }, [maPhong]);

  const [loading, setLoading] = useState(false);

  const handleSendReport = async () => {
    console.log("=== Gửi báo cáo ===");
    console.log("User ID:", user?.maNd);
    console.log("Mã phòng:", maPhong);
    console.log("Danh sách thiết bị:", selectedDevices.length);

    if (selectedDevices.length === 0) {
      alert("Vui lòng chọn ít nhất một thiết bị để báo cáo!");
      return;
    }

    const hasEmptyDescription = selectedDevices.some(d => !d.description.trim());
    if (hasEmptyDescription) {
      alert("Vui lòng nhập mô tả cho tất cả các thiết bị đang báo cáo!");
      return;
    }

    try {
      setLoading(true);
      const res = await guiBaoCaoSuCoApi(user.maNd, maPhong, selectedDevices);

      console.log("API Response:", res);

      if (res.success) {
        alert("Gửi báo cáo sự cố thành công!");
        navigation.goBack();
      } else {
        alert("Lỗi khi gửi báo cáo: " + res.message);
      }
    } catch (error) {
      console.error("Handle send report error:", error);
      alert("Có lỗi xảy ra khi kết nối máy chủ! " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Báo cáo sự cố</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Device Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CHỌN CÁC THIẾT BỊ HƯ HỎNG ({selectedDevices.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deviceList}>
            {devices?.map((item) => {
              const isActive = selectedDevices.some(d => d.maPhongThietBi === item.maPhongThietBi);
              return (
                <TouchableOpacity
                  key={item.maPhongThietBi}
                  onPress={() => toggleDevice(item)}
                  style={[
                    styles.deviceCard,
                    isActive && styles.deviceCardActive
                  ]}
                >
                  <View style={[styles.iconCircle, { backgroundColor: item.bg || '#F5F5F5' }]}>
                    <Image source={{ uri: item.anhThietBi }} style={styles.deviceImage} />
                  </View>
                  <Text style={styles.deviceName}>{item.tenThietBi}</Text>
                  {isActive && (
                    <View style={styles.activeBadge}>
                      <MaterialIcons name="check-circle" size={16} color="#F05223" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Dynamic Detail Sections for each selected device */}
        {selectedDevices.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="information-outline" size={48} color={COLORS.inputTextDisabled} />
            <Text style={styles.emptyText}>Vui lòng chọn ít nhất một thiết bị để báo cáo</Text>
          </View>
        ) : (
          selectedDevices.map((device, devIdx) => (
            <View key={device.maPhongThietBi} style={styles.deviceReportCard}>
              <View style={styles.deviceHeader}>
                <View style={[styles.miniIcon, { backgroundColor: device.bg || '#F5F5F5' }]}>
                  <Image source={{ uri: device.anhThietBi }} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text style={styles.deviceReportTitle}>{device.tenThietBi}</Text>
                <TouchableOpacity onPress={() => toggleDevice(device)}>
                  <MaterialIcons name="close" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>

              {/* Description for this specific device */}
              <View style={styles.subSection}>
                <Text style={styles.subTitle}>MÔ TẢ CHI TIẾT</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder={`Mô tả tình trạng của ${device.tenThBi}...`}
                  placeholderTextColor={COLORS.inputTextDisabled}
                  multiline
                  numberOfLines={3}
                  value={device.description}
                  onChangeText={(text) => updateDeviceDescription(device.maThBi, text)}
                  textAlignVertical="top"
                />
              </View>

              {/* Evidence for this specific device */}
              <View style={styles.subSection}>
                <Text style={styles.subTitle}>HÌNH ẢNH/VIDEO MINH CHỨNG</Text>
                <View style={styles.evidenceGrid}>
                  <TouchableOpacity style={styles.addButton} onPress={() => pickMedia(device.maThBi)}>
                    <MaterialCommunityIcons name="video-plus" size={24} color={COLORS.inputTextDisabled} />
                    <Text style={[styles.addButtonText, { fontSize: 8 }]}>Thêm</Text>
                  </TouchableOpacity>

                  {device.media.map((m, mIdx) => (
                    <View key={mIdx} style={styles.imageWrapper}>
                      {m.type === 'video' ? (
                        <View style={styles.videoThumbnailPlaceholder}>
                          <MaterialCommunityIcons name="play-circle" size={32} color="#F05223" />
                        </View>
                      ) : (
                        <Image source={{ uri: m.uri }} style={styles.evidenceImage} />
                      )}
                      <TouchableOpacity
                        style={styles.deleteImageBtn}
                        onPress={() => removeMedia(device.maThBi, mIdx)}
                      >
                        <MaterialCommunityIcons name="close" size={14} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))
        )}

      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={handleSendReport}
          disabled={loading}
        >

          <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
        </TouchableOpacity>
      </View>
      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};

const createStyles = (COLORS) => StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  deviceList: {
    flexDirection: 'row',
  },
  deviceCard: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  deviceCardActive: {
    borderColor: '#F05223',
    backgroundColor: '#FFF5F2',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    overflow: 'hidden', // Để ảnh không bị tràn ra ngoài vệt bo tròn
  },
  deviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  deviceName: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMain,
  },
  textArea: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    fontSize: 14,
    minHeight: 100,
    color: COLORS.textMain,
  },
  evidenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  addButton: {
    width: (width - 32 - 24) / 3,
    height: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 10,
    color: COLORS.inputTextDisabled,
    fontWeight: '600',
    marginTop: 4,
  },
  imageWrapper: {
    width: (width - 32 - 24) / 3,
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
  },
  videoThumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteImageBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: COLORS.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  urgencyBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  urgencyText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 10 },
    }),
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  deviceReportCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 },
    }),
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  miniIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  deviceReportTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
  },
  subSection: {
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LapBaoCaoSuCoScreen;