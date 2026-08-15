import { useState } from "react";
import { useTheme } from "../../theme/useTheme";

export const useGeneralSettings = () => {

  const { COLORS, isDark, toggleTheme } = useTheme();

  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(false);
  const [biometric, setBiometric] = useState(true);

  return {
    COLORS,
    isDark,
    toggleTheme,

    pushNotif,
    setPushNotif,

    emailNotif,
    setEmailNotif,

    biometric,
    setBiometric
  };
};