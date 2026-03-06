import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BillScreen from "../features/HoaDon/Tabs/BillScreen";
import ChiTietHoaDonScreen from "../features/HoaDon/Screens/ChiTietHoaDonScreen";
import GhiDienNuocScreen from "../features/HoaDon/Screens/GhiDienNuocScreen";
import QuetChiSoScreen from "../features/HoaDon/Screens/QuetChiSoScreen";
import HoSo from "../features/NguoiThue/Screen/HoSo";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={BillScreen}
      />
      <Stack.Screen
        name="ChiTietHoaDon"
        component={ChiTietHoaDonScreen}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Ngăn mặc định
            e.preventDefault();
            // Reset stack về màn hình đầu tiên
            navigation.navigate('HoaDon', {
              screen: 'HomeMain', // tên screen đầu tiên trong stack
            });
          },
        })}
      />
      <Stack.Screen
        name="GhiDienNuoc"
        component={GhiDienNuocScreen}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Ngăn mặc định
            e.preventDefault();
            // Reset stack về màn hình đầu tiên
            navigation.navigate('HoaDon', {
              screen: 'HomeMain', // tên screen đầu tiên trong stack
            });
          },
        })}
      />
      <Stack.Screen
        name="TestCamera"
        component={QuetChiSoScreen}
      />
      <Stack.Screen
        name="HoSo"
        component={HoSo}
        listeners={({ navigation, route }) => ({
          tabPress: e => {
            // Ngăn mặc định
            e.preventDefault();
            // Reset stack về màn hình đầu tiên
            navigation.navigate('HoaDon', {
              screen: 'HomeMain', // tên screen đầu tiên trong stack
            });
          },
        })}
      />
    </Stack.Navigator>

  );
}
