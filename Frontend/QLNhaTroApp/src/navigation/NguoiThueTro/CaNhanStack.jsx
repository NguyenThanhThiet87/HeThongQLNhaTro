import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import ThongTinCaNhan from "../../screens/NguoiThueTro/CaNhan/ThongTinCaNhan";
import CaNhanScreen from "../../screens/NguoiThueTro/CaNhan/CaNhanScreen";
import CaiDatBaoMatScreen from "../../screens/NguoiThueTro/CaNhan/CaiDatBaoMatScreen";
import CaiDatChungScreen from "../../screens/NguoiThueTro/CaNhan/CaiDatChungScreen";
import ThayDoiThongTinCaNhan from "../../screens/NguoiThueTro/CaNhan/ThayDoiThongTinCaNhan"
import ThayDoiSoDienThoaiScreen from "../../screens/NguoiThueTro/CaNhan/ThayDoiSoDienThoaiScreen";
import VerifyOTPThayDoiSoDienThoai from "../../screens/NguoiThueTro/CaNhan/VerifyOTPThayDoiSoDienThoai";
import XemChiTietHopDongScreen from "../../screens/NguoiThueTro/CaNhan/XemChiTietHopDongScreen";
import ThayDoiPasswordScreen from "../../screens/NguoiThueTro/CaNhan/ThayDoiPasswordScreen";

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name="CaNhanScreen"
            component={CaNhanScreen}
        />
        <Stack.Screen
            name="ThongTinCaNhan"
            component={ThongTinCaNhan}
        />
        <Stack.Screen
            name="CaiDatBaoMatScreen"
            component={CaiDatBaoMatScreen}
        />
        <Stack.Screen
            name="CaiDatChungScreen"
            component={CaiDatChungScreen}
        />
        <Stack.Screen
            name="ThayDoiThongTinCaNhan"
            component={ThayDoiThongTinCaNhan}
        />
        <Stack.Screen
            name="ThayDoiSoDienThoai"
            component={ThayDoiSoDienThoaiScreen}
        />
        <Stack.Screen
            name="VerifyOTPThayDoiSoDienThoai"
            component={VerifyOTPThayDoiSoDienThoai}
        />
        <Stack.Screen
            name="XemChiTietHopDong"
            component={XemChiTietHopDongScreen}
        />
        <Stack.Screen
            name="ThayDoiMatKhau"
            component={ThayDoiPasswordScreen}
        />
      </Stack.Navigator>
  );
}
