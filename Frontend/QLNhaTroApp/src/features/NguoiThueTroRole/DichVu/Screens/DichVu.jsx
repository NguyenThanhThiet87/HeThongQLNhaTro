import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TextInput, 
  TouchableOpacity, Image, SafeAreaView, StatusBar, useColorScheme
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../../../components/AppHeader';

const COLORS = {
  primary: "#2563eb",
  primaryLight: "#dbeafe",
  bgLight: "#f8f6f6",
  bgDark: "#0f172a",
  cardLight: "#ffffff",
  cardDark: "#1e293b",
  textLight: "#1e293b",
  textDark: "#f1f5f9",
  borderLight: "#e2e8f0",
  borderDark: "#334155",
};

export default function ServiceMapScreen() {
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? COLORS.bgDark : COLORS.bgLight,
    card: isDark ? COLORS.cardDark : COLORS.cardLight,
    text: isDark ? COLORS.textDark : COLORS.textLight,
    border: isDark ? COLORS.borderDark : COLORS.borderLight,
    subText: isDark ? "#94a3b8" : "#64748b",
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <AppHeader
        left={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        center={
          <Text style={[styles.headerTitle, { color: theme.text }]}>Sửa Loại phòng</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={theme.text} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search & Filter */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput 
              placeholder="Tìm đổi gas, sửa điện, nước..." 
              placeholderTextColor="#94a3b8"
              style={[styles.searchInput, { color: theme.text }]}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            <CategoryChip label="Tất cả" active />
            <CategoryChip label="Đổi gas" icon="local-gas-station" />
            <CategoryChip label="Sửa chữa" icon="build" />
            <CategoryChip label="Giao nước" icon="local-drink" />
          </ScrollView>
        </View>

        {/* Map Placeholder Section */}
        <View style={styles.mapSection}>
          <View style={[styles.mapPlaceholder, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
             {/* Mô phỏng các Marker trên bản đồ */}
             <View style={styles.homeMarker}>
                <MaterialIcons name="location-on" size={32} color="#3b82f6" />
                <View style={styles.markerLabel}><Text style={styles.markerLabelText}>Nhà của bạn</Text></View>
             </View>
             <MaterialIcons name="local-gas-station" size={24} color={COLORS.primary} style={{position: 'absolute', top: 40, left: 80}} />
             <MaterialIcons name="build" size={24} color={COLORS.primary} style={{position: 'absolute', bottom: 40, right: 100}} />
             
             <TouchableOpacity style={styles.fullscreenBtn}>
                <MaterialIcons name="fullscreen" size={20} color={theme.text} />
             </TouchableOpacity>
          </View>
          <View style={styles.mapFooter}>
            <View style={styles.nearMe}>
              <MaterialIcons name="near-me" size={14} color="#64748b" />
              <Text style={styles.nearMeText}>12 nhà cung cấp gần bạn</Text>
            </View>
            <TouchableOpacity><Text style={styles.openMapText}>Mở bản đồ lớn</Text></TouchableOpacity>
          </View>
        </View>

        {/* Service List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dịch vụ phổ biến</Text>
            <TouchableOpacity><Text style={styles.seeMore}>Xem thêm</Text></TouchableOpacity>
          </View>

          <ServiceCard 
            image="https://images.unsplash.com/photo-1584263343369-14b55c7ef648?q=80&w=200&h=200&auto=format&fit=crop"
            title="Đổi bình Gas 12kg - PetroVietNam"
            desc="Giao nhanh 15p • Gas chính hãng"
            price="385.000đ"
            oldPrice="410.000đ"
            theme={theme}
          />

          <ServiceCard 
            image="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=200&h=200&auto=format&fit=crop"
            title="Nước tinh khiết Lavie 20L (Bình vòi)"
            desc="Khu vực Quận 10, Quận 3"
            price="65.000đ"
            subDesc="+ cọc bình 50k"
            theme={theme}
          />

          <ServiceCard 
            image="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=200&h=200&auto=format&fit=crop"
            title="Vệ sinh Máy lạnh (Dưới 2HP)"
            desc="Bao gồm kiểm tra gas & bảo hành"
            price="150.000đ"
            isBooking
            theme={theme}
          />
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>

    </SafeAreaView>
  );
}

// Sub-components
const CategoryChip = ({ label, icon, active }) => (
  <TouchableOpacity style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}>
    {icon && <MaterialIcons name={icon} size={18} color={active ? 'white' : '#64748b'} />}
    <Text style={[styles.chipText, { color: active ? 'white' : '#64748b' }]}>{label}</Text>
  </TouchableOpacity>
);

const ServiceCard = ({ image, title, desc, price, oldPrice, subDesc, isBooking, theme }) => (
  <View style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
    <Image source={{ uri: image }} style={styles.serviceImage} />
    <View style={styles.serviceInfo}>
      <View>
        <Text style={[styles.serviceTitle, { color: theme.text }]} numberOfLines={2}>{title}</Text>
        <Text style={styles.serviceDesc} numberOfLines={1}>{desc}</Text>
      </View>
      <View style={styles.serviceFooter}>
        <View>
          <Text style={styles.price}>{price}</Text>
          {oldPrice && <Text style={styles.oldPrice}>{oldPrice}</Text>}
          {subDesc && <Text style={styles.subDesc}>{subDesc}</Text>}
        </View>
        {isBooking ? (
          <TouchableOpacity style={styles.bookingBtn}>
            <Text style={styles.bookingBtnText}>Đặt lịch</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.addBtn}>
            <MaterialIcons name="add" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  iconBtn: { padding: 4 },
  cartBtn: { backgroundColor: 'rgba(37, 99, 235, 0.1)', padding: 10, borderRadius: 12 },
  cartBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: COLORS.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, borderWidth: 2, borderColor: 'white' },
  cartBadgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  searchSection: { padding: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 48, borderRadius: 12, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14 },
  filterContainer: { paddingVertical: 16, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', height: 36, paddingHorizontal: 16, borderRadius: 18, gap: 6 },
  chipActive: { backgroundColor: COLORS.primary },
  chipInactive: { backgroundColor: 'white', borderWidth: 1, borderColor: '#e2e8f0' },
  chipText: { fontSize: 14, fontWeight: '500' },

  mapSection: { paddingHorizontal: 16, marginBottom: 24 },
  mapPlaceholder: { height: 180, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  homeMarker: { alignItems: 'center' },
  markerLabel: { backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: -4 },
  markerLabelText: { fontSize: 10, fontWeight: 'bold' },
  fullscreenBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'white', padding: 8, borderRadius: 10 },
  mapFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  nearMe: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  nearMeText: { fontSize: 12, color: '#64748b' },
  openMapText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },

  listSection: { paddingHorizontal: 16 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800' },
  seeMore: { fontSize: 14, color: '#64748b' },
  serviceCard: { flexDirection: 'row', padding: 12, borderRadius: 16, borderWidth: 1, marginBottom: 12, gap: 12 },
  serviceImage: { width: 90, height: 90, borderRadius: 12 },
  serviceInfo: { flex: 1, justifyContent: 'space-between' },
  serviceTitle: { fontSize: 14, fontWeight: '700', lineHeight: 18 },
  serviceDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  serviceFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '800', color: COLORS.primary },
  oldPrice: { fontSize: 10, color: '#94a3b8', textDecorationLine: 'line-through' },
  subDesc: { fontSize: 10, color: '#64748b' },
  addBtn: { backgroundColor: COLORS.primary, padding: 6, borderRadius: 8 },
  bookingBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  bookingBtnText: { color: 'white', fontSize: 12, fontWeight: 'bold' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, flexDirection: 'row', borderTopWidth: 1, paddingBottom: 20 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navLabel: { fontSize: 10, marginTop: 4 },
  notifDot: { position: 'absolute', top: 2, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 2, borderColor: 'white' }
});