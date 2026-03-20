import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../constants/roles";

import BottomTabNavigatorOwner from "./BottomTabNavigatorOwner";
import BottomTabNavigatorTenant from "../features/NguoiThueTroRole/Navigation/BottomTabNavigatorTenant";

import LoginScreen from "../screens/auth/LoginScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/auth/ResetPasswordScreen";
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen";
import RegisterAccountScreen from "../screens/auth/RegisterAccountScreen";
import OTPVerificationScreenRegistor from "../screens/auth/OTPVerificationScreen_Registor";

const Stack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="RegisterAccount" component={RegisterAccountScreen} />
      <Stack.Screen name="OTPVerificationRegistor" component={OTPVerificationScreenRegistor} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const { user } = useAuth();

  const getMainNavigator = () => {
    if (!user) return <AuthNavigator />;

    console.log("User Role:", user); // Debug: Log the user's role

    switch (user?.maVaiTro) {
      case ROLES.CHU_TRO:
        return BottomTabNavigatorOwner;
      case ROLES.NGUOI_THUE:
        return BottomTabNavigatorTenant;
      default:
        return BottomTabNavigatorTenant;
    }
  };
  if (!user) return <AuthNavigator />;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={getMainNavigator()} />
    </Stack.Navigator>
  );
}