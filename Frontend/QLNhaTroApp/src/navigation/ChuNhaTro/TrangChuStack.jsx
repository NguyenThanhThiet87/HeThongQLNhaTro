import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import DashboardScreen from "../../screens/ChuNhaTro/TrangChu/DashboardScreen";

import PropertyDetailScreen from "../../screens/ChuNhaTro/TrangChu/DayTroScreen";
import ChiTrietDayTroScreen from "../../screens/ChuNhaTro/TrangChu/ChiTrietDayTroScreen";
import GhiDienNuocScreen from "../../screens/ChuNhaTro/TrangChu/GhiDienNuocScreen";
import LichSuDienNuocScreen from "../../screens/ChuNhaTro/TrangChu/LichSuDienNuocScreen";
import TaoDayNhaTroB1Screen from "../../screens/ChuNhaTro/DayNhaTro/TaoDayNhaTroB1Screen";
import TaoDayNhaTroB2Screen from "../../screens/ChuNhaTro/DayNhaTro/TaoDayNhaTroB2Screen";
import TaoDayNhaTroB3Screen from "../../screens/ChuNhaTro/DayNhaTro/TaoDayNhaTroB3Screen";
import ChiTietPhongScreen from "../../screens/ChuNhaTro/TrangChu/ChiTietPhongScreen";
import ThemPhongScreen from "../../screens/ChuNhaTro/DayNhaTro/ThemPhongScreen";
import PhongThietBiScreen from "../../screens/ChuNhaTro/DayNhaTro/PhongThietBiScreen";
import ThongBaoScreen from "../../screens/ChuNhaTro/TrangChu/ThongBaoScreen";
import BaoCaoSuCoScreen from "../../screens/ChuNhaTro/BaoCaoSuCo/BaoCaoSuCoScreen";
import ChiTietBaoCaoSuCoScreen from "../../screens/ChuNhaTro/BaoCaoSuCo/ChiTietSuCoScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DashboardMain"
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
      <Stack.Screen
        name="ThemPhong"
        component={ThemPhongScreen}
      />
      <Stack.Screen
        name="PhongThietBi"
        component={PhongThietBiScreen}
      />
      <Stack.Screen
        name="ThongBao"
        component={ThongBaoScreen}
      />
      <Stack.Screen
        name="BaoCaoSuCo"
        component={BaoCaoSuCoScreen}
      />
      <Stack.Screen
        name="ChiTietBaoCaoSuCo"
        component={ChiTietBaoCaoSuCoScreen}
      />
    </Stack.Navigator>
  );
}
