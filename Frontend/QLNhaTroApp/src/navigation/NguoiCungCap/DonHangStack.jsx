import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DonHangScreen from "../../screens/NguoiCungCap/DonHang/DonHangScreen";
import LapDonHangScreen from "../../screens/NguoiCungCap/DonHang/LapDonHangScreen";
import ChiTietDonHangScreen from "../../screens/NguoiCungCap/DonHang/ChiTietDonHangScreen";

const Stack = createNativeStackNavigator();

export default function DonHangStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DonHangMain"
        component={DonHangScreen}
      />
      <Stack.Screen
        name="LapDonHang"
        component={LapDonHangScreen}
      />
      <Stack.Screen
        name="ChiTietDonHang"
        component={ChiTietDonHangScreen}
      />
    </Stack.Navigator>
  );
}
