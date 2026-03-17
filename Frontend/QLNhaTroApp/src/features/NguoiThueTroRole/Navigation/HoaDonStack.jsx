import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import HoaDon from "../../../screens/NguoiThueTro/HoaDon/HoaDon";
import ThanhToanHoaDonScreen from "../../../features/NguoiThueTroRole/HoaDon/Screens/ThanhToanHoaDonScreen";
import ThanhToanPayOSScreen from "../../../screens/NguoiThueTro/HoaDon/ThanhToanPayOSScreen";
import ThanhToanVNPayScreen from "../../../features/NguoiThueTroRole/HoaDon/Screens/ThanhToanVNPayScreen";
import ChiTietGiaoDichScreen from "../../../screens/NguoiThueTro/HoaDon/ChiTietGiaoDichScreen";

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name="HoaDon"
            component={HoaDon}
        />
        <Stack.Screen
            name="ThanhToanHoaDon"
            component={ThanhToanHoaDonScreen}
        />
        <Stack.Screen
            name="ThanhToanPayOS"
            component={ThanhToanPayOSScreen}
        />
        <Stack.Screen
            name="ThanhToanVNPay"
            component={ThanhToanVNPayScreen}
        />
        <Stack.Screen
            name="ChiTietGiaoDich"
            component={ChiTietGiaoDichScreen}
        />
      </Stack.Navigator>
  );
}
