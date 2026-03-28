import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DoanhThuScreen from "../../screens/NguoiCungCap/DoanhThu/DoanhThuScreen";

const Stack = createNativeStackNavigator();

export default function DoanhThuStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="DoanhThuMain"
        component={DoanhThuScreen}
      />
    </Stack.Navigator>
  );
}
