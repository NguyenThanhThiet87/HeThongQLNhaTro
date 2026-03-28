import React from "react";
import { useTheme } from "../../theme/useTheme";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


import CuaHangStack from "./CuaHangStack";
import CaNhanStack from "./CaNhanStack";
import DonHangStack from "./DonHangStack";
import DoanhThuStack from "./DoanhThuStack";



const Tab = createBottomTabNavigator();

export default function BottomTabNavigatorProvider() {
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
              icon = "receipt-long";
              break;
            case "Bill":
              icon = "storefront";
              break;
            case "Services":
              icon = "event-note";
              break;
            case "Contract":
              icon = "analytics";
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
        component={DonHangStack}
        options={{ tabBarLabel: "Đơn hàng" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate("Dashboard", { screen: "DonHangMain" });
          },
        })}
      />


      <Tab.Screen
        name="Bill"
        component={CuaHangStack}
        options={{
          tabBarLabel: "Cửa hàng",
          unmountOnBlur: true
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate("Bill", { screen: "BillMain" });
          },
        })}
      />



      <Tab.Screen
        name="Contract"
        component={DoanhThuStack}
        options={{ tabBarLabel: "Doanh thu" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            navigation.navigate("Contract", { screen: "DoanhThuMain" });
          },
        })}
      />


      <Tab.Screen
        name="Profile"
        component={CaNhanStack}
        options={{ tabBarLabel: "Cá nhân" }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
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
