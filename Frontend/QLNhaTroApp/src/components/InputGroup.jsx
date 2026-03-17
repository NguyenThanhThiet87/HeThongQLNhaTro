import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";

export default function InputGroup({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  inputStyle,
  groupStyle,
  labelStyle,
  numberOfLines = 1,
  error,
  errorStyle,
  iconName,
  iconColor = "#0f172a",
  iconSize = 20,
  enable = true,
  inputWidth,   // Thêm option width
  inputHeight,  // Thêm option height
  ...props
}) {
  const {COLORS, isDark, toggleTheme} = useTheme();
  const styles = createStyles(COLORS);
  iconColor = COLORS.textMuted; // Override màu icon theo theme
  
  return (
    <View style={[styles.inputGroup, groupStyle]}>
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      <View style={styles.inputWithIconWrapper}>
        {iconName && (
          <MaterialIcons
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            iconName ? styles.inputWithIcon : null,
            inputStyle,
            !enable && { backgroundColor: COLORS.inputBgDisabled, color: COLORS.inputTextDisabled },
            inputWidth && { width: inputWidth },
            inputHeight && { height: inputHeight },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={value}
          onChangeText={onChangeText}
          numberOfLines={numberOfLines}
          multiline={numberOfLines > 1}
          editable={enable}
          {...props}
        />
      </View>
      {error ? <Text style={[styles.errorText, errorStyle]}>{error}</Text> : null}
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMain,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputWithIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    opacity: 0.6,
  },
  inputWithIcon: {
    paddingLeft: 46,
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: COLORS.inputBg,
    color: COLORS.inputText,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: "500",
  },
});