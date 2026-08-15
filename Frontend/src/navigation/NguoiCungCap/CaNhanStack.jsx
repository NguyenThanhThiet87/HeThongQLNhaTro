import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProfileScreen from "../../screens/NguoiCungCap/CaNhan/ProfileScreen";
import ThongTinCaNhanScreen from "../../screens/NguoiCungCap/CaNhan/ThongTinCaNhan";
import ThayDoiSoDienThoaiScreen from "../../screens/NguoiCungCap/CaNhan/ThayDoiSoDienThoaiScreen";
import ThayDoiThongTinCaNhan from "../../screens/NguoiCungCap/CaNhan/ThayDoiThongTinCaNhan";
import VerifyOTPThayDoiSoDienThoai from "../../screens/NguoiCungCap/CaNhan/VerifyOTPThayDoiSoDienThoai";
import CaiDatBaoMatScreen from "../../screens/NguoiCungCap/CaNhan/CaiDatBaoMatScreen";
import CaiDatChungScreen from "../../screens/NguoiCungCap/CaNhan/CaiDatChungScreen";
import ThayDoiPasswordScreen from "../../screens/NguoiCungCap/CaNhan/ThayDoiPasswordScreen";

const Stack = createNativeStackNavigator();

export default function CaNhanStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
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
        </Stack.Navigator>
    );
}
