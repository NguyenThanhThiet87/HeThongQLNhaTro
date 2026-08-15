import React from "react";
import { useTheme } from "../../theme/useTheme";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


import HopDongStack from "./HopDongStack";
import HoaDonStack from "./HoaDonStack";
import CaNhanStack from "./CaNhanStack";
import TrangChuStack from "./TrangChuStack";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigatorOwner() {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarStyle: styles.tabBar,

        tabBarActiveTintColor: COLORS.primary,
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
            case "Contract":
              icon = "assignment";
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
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Dashboard", { screen: "DashboardMain" });
          },
        })}
      />

      <Tab.Screen
        name="Bill"
        component={HoaDonStack}
        options={{
          tabBarLabel: "Hóa đơn",
          unmountOnBlur: true
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Bill", { screen: "BillMain" });
          },
        })}
      />

      <Tab.Screen
        name="Contract"
        component={HopDongStack}
        options={{ tabBarLabel: "Hợp đồng" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Contract", { screen: "ContractMain" });
          },
        })}
      />

      <Tab.Screen
        name="Profile"
        component={CaNhanStack}
        options={{ tabBarLabel: "Cá nhân" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Profile", { screen: "Profile" });
          },
        })}
      />

    </Tab.Navigator>
  );
}

const createStyles = (COLORS) => StyleSheet.create({

  tabBar: {
    backgroundColor: COLORS.bgLight,
    borderTopWidth: 0,
    height: 65,
    paddingBottom: 8,
  },

});
