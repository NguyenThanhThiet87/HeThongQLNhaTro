import React, { useState } from 'react';
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  useColorScheme,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';

const COLORS = {
  primary: '#13c8ec',
  bgLight: '#f6f8f8',
  bgDark: '#101f22',
  slate100: '#f1f5f9',
  slate800: '#1e293b',
  slate400: '#94a3b8',
  white: '#ffffff',
  black: '#000000',
};

const CauHinhGiaDienNuocScreen = () => {
  const navigation = useNavigation();
  const isDarkMode = false;
  const theme = {
    background: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
    card: isDarkMode ? COLORS.slate800 : COLORS.slate100,
    text: isDarkMode ? '#f1f5f9' : '#0f172a',
    inputBg: isDarkMode ? COLORS.bgDark : COLORS.white,
    border: isDarkMode ? '#334155' : '#cbd5e1',
  };

  const [elecPrice, setElecPrice] = useState('3500');
  const [waterPrice, setWaterPrice] = useState('15000');

  const handleSave = () => {

  }
  // Component cho từng ô nhập liệu
  const InputField = ({ label, value, onChange, placeholder, unit, isSelect }) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      <TouchableOpacity
        activeOpacity={isSelect ? 0.7 : 1}
        style={[styles.inputWrapper, {
          backgroundColor: theme.inputBg,
          borderColor: theme.border
        }]}
      >
        <TextInput
          style={[styles.input, { color: theme.text }]}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.slate400}
          keyboardType="numeric"
          editable={!isSelect}
        />
        {isSelect && (
          <MaterialIcons name="unfold-more" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      
      {/* Header */}
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: theme.text }]}>Cấu hình điện nước</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section: Điện */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="bolt" size={24} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Giá Điện</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialIcons name="electric-bolt" size={30} color={COLORS.primary} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Điện sinh hoạt</Text>
                <Text style={styles.cardSub}>Hiện tại: <Text style={{ color: COLORS.primary, fontWeight: '700' }}>3,500đ/kWh</Text></Text>
              </View>
            </View>

            <InputField label="Giá tiền (VNĐ)" value={elecPrice} onChange={setElecPrice} />
            <InputField label="Đơn vị tính" value="kWh" isSelect />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        {/* Section: Nước */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="water-drop" size={24} color={COLORS.primary} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Giá Nước</Text>
          </View>

          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <MaterialIcons name="faucet" size={30} color={COLORS.primary} />
              </View>
              <View>
                <Text style={[styles.cardTitle, { color: theme.text }]}>Nước sinh hoạt</Text>
                <Text style={styles.cardSub}>Hiện tại: <Text style={{ color: COLORS.primary, fontWeight: '700' }}>15,000đ/m³</Text></Text>
              </View>
            </View>

            <InputField label="Giá tiền (VNĐ)" value={waterPrice} onChange={setWaterPrice} />
            <InputField label="Đơn vị tính" value="m³" isSelect />
          </View>
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, {
        backgroundColor: theme.background,
        borderTopColor: theme.border,
        // Hiệu ứng mờ (backdrop-blur) trên web được thay thế bằng độ đục trên mobile
        opacity: 0.95
      }]}>
        <TouchableOpacity style={styles.saveBtn}>
          <MaterialIcons name="save" size={20} color={COLORS.bgDark} />
          <Text style={styles.saveBtnText}>Lưu cấu hình</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
    headerTitle: { fontSize: 22, fontWeight: '700' },
    iconCircle: { padding: 8, borderRadius: 20 },

  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    paddingVertical: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconBox: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(19, 200, 236, 0.15)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 14,
    color: COLORS.slate400,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
  },
  divider: {
    height: 1,
    marginVertical: 16,
    opacity: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16, // Padding cho iOS home indicator
    borderTopWidth: 1,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  saveBtnText: {
    color: COLORS.bgDark,
    fontSize: 16,
    fontWeight: '800',
  },
});

export default CauHinhGiaDienNuocScreen;