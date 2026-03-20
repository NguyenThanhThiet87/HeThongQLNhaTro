import React, { useState } from 'react';
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

const { width } = Dimensions.get('window');

const LapBaoCaoSuCoScreen = () => {

  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const [selectedDevice, setSelectedDevice] = useState('air-con');
  const [urgency, setUrgency] = useState('low');

  const devices = [
    { id: 'air-con', name: 'Máy lạnh', icon: 'air-conditioner', color: '#3b82f6', bg: '#eff6ff' },
    { id: 'fridge', name: 'Tủ lạnh', icon: 'fridge-outline', color: '#f97316', bg: '#fff7ed' },
    { id: 'water', name: 'Vòi nước', icon: 'water-pump', color: '#14b8a6', bg: '#f0fdfa' },
    { id: 'light', name: 'Đèn trần', icon: 'lightbulb-on-outline', color: '#eab308', bg: '#fefce8' },
  ];

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
          <Text style={styles.sectionTitle}>CHỌN THIẾT BỊ HƯ HỎNG</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deviceList}>
            {devices.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedDevice(item.id)}
                style={[
                  styles.deviceCard,
                  selectedDevice === item.id && styles.deviceCardActive
                ]}
              >
                <View style={[styles.iconCircle, { backgroundColor: item.bg }]}>
                  <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
                </View>
                <Text style={styles.deviceName}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MÔ TẢ CHI TIẾT</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Vui lòng mô tả tình trạng hư hỏng của thiết bị..."
            placeholderTextColor={COLORS.inputTextDisabled}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Evidence Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HÌNH ẢNH/VIDEO MINH CHỨNG</Text>
          <View style={styles.evidenceGrid}>
            <TouchableOpacity style={styles.addButton}>
              <MaterialCommunityIcons name="plus" size={32} color={COLORS.inputTextDisabled} />
              <Text style={styles.addButtonText}>Thêm ảnh</Text>
            </TouchableOpacity>

            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: 'https://via.placeholder.com/150' }}
                style={styles.evidenceImage}
              />
              <TouchableOpacity style={styles.deleteImageBtn}>
                <MaterialCommunityIcons name="close" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Urgency Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MỨC ĐỘ KHẨN CẤP</Text>
          <View style={styles.urgencyContainer}>
            <UrgencyOption
              label="Thấp"
              type="low"
              activeColor="#dcfce7"
              textColor="#15803d"
              current={urgency}
              onSelect={setUrgency}
            />
            <UrgencyOption
              label="Trung bình"
              type="medium"
              activeColor="#fef9c3"
              textColor="#a16207"
              current={urgency}
              onSelect={setUrgency}
            />
            <UrgencyOption
              label="Cao"
              type="high"
              activeColor="#fee2e2"
              textColor="#b91c1c"
              current={urgency}
              onSelect={setUrgency}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Gửi báo cáo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Component con cho lựa chọn mức độ khẩn cấp
const UrgencyOption = ({ label, type, activeColor, textColor, current, onSelect }) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);
  const isActive = current === type;
  return (
    <TouchableOpacity
      onPress={() => onSelect(type)}
      style={[
        styles.urgencyBtn,
        isActive && { backgroundColor: activeColor, borderColor: activeColor }
      ]}
    >
      <Text style={[styles.urgencyText, isActive && { color: textColor }]}>
        {label}
      </Text>
    </TouchableOpacity>
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
});

export default LapBaoCaoSuCoScreen;