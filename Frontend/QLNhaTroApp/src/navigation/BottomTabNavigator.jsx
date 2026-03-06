import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import DashboardScreen from "../features/TrangChu/Tabs/DashboardScreen";
import HopDongStack from "./HopDongStack";
import HoaDonStack from "./HoaDonStack";
import ProfileScreen from "../features/CaNhan/Tabs/ProfileScreen";
import TrangChuStack from "./TrangChuStack";

const Tab = createBottomTabNavigator();

const PRIMARY = "#13c8ec";
const SURFACE = "#1a2c30";

export default function BottomTabNavigator() {

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarStyle: styles.tabBar,

        tabBarActiveTintColor: PRIMARY,
        tabBarInactiveTintColor: "#888",

        tabBarIcon: ({ color, size }) => {

          let icon;

          switch (route.name) {
            case "Dashboard":
              icon = "dashboard";
              break;
            case "Bill":
              icon = "receipt";
              break;
            case "Tenant":
              icon = "apartment";
              break;
            case "Profile":
              icon = "person";
              break;
          }

          return <MaterialIcons name={icon} size={size} color={color} />;
        },

      })}
    >

      <Tab.Screen
        name="Dashboard"
        component={TrangChuStack}
        options={{ tabBarLabel: "Trang chủ" }}
      />

      <Tab.Screen
        name="Bill"
        component={HoaDonStack}
        options={{ tabBarLabel: "Hóa đơn" }}
      />

      <Tab.Screen
        name="Tenant"
        component={HopDongStack}
        options={{ tabBarLabel: "Hợp đồng" }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Cá nhân" }}
      />

    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({

  tabBar: {
    backgroundColor: SURFACE,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
  },

});
