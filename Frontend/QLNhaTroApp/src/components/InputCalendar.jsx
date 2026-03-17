import React, { useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/useTheme';

const InputCalendar = ({
  value,
  onChange,
  placeholder = 'dd/mm/yyyy',
  label,
  style,
  textStyle,
  iconColor = '#727171',
  maximumDate,
  minimumDate,
  enable = true, // Thêm prop enable, mặc định true
}) => {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      const formatted = selectedDate.toLocaleDateString('vi-VN');
      onChange(formatted);
    }
  };

  return (
    <View style={style}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        onPress={() => enable && setShowPicker(true)} // Chỉ mở picker khi enable
        style={[
          styles.inputBox,
          !enable && {  backgroundColor: COLORS.card }, // Có thể đổi màu khi disable
        ]}
        activeOpacity={enable ? 0.8 : 1}
        disabled={!enable} // Disable touch
      >
        <MaterialIcons name="calendar-today" size={20} color={COLORS.textMuted} />
        <Text style={[
          styles.inputText,
          textStyle,
          !enable && { color: COLORS.textMuted }, // Đổi màu chữ khi disable
        ]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value ? new Date(value.split('/').reverse().join('-')) : new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    </View>
  );
};

const createStyles = (COLORS) => StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.inputBg,
    marginBottom: 12,
    height: 45,
  },
  inputText: {
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.inputText,
    flex: 1,
  },
});

export default InputCalendar;