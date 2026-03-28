import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import Home from "../../screens/NguoiThueTro/TrangChu/Home";
import ThanhToanHoaDonScreen from "../../screens/NguoiThueTro/HoaDon/ThanhToanHoaDonScreen";
import ThanhToanVNPayScreen from "../../screens/NguoiThueTro/HoaDon/ThanhToanVNPayScreen";
import ChatChuNhaTroScreen from "../../screens/Chat/ChatChuNhaTroScreen";
import LapBaoCaoSuCoScreen from "../../screens/NguoiThueTro/BaoCaoSuCo/LapBaoCaoSuCoScreen";
import ThemPhongScreen from "../../screens/ChuNhaTro/DayNhaTro/ThemPhongScreen";
import ChiTietBaoCaoTenantScreen from "../../screens/NguoiThueTro/BaoCaoSuCo/ChiTietSuCoTenantScreen";
import ThongBaoTenantScreen from "../../screens/NguoiThueTro/TrangChu/ThongBaoTenantScreen";

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Home"
                component={Home}
            />
            <Stack.Screen
                name="ThanhToanHoaDonScreen"
                component={ThanhToanHoaDonScreen}
            />
            <Stack.Screen
                name="ThanhToanVNPayScreen"
                component={ThanhToanVNPayScreen}
            />
            <Stack.Screen
                name="ChatChuNhaTroScreen"
                component={ChatChuNhaTroScreen}
            />
            <Stack.Screen
                name="LapBaoCaoSuCoScreen"
                component={LapBaoCaoSuCoScreen}
            />
            <Stack.Screen
                name="ThemPhongScreen"
                component={ThemPhongScreen}
            />
            <Stack.Screen
                name="ChiTietBaoCaoTenantScreen"
                component={ChiTietBaoCaoTenantScreen}
            />
            <Stack.Screen
                name="ThongBaoTenantScreen"
                component={ThongBaoTenantScreen}
            />
        </Stack.Navigator>
    );
}
