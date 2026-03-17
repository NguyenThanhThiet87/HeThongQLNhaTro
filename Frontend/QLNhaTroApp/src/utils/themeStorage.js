import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'theme';

export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    // Xử lý lỗi nếu cần
  }
};

export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme || 'light'; // Giá trị mặc định
  } catch (error) {
    return 'light';
  }
};