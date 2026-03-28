import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch,
  StatusBar,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../../../components/AppHeader';
import { useUserProviderProfile } from '../../../hooks/user/useUserProviderProfile';
import { useProductManagement } from '../../../hooks/product/useProductManagement';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import ConfirmModal from '../../../components/ConfirmModal';
import { getDonHangStatsService } from '../../../services/donHangService';
import LoadingOverlay from '../../../components/LoadingOverlay';


const { width } = Dimensions.get('window');

// Bảng màu theo thiết kế của bạn
const COLORS = {
  primary: '#ec5b13',
  bgLight: '#f8f6f6',
  bgDark: '#221610',
  cardDark: '#1e293b', // slate-900
  textDark: '#0f172a', // slate-900
  textLight: '#f1f5f9', // slate-100
  textGray: '#64748b', // slate-500
  border: '#e2e8f0',
  borderDark: '#334155',
  success: '#22c55e',
};

const QLCuaHangScreen = () => {
  const navigation = useNavigation();
  const { user } = useUserProviderProfile();
  const { products, loading, refresh, updateStatus } = useProductManagement(user?.maNcc);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({ newOrders: 0, todayRevenue: 0 });

  useFocusEffect(
    useCallback(() => {
      if (user?.maNcc) {
        refresh();
        fetchStats();
      }
    }, [user?.maNcc])
  );

  const fetchStats = async () => {
    const res = await getDonHangStatsService(user.maNcc);
    if (res.success) {
      setStats(res.data);
    }
  };

  const handleToggleStatus = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const confirmToggle = async () => {
    if (selectedProduct) {
      const newStatus = selectedProduct.ttcungCap === 'Sẵn sàng' ? 'Hết hàng' : 'Sẵn sàng';
      await updateStatus(selectedProduct.maDv, newStatus);
    }
    setModalVisible(false);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <AppHeader
        left={<></>
        }
        center={
          <Text style={[styles.headerTitle, { color: COLORS.textMain }]}>Cửa hàng</Text>
        }
        right={
          <TouchableOpacity style={styles.iconCircle}>
            <MaterialIcons name="search" size={24} color={COLORS.textMain} />
          </TouchableOpacity>
        }
        isDark={false}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Store Info Section */}
        <View style={styles.storeCard}>
          <View style={styles.storeInfoRow}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: user?.avatar || 'https://via.placeholder.com/150' }}
                style={styles.storeLogo}
              />
            </View>
            <View style={styles.storeTextContent}>
              <Text style={styles.storeName}>{user?.hoTen || 'Đang tải...'}</Text>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={14} color={COLORS.textGray} />
                <Text style={styles.locationText} numberOfLines={1}>{user?.khuVucPv || 'Chưa cập nhật địa chỉ'}</Text>
              </View>
              <View style={styles.activeStatus}>
                <View style={[styles.statusDot, { backgroundColor: user?.sanSang ? COLORS.success : COLORS.textGray }]} />
                <Text style={[styles.statusText, { color: user?.sanSang ? COLORS.success : COLORS.textGray }]}>
                  {user?.sanSang ? 'Đang hoạt động' : 'Tạm nghỉ'}
                </Text>
              </View>
            </View>

          </View>
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate("Profile", {
              screen: "ThayDoiThongTinCaNhan",
              params: { maNd: user?.maNcc }
            })}
          >

            <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>

        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate("DonHang")}
          >
            <Text style={styles.statLabel}>Đơn hàng mới</Text>
            <Text style={styles.statValue}>{stats.newOrders}</Text>
          </TouchableOpacity>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Doanh thu ngày</Text>
            <Text style={styles.statValue}>{stats.todayRevenue?.toLocaleString()}đ</Text>
          </View>
          <View style={[styles.statItem, styles.statItemLarge]}>
            <Text style={styles.statLabel}>Sản phẩm</Text>
            <Text style={styles.statValue}>{products?.length || 0}</Text>
          </View>
        </View>

        {/* Product List Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh sách sản phẩm</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("ThemSanPham")}
          >
            <MaterialIcons name="add" size={20} color="white" />
            <Text style={styles.addBtnText}>Thêm</Text>
          </TouchableOpacity>

        </View>

        {/* Product List */}
        {products && products.length > 0 ? (
          products.map((item) => (
            <View key={item.maDv} style={[styles.productCard, item.ttcungCap !== 'Sẵn sàng' && styles.outOfStockCard]}>
              <Image
                source={{ uri: item.hinhAnh || 'https://via.placeholder.com/150' }}
                style={styles.productImg}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.tenDv}</Text>
                <Text style={styles.productDesc} numberOfLines={1}>{item.moTaCt || 'Không có mô tả'}</Text>
                <Text style={styles.productPrice}>{formatPrice(item.giaTien)} / {item.donViTinh}</Text>
              </View>
              <View style={styles.productActions}>
                <View style={styles.switchRow}>
                  <Switch
                    trackColor={{ false: '#cbd5e1', true: COLORS.primary }}
                    thumbColor="white"
                    value={item.ttcungCap === 'Sẵn sàng'}
                    onValueChange={() => handleToggleStatus(item)}
                  />
                  <Text style={[styles.switchText, item.ttcungCap !== 'Sẵn sàng' && { color: COLORS.textGray }]}>
                    {item.ttcungCap === 'Sẵn sàng' ? 'Còn' : 'Hết'}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate("SuaSanPham", { product: item })}>
                  <MaterialIcons name="edit-note" size={24} color={COLORS.textGray} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="inventory-2" size={48} color={COLORS.border} />
            <Text style={styles.emptyText}>Chưa có sản phẩm nào</Text>
          </View>
        )}
      </ScrollView>

      <ConfirmModal
        visible={modalVisible}
        title="Xác nhận đổi trạng thái"
        message={`Bạn có chắc chắn muốn đổi trạng thái sản phẩm sang "${selectedProduct?.ttcungCap === 'Sẵn sàng' ? 'Hết hàng' : 'Sẵn sàng'}" không?`}
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmToggle}
        confirmText="Đồng ý"
        cancelText="Hủy"
      />

      <LoadingOverlay visible={loading} />
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitle: { fontSize: 22, fontWeight: '700' },
  iconCircle: { padding: 8, borderRadius: 20 },

  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  storeCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  storeInfoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ffedd5',
    overflow: 'hidden',
  },
  storeLogo: {
    width: '100%',
    height: '100%',
  },
  storeTextContent: {
    flex: 1,
    justifyContent: 'center',
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.success,
  },
  editProfileBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editProfileText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statItem: {
    width: (width - 32 - 12) / 2 - 2, // Tính toán để fit 2 cột
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statItemLarge: {
    width: '100%', // Mobile thường để sản phẩm tràn hàng hoặc item thứ 3 tràn hàng
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textGray,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  productCard: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  outOfStockCard: {
    opacity: 0.6,
  },
  productImg: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  productDesc: {
    fontSize: 12,
    color: COLORS.textGray,
    marginVertical: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  productActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  switchRow: {
    alignItems: 'center',
  },
  switchText: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: -2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 5,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textGray,
    fontWeight: '600',
    marginTop: 4,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textGray,
    fontWeight: '500',
  },
});

export default QLCuaHangScreen;