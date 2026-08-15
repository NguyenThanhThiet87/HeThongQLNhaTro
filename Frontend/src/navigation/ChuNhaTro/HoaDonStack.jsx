import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import BillScreen from "../../screens/ChuNhaTro/HoaDon/BillScreen";
import ChiTietHoaDonScreen from "../../screens/ChuNhaTro/HoaDon/ChiTietHoaDonScreen";
import GhiDienNuocScreen from "../../screens/ChuNhaTro/HoaDon/GhiDienNuocScreen";
import ChiTietGiaoDichScreen from "../../screens/ChuNhaTro/HoaDon/ChiTietGiaoDichScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="BillMain"
        component={BillScreen}
      />
      <Stack.Screen
        name="ChiTietHoaDon"
        component={ChiTietHoaDonScreen}
      />
      <Stack.Screen
        name="GhiDienNuoc"
        component={GhiDienNuocScreen}
      />
      <Stack.Screen
        name="ChiTietGiaoDich"
        component={ChiTietGiaoDichScreen}
      />
    </Stack.Navigator>

  );
}
