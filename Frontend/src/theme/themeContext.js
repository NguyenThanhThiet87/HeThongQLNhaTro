import React, { createContext, useState, useEffect } from "react";
import { lightTheme, darkTheme } from "./colors";
import { getTheme, saveTheme } from "../utils/themeStorage";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  // Đọc trạng thái theme khi khởi tạo
  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await getTheme();
      setIsDark(theme === "dark");
    };
    fetchTheme();
  }, []);

  const toggleTheme = async () => {
    setIsDark(prev => {
      const newIsDark = !prev;
      saveTheme(newIsDark ? "dark" : "light");
      return newIsDark;
    });
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ COLORS: theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};