import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();
import DichVu from "../DichVu/Screens/DichVu";

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen
            name="DichVu"
            component={DichVu}
        />

      </Stack.Navigator>
  );
}
