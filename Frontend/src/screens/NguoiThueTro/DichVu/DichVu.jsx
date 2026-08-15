import React from 'react';
import {
  StyleSheet, View, Text, ScrollView, TextInput,
  TouchableOpacity, Image, SafeAreaView, StatusBar, useColorScheme, Modal
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../../components/AppHeader';
import { getProvidersNearMeService, getTenantHomeService } from '../../../services/dichVuService';
import LoadingOverlay from '../../../components/LoadingOverlay';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth } from '../../../context/AuthContext';

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
  const navigation = useNavigation();
  const { user } = useAuth();
  const [providers, setProviders] = React.useState([]);
  const [homeLocation, setHomeLocation] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('Tất cả');
  const [region, setRegion] = React.useState({
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [selectedProvider, setSelectedProvider] = React.useState(null);
  const [providerModalVisible, setProviderModalVisible] = React.useState(false);
  const isDark = useColorScheme() === 'dark';
  const theme = {
    bg: isDark ? COLORS.bgDark : COLORS.bgLight,
    card: isDark ? COLORS.cardDark : COLORS.cardLight,
    text: isDark ? COLORS.textDark : COLORS.textLight,
    border: isDark ? COLORS.borderDark : COLORS.borderLight,
    subText: isDark ? "#94a3b8" : "#64748b",
  };

  React.useEffect(() => {
    if (user?.maNd) {
      fetchData();
    }
  }, [user?.maNd]);

  const fetchData = async () => {
    setLoading(true);
    const [providersRes, homeRes] = await Promise.all([
      getProvidersNearMeService(),
      getTenantHomeService(user.maNd)
    ]);

    if (providersRes.success) {
      setProviders(providersRes.data);
    }

    if (homeRes.success && homeRes.data) {
      const location = {
        latitude: Number(homeRes.data.viDo),
        longitude: Number(homeRes.data.kinhDo),
      };
      setHomeLocation(location);
      setRegion({
        ...location,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    }
    setLoading(false);
  };

  const allServices = providers.flatMap(p => p.services.map(s => ({ ...s, provider: p })));

  const filteredServices = allServices.filter(s => {
    const matchesSearch = s.tenDv.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.hoTen.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Tất cả' || s.tenDv.includes(activeCategory); // Dynamic enough for now
    return matchesSearch && matchesCategory;
  });

  const categories = ['Tất cả', 'Đổi gas', 'Sửa chữa', 'Giao nước', 'Vệ sinh'];

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
          <Text style={[styles.headerTitle, { color: theme.text }]}>Dịch vụ</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle} onPress={() => navigation.navigate("LichSuDatDichVu")}>
            <MaterialIcons name="history" size={24} color={theme.text} />
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
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContainer}>
            {categories.map(cat => (
              <CategoryChip
                key={cat}
                label={cat}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
                icon={cat === 'Đổi gas' ? 'local-gas-station' : cat === 'Sửa chữa' ? 'build' : cat === 'Giao nước' ? 'local-drink' : null}
              />
            ))}
          </ScrollView>
        </View>

        {/* Interactive Map Section */}
        <View style={styles.mapSection}>
          <View style={[styles.mapPlaceholder, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={region}
              onRegionChangeComplete={setRegion}
              onPress={() => setProviderModalVisible(false)}
            >
              {homeLocation && (
                <Marker
                  coordinate={homeLocation}
                  title="Nhà của bạn"
                  description="Nơi bạn đang ở"
                >
                  <View style={styles.homeMarkerMarker}>
                    <MaterialIcons name="location-on" size={36} color="#3b82f6" />
                  </View>
                </Marker>
              )}

              {providers.map((p, i) => (
                <Marker
                  key={i}
                  coordinate={{ latitude: Number(p.viDo), longitude: Number(p.kinhDo) }}
                  onPress={() => {
                    setSelectedProvider(p);
                    setProviderModalVisible(true);
                  }}
                >
                  <View style={styles.storeMarker}>
                    <MaterialIcons
                      name={p.services?.[0]?.tenDv.includes('Gas') ? 'local-gas-station' : 'store'}
                      size={24}
                      color="white"
                    />
                  </View>
                </Marker>
              ))}
            </MapView>
          </View>
          <View style={styles.mapFooter}>
            <View style={styles.nearMe}>
              <MaterialIcons name="near-me" size={14} color="#64748b" />
              <Text style={styles.nearMeText}>{providers.length} nhà cung cấp gần bạn</Text>
            </View>
            <TouchableOpacity onPress={fetchData}><Text style={styles.openMapText}>Cập nhật vị trí</Text></TouchableOpacity>
          </View>
        </View>

        {/* Service List */}
        <View style={styles.listSection}>
          <View style={styles.listHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Dịch vụ phổ biến</Text>
            <TouchableOpacity onPress={fetchData}><MaterialIcons name="refresh" size={20} color={COLORS.primary} /></TouchableOpacity>
          </View>

          {filteredServices.map((service, index) => (
            <ServiceCard
              key={index}
              image={service.hinhAnh || 'https://via.placeholder.com/200'}
              title={service.tenDv}
              desc={`${service.provider.hoTen} • ${(service.provider.distance / 1000).toFixed(1)}km`}
              price={service.giaTien?.toLocaleString() + 'đ'}
              subDesc={service.donViTinh}
              onPress={() => navigation.navigate("ChiTietDichVu", { serviceId: service.maDv })}
              theme={theme}
            />
          ))}

          {filteredServices.length === 0 && !loading && (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <MaterialIcons name="search-off" size={48} color={theme.border} />
              <Text style={{ color: theme.subText, marginTop: 10 }}>Không tìm thấy dịch vụ nào</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>


      {/* Provider Details Modal (Bottom Sheet style) */}
      <Modal
        visible={providerModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProviderModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setProviderModalVisible(false)}
        >
          <View style={[styles.providerSheet, { backgroundColor: theme.card }]}>
            <View style={styles.sheetHandle} />

            <View style={styles.providerHeader}>
              <Image source={{ uri: selectedProvider?.avatar || 'https://i.pravatar.cc/100' }} style={styles.providerAvatar} />
              <View style={styles.providerInfoTop}>
                <Text style={[styles.providerName, { color: theme.text }]}>{selectedProvider?.hoTen}</Text>
                <View style={styles.ratingRow}>
                  <MaterialIcons name="star" size={16} color="#fbbf24" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>{selectedProvider?.danhGiaTb || '5.0'}</Text>
                  <Text style={styles.distanceText}> • {(selectedProvider?.distance / 1000).toFixed(1)}km</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeSheet} onPress={() => setProviderModalVisible(false)}>
                <MaterialIcons name="close" size={24} color={theme.subText} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.sheetSectionTitle, { color: theme.text }]}>Các dịch vụ cung cấp</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sheetServiceScroll}>
              {selectedProvider?.services?.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[styles.sheetServiceCard, { borderColor: theme.border }]}
                  onPress={() => {
                    setProviderModalVisible(false);
                    navigation.navigate("ChiTietDichVu", { serviceId: s.maDv });
                  }}
                >
                  <Image source={{ uri: s.hinhAnh || 'https://via.placeholder.com/100' }} style={styles.sheetServiceImage} />
                  <Text style={[styles.sheetServiceTitle, { color: theme.text }]} numberOfLines={1}>{s.tenDv}</Text>
                  <Text style={styles.sheetServicePrice}>{s.giaTien?.toLocaleString()}đ</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.viewAllBtn}
              onPress={() => {
                setProviderModalVisible(false);
                // Có thể navigate sang màn hình danh sách dịch vụ của NCC này
              }}
            >
              <Text style={styles.viewAllBtnText}>Xem thông tin chi tiết</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
}

// Sub-components
const CategoryChip = ({ label, icon, active, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, active ? styles.chipActive : styles.chipInactive]}
    onPress={onPress}
  >
    {icon && <MaterialIcons name={icon} size={18} color={active ? 'white' : '#64748b'} />}
    <Text style={[styles.chipText, { color: active ? 'white' : '#64748b' }]}>{label}</Text>
  </TouchableOpacity>
);

const ServiceCard = ({ image, title, desc, price, oldPrice, subDesc, isBooking, theme, onPress }) => (
  <TouchableOpacity
    style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.border }]}
    onPress={onPress}
  >
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
      </View>
    </View>
  </TouchableOpacity>
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
  mapPlaceholder: { height: 280, borderRadius: 24, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  map: { ...StyleSheet.absoluteFillObject },
  homeMarkerMarker: { backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  storeMarker: { backgroundColor: COLORS.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: 'white', elevation: 3 },
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
  notifDot: { position: 'absolute', top: 2, right: 0, width: 8, height: 8, borderRadius: 4, backgroundColor: '#ef4444', borderWidth: 2, borderColor: 'white' },

  // Provider Sheet Styles
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  providerSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 20, paddingBottom: 40 },
  sheetHandle: { width: 40, height: 4, backgroundColor: '#cbd5e1', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  providerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  providerAvatar: { width: 60, height: 60, borderRadius: 30 },
  providerInfoTop: { flex: 1, marginLeft: 16 },
  providerName: { fontSize: 20, fontWeight: 'bold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingText: { fontSize: 14, fontWeight: 'bold', marginLeft: 4 },
  distanceText: { fontSize: 14, color: '#64748b' },
  closeSheet: { padding: 4 },
  sheetSectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  sheetServiceScroll: { gap: 12 },
  sheetServiceCard: { width: 140, borderWidth: 1, borderRadius: 16, padding: 8 },
  sheetServiceImage: { width: '100%', height: 100, borderRadius: 12, marginBottom: 8 },
  sheetServiceTitle: { fontSize: 13, fontWeight: '600' },
  sheetServicePrice: { fontSize: 15, fontWeight: '800', color: COLORS.primary, marginTop: 4 },
  viewAllBtn: { backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 24 },
  viewAllBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});