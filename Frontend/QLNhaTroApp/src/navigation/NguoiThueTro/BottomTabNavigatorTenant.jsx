import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../theme/useTheme";

import { KeyboardAvoidingView, Platform } from "react-native";

import DichVuStack from "./DichVuStack";
import HoaDonStack from "./HoaDonStack";
import CaNhanStack from "./CaNhanStack";
import TrangChuStack from "./TrangChuStack";

const Tab = createBottomTabNavigator();


export default function BottomTabNavigatorTenant() {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <>
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
          component={DichVuStack}
          options={{ tabBarLabel: "Dịch vụ" }}
        />

        <Tab.Screen
          name="Profile"
          component={CaNhanStack}
          options={{ tabBarLabel: "Cá nhân" }}
        />
      </Tab.Navigator>
    </>
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
