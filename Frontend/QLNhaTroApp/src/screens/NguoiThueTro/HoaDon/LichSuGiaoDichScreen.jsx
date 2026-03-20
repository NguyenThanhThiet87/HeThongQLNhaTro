import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  FlatList,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DATA = [
  { id: '1', month: '09/2023', date: '02/10/2023', amount: '3.950.000đ', status: 'Thành công' },
  { id: '2', month: '08/2023', date: '04/09/2023', amount: '4.020.000đ', status: 'Thành công' },
  { id: '3', month: '07/2023', date: '01/08/2023', amount: '3.850.000đ', status: 'Thành công' },
  { id: '4', month: '06/2023', date: '05/07/2023', amount: '4.100.000đ', status: 'Thành công' },
];

const PaymentHistory = () => {
  const renderItem = ({ item }) => (
    <View style={styles.historyCard}>
      <View style={styles.cardLeft}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="check-circle" size={24} color="#22c55e" />
        </View>
        <View>
          <Text style={styles.monthText}>Tháng {item.month}</Text>
          <Text style={styles.dateText}>Đã thanh toán: {item.date}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.amountText}>{item.amount}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#f97316" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hóa đơn & Thanh toán</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#f97316" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={styles.tabItem}>
            <Text style={styles.tabTextInactive}>Hóa đơn hiện tại</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItemActive}>
            <Text style={styles.tabTextActive}>Lịch sử thanh toán</Text>
            <View style={styles.activeIndicator} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterSection}>
        <TouchableOpacity style={styles.filterBar}>
          <View style={styles.filterLeft}>
            <MaterialCommunityIcons name="calendar-range" size={20} color="#f97316" />
            <Text style={styles.filterText}>Năm 2023</Text>
          </View>
          <MaterialCommunityIcons name="chevron-down" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <NavItem icon="home-variant-outline" label="Trang chủ" color="#94a3b8" />
        <NavItem icon="receipt" label="Hóa đơn" color="#f97316" active />
        <NavItem icon="comment-text-multiple-outline" label="Tin nhắn" color="#94a3b8" />
        <NavItem icon="account-outline" label="Cá nhân" color="#94a3b8" />
      </View>
    </SafeAreaView>
  );
};

// Sub-component cho Navigation Item
const NavItem = ({ icon, label, color, active }) => (
  <TouchableOpacity style={styles.navItem}>
    <MaterialCommunityIcons name={icon} size={24} color={color} />
    <Text style={[styles.navLabel, { color: color, fontWeight: active ? '700' : '400' }]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  tabContainer: {
    flexDirection: 'row',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabItemActive: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    position: 'relative',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f97316',
  },
  tabTextInactive: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#f97316',
  },
  filterSection: {
    padding: 16,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 },
    }),
  },
  filterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  dateText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  cardRight: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  statusBadge: {
    marginTop: 6,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16a34a',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 88 : 65,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
  },
});

export default PaymentHistory;