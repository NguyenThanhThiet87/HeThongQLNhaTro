import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HopDongScreen from "../../screens/ChuNhaTro/HopDong/contractScreen";
import ChiTietHopDongScreen from "../../screens/ChuNhaTro/HopDong/ChiTietHopDongScreen";
import TaoHopDongB1Screen from "../../screens/ChuNhaTro/HopDong/TaoHopDongB1Screen";
import TaoHopDongB2Screen from "../../screens/ChuNhaTro/HopDong/TaoHopDongB2Screen";
import ThemThanhVienScreen from "../../screens/ChuNhaTro/HopDong/ThemThanhVienScreen";
import OTPVerificationScreen_HopDong from "../../screens/ChuNhaTro/HopDong/OTPVerificationScreen_HopDong";
import OTPVerificationScreen_ThemThanhVien from "../../screens/ChuNhaTro/HopDong/OTPVerificationScreen_ThemThanhVien";
import HoSo from "../../screens/ChuNhaTro/HopDong/HoSo";
import TinNhanScreen from "../../features/TroChuyen/Screens/TinNhanScreen";
import GuiThongBaoHangLoatScreen from "../../features/TroChuyen/Screens/GuiThongBaoHangLoatScreen";

const Stack = createNativeStackNavigator();

export default function HopDongStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="ContractMain"
                component={HopDongScreen}
            />
            <Stack.Screen
                name="ChiTietHopDong"
                component={ChiTietHopDongScreen}
            />
            <Stack.Screen
                name="TaoHopDongB1"
                component={TaoHopDongB1Screen}
            />
            <Stack.Screen
                name="TaoHopDongB2"
                component={TaoHopDongB2Screen}
            />
            <Stack.Screen
                name="ThemThanhVien"
                component={ThemThanhVienScreen}
            />
            <Stack.Screen
                name="OTPVerification_HopDong"
                component={OTPVerificationScreen_HopDong}
            />
            <Stack.Screen
                name="OTPVerification_ThemThanhVien"
                component={OTPVerificationScreen_ThemThanhVien}
            />
            <Stack.Screen
                name="HoSo"
                component={HoSo}
            />
            <Stack.Screen
                name="TinNhan"
                component={TinNhanScreen}
            />
            <Stack.Screen
                name="GuiThongBaoHangLoat"
                component={GuiThongBaoHangLoatScreen}
            />
        </Stack.Navigator>

    );
}
