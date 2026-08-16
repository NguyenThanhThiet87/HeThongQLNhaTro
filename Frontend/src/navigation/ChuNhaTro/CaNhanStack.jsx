import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CauHinhGiaDienNuocScreen from "../../screens/ChuNhaTro/CaNhan/CauHinhGiaDienNuocScreen";
import ProfileScreen from "../../screens/ChuNhaTro/CaNhan/ProfileScreen";
import CauHinhLoaiPhongScreen from "../../screens/ChuNhaTro/CaNhan/CauHinhLoaiPhongScreen";
import SuaLoaiPhongScreen from "../../screens/ChuNhaTro/CaNhan/SuaLoaiPhongScreen";
import ThemLoaiPhongScreen from "../../screens/ChuNhaTro/CaNhan/ThemLoaiPhongScreen";
import ThongTinCaNhanScreen from "../../screens/ChuNhaTro/CaNhan/ThongTinCaNhan";
import ThayDoiSoDienThoaiScreen from "../../screens/NguoiThueTro/CaNhan/ThayDoiSoDienThoaiScreen";
import ThayDoiThongTinCaNhan from "../../screens/ChuNhaTro/CaNhan/ThayDoiThongTinCaNhan";
import VerifyOTPThayDoiSoDienThoai from "../../screens/NguoiThueTro/CaNhan/VerifyOTPThayDoiSoDienThoai";
import CaiDatBaoMatScreen from "../../screens/NguoiThueTro/CaNhan/CaiDatBaoMatScreen";
import CaiDatChungScreen from "../../screens/NguoiThueTro/CaNhan/CaiDatChungScreen";
import ThayDoiPasswordScreen from "../../screens/NguoiThueTro/CaNhan/ThayDoiPasswordScreen";
import HopDongStack from "./HopDongStack";

const Stack = createNativeStackNavigator();

export default function CaNhanStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Stack.Screen
                name="CauHinhGiaDienNuoc"
                component={CauHinhGiaDienNuocScreen}
            />
            <Stack.Screen
                name="CauHinhLoaiPhong"
                component={CauHinhLoaiPhongScreen}
            />
            <Stack.Screen
                name="SuaLoaiPhong"
                component={SuaLoaiPhongScreen}
            />
            <Stack.Screen
                name="ThemLoaiPhong"
                component={ThemLoaiPhongScreen}
            />
            <Stack.Screen
                name="ThongTinCaNhan"
                component={ThongTinCaNhanScreen}
            />
            <Stack.Screen
                name="ThayDoiSoDienThoai"
                component={ThayDoiSoDienThoaiScreen}
            />
            <Stack.Screen
                name="ThayDoiThongTinCaNhan"
                component={ThayDoiThongTinCaNhan}
            />
            <Stack.Screen
                name="VerifyOTPThayDoiSoDienThoai"
                component={VerifyOTPThayDoiSoDienThoai}
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
                name="ThayDoiMatKhau"
                component={ThayDoiPasswordScreen}
            />
            <Stack.Screen
                name="HopDong"
                component={HopDongStack}
            />
        </Stack.Navigator>
    );
}
