import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import ToastManager from "toastify-react-native";
import { AuthProvider } from "./src/context/AuthContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { ThemeProvider } from "./src/theme/themeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <ToastManager useModal={false} />
      </AuthProvider>
    </ThemeProvider>
  );
}