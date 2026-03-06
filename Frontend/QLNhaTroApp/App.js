import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ToastManager from "toastify-react-native";

// Auth screens
import LoginScreen from "./src/features/auth/screens/LoginScreen";
import ForgotPasswordScreen from "./src/features/auth/screens/ForgotPasswordScreen";
import OTPVerificationScreen from "./src/features/auth/screens/OTPVerificationScreen";
import ResetPasswordScreen from "./src/features/auth/screens/ResetPasswordScreen";
import RoleSelectionScreen from "./src/features/auth/screens/RoleSelectionScreen";
import RegisterAccountScreen from "./src/features/auth/screens/RegisterAccountScreen";
import OTPVerificationScreenRegistor from "./src/features/auth/screens/OTPVerificationScreen_Registor";

// Bottom tabs
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <>
      <NavigationContainer>
  
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Auth flow */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="RegisterAccount" component={RegisterAccountScreen} />
          <Stack.Screen name="OTPVerificationRegistor" component={OTPVerificationScreenRegistor} />

          {/* App flow (bottom tabs) */}
          <Stack.Screen
            name="Main"
            component={BottomTabNavigator}
          />

        </Stack.Navigator>

      </NavigationContainer>

      <ToastManager useModal={false} />
    </>
  );
}
