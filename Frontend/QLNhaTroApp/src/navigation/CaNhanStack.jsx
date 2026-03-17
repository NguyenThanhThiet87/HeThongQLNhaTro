import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import CauHinhGiaDienNuocScreen from "../features/CaNhan/Screens/CauHinhGiaDienNuocScreen";
import ProfileScreen from "../features/CaNhan/Tabs/ProfileScreen";
import CauHinhLoaiPhongScreen from "../features/CaNhan/Screens/CauHinhLoaiPhongScreen";
import SuaLoaiPhongScreen from "../features/CaNhan/Screens/SuaLoaiPhongScreen";
import ThemLoaiPhongScreen from "../features/CaNhan/Screens/ThemLoaiPhongScreen";
import ThongTinCaNhanScreen from "../features/CaNhan/Screens/ThongTinCaNhanScreen";
import ThayDoiSoDienThoaiScreen from "../features/CaNhan/Screens/ThayDoiSoDienThoaiScreen";

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
            
        </Stack.Navigator>
    );
}