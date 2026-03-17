import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import Home from "../TrangChu/Screens/Home";
import ThanhToanHoaDonScreen from "../HoaDon/Screens/ThanhToanHoaDonScreen";
import ThanhToanVNPayScreen from "../HoaDon/Screens/ThanhToanVNPayScreen";
import ChatScreen from "../ChatBox/ChatScreen";

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
            name = "ThanhToanVNPayScreen"
            component={ThanhToanVNPayScreen}
        />
        <Stack.Screen
            name="ChatScreen"
            component={ChatScreen}
        />
      </Stack.Navigator>
  );
}
