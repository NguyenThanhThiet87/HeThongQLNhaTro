import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import DichVu from "../../screens/NguoiThueTro/DichVu/DichVu";
import ChiTietDichVu from "../../screens/NguoiThueTro/DichVu/ChiTietDichVu";
import XacNhanDatDichVu from "../../screens/NguoiThueTro/DichVu/XacNhanDatDichVuScreen";
import LichSuDatDichVu from "../../screens/NguoiThueTro/DichVu/LichSuDatDichVuScreen";
import ChiTietDonHangDichVu from "../../screens/NguoiThueTro/DichVu/ChiTietDonHangDichVuScreen";

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DichVu"
        component={DichVu}
      />
      <Stack.Screen
        name="ChiTietDichVu"
        component={ChiTietDichVu}
      />
      <Stack.Screen
        name="XacNhanDatDichVu"
        component={XacNhanDatDichVu}
      />
      <Stack.Screen
        name="LichSuDatDichVu"
        component={LichSuDatDichVu}
      />
      <Stack.Screen
        name="ChiTietDonHangDichVu"
        component={ChiTietDonHangDichVu}
      />
    </Stack.Navigator>
  );
}
