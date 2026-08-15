import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Định nghĩa bảng màu theo thiết kế của bạn
const COLORS = {
  primary: "#13c8ec",
  bgLight: "#f6f8f8",
  bgDark: "#101f22",
  slate400: "#94a3b8",
  slate600: "#475569",
  borderLight: "#e2e8f0",
  borderDark: "rgba(19, 200, 236, 0.15)",
  cardLight: "#f1f5f9",
  cardDark: "rgba(19, 200, 236, 0.05)",
};

const isDarkMode = true; // Bạn có thể dùng useColorScheme() của RN
const theme = {
  background: isDarkMode ? COLORS.bgDark : COLORS.bgLight,
  text: isDarkMode ? "#f1f5f9" : "#0f172a",
  card: isDarkMode ? COLORS.cardDark : COLORS.cardLight,
  border: isDarkMode ? COLORS.borderDark : COLORS.borderLight,
  inputBg: isDarkMode ? "#0f172a" : "#ffffff",
};

export default function GuiThongBaoHangLoatScreen() {
  const navigation = useNavigation();
  const [targetGroup, setTargetGroup] = useState('all');
  const [sendOption, setSendOption] = useState('now');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Header Section */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Gửi thông báo hàng loạt</Text>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Target Selection Section */}
          <SectionHeader icon="group" title="Chọn đối tượng nhận" />
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.inputGap}>
              <Text style={styles.label}>Dãy trọ</Text>
              {/* Giả lập Dropdown */}
              <TouchableOpacity style={[styles.dropdown, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
                <Text style={{ color: theme.text }}>Tất cả các dãy trọ</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.inputGap}>
              <Text style={styles.label}>Nhóm người nhận</Text>
              <View style={styles.chipContainer}>
                <Chip label="Tất cả" active={targetGroup === 'all'} onPress={() => setTargetGroup('all')} />
                <Chip label="Người đại diện" active={targetGroup === 'rep'} onPress={() => setTargetGroup('rep')} />
                <Chip label="Thành viên" active={targetGroup === 'member'} onPress={() => setTargetGroup('member')} />
              </View>
            </View>
          </View>

          {/* Notification Content Section */}
          <SectionHeader icon="edit-note" title="Nội dung thông báo" />
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.inputGap}>
              <Text style={styles.label}>Tiêu đề</Text>
              <TextInput 
                style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="Nhập tiêu đề thông báo..."
                placeholderTextColor={COLORS.slate400}
              />
            </View>

            <View style={styles.inputGap}>
              <Text style={styles.label}>Nội dung chi tiết</Text>
              <TextInput 
                style={[styles.input, styles.textArea, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
                placeholder="Nhập nội dung chi tiết gửi đến khách thuê..."
                placeholderTextColor={COLORS.slate400}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity style={[styles.attachBtn, { borderColor: isDarkMode ? COLORS.primary + '66' : COLORS.slate400 }]}>
              <MaterialIcons name="attach-file" size={20} color={COLORS.primary} />
              <Text style={styles.attachBtnText}>Đính kèm ảnh/file</Text>
              <Text style={styles.attachSubText}>Tối đa 5MB/file</Text>
            </TouchableOpacity>
          </View>

          {/* Sending Options */}
          <SectionHeader icon="schedule" title="Tùy chọn gửi" />
          <View style={styles.radioGrid}>
            <RadioCard 
              label="Gửi ngay" 
              sub="Gửi lập tức cho khách" 
              selected={sendOption === 'now'} 
              onPress={() => setSendOption('now')} 
            />
            <RadioCard 
              label="Hẹn giờ" 
              sub="Chọn lịch gửi sau" 
              selected={sendOption === 'later'} 
              onPress={() => setSendOption('later')} 
            />
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action Bar */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity style={styles.submitBtn}>
          <MaterialIcons name="send" size={20} color={COLORS.bgDark} />
          <Text style={styles.submitBtnText}>Gửi thông báo</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// --- Sub-components ---
const SectionHeader = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <MaterialIcons name={icon} size={22} color={COLORS.primary} />
    <Text style={[styles.sectionTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
  </View>
);

const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.chip, 
      active ? styles.chipActive : { backgroundColor: isDarkMode ? COLORS.primary + '1a' : '#e2e8f0' }
    ]}
  >
    <Text style={[styles.chipText, { color: active ? COLORS.bgDark : (isDarkMode ? COLORS.primary : COLORS.slate600) }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const RadioCard = ({ label, sub, selected, onPress }) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.radioCard, 
      { backgroundColor: theme.inputBg, borderColor: selected ? COLORS.primary : theme.border }
    ]}
  >
    <View style={[styles.radioCircle, { borderColor: selected ? COLORS.primary : COLORS.slate400 }]}>
      {selected && <View style={styles.radioInner} />}
    </View>
    <View>
      <Text style={[styles.radioLabel, { color: theme.text }]}>{label}</Text>
      <Text style={styles.radioSub}>{sub}</Text>
    </View>
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(19, 200, 236, 0.1)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: -0.5,
  },
  scrollContent: { padding: 16 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16, marginTop: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 16,
  },
  inputGap: { gap: 8 },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.slate400 },
  
  dropdown: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  chipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  chipActive: { backgroundColor: COLORS.primary, elevation: 4, shadowColor: COLORS.primary, shadowOpacity: 0.3, shadowRadius: 5, shadowOffset: { height: 2, width: 0 } },
  chipText: { fontSize: 13, fontWeight: '600' },

  input: { height: 48, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, fontSize: 15 },
  textArea: { height: 120, paddingTop: 12, paddingBottom: 12 },
  
  attachBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    gap: 8,
    marginTop: 4,
  },
  attachBtnText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  attachSubText: { color: COLORS.slate400, fontSize: 11, fontStyle: 'italic', marginLeft: 'auto' },

  radioGrid: { flexDirection: 'row', gap: 12 },
  radioCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    gap: 10,
  },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.primary },
  radioLabel: { fontSize: 14, fontWeight: '700' },
  radioSub: { fontSize: 10, color: COLORS.slate400 },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    shadowOffset: { height: 4, width: 0 },
  },
  submitBtnText: { color: COLORS.bgDark, fontSize: 16, fontWeight: '800' },
});