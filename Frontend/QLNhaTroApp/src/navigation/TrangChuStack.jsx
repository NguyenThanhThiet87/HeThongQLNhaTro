import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../features/TrangChu/Tabs/DashboardScreen";

import PropertyDetailScreen from "../features/TrangChu/Screens/DayTroScreen";
import ChiTrietDayTroScreen from "../features/TrangChu/Screens/ChiTrietDayTroScreen";
import GhiDienNuocScreen from "../features/TrangChu/Screens/GhiDienNuocScreen";
import LichSuDienNuocScreen from "../features/TrangChu/Screens/LichSuDienNuocScreen";
import TaoDayNhaTroB1Screen from "../features/DayNhaTro/Screens/TaoDayNhaTroB1Screen";
import TaoDayNhaTroB2Screen from "../features/DayNhaTro/Screens/TaoDayNhaTroB2Screen";
import TaoDayNhaTroB3Screen from "../features/DayNhaTro/Screens/TaoDayNhaTroB3Screen";
import ChiTietPhongScreen from "../features/TrangChu/Screens/ChiTietPhongScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={DashboardScreen}
      />

      <Stack.Screen
        name="PropertyDetail"
        component={PropertyDetailScreen}
      />

      <Stack.Screen
        name="ChiTietDayTro"
        component={ChiTrietDayTroScreen}
      />

      <Stack.Screen
        name="GhiDienNuoc"
        component={GhiDienNuocScreen}
      />
      
      <Stack.Screen
        name="LichSuDienNuoc"
        component={LichSuDienNuocScreen}
      />

      <Stack.Screen
        name="TaoDayNhaTroB1"
        component={TaoDayNhaTroB1Screen}
      />
      <Stack.Screen
        name="TaoDayNhaTroB2"
        component={TaoDayNhaTroB2Screen}
      />

      <Stack.Screen
        name="TaoDayNhaTroB3"
        component={TaoDayNhaTroB3Screen}
      />
      <Stack.Screen
        name="ChiTietPhong"
        component={ChiTietPhongScreen}
      />
    </Stack.Navigator>

  );
}
