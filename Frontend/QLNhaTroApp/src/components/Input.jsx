import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const PRIMARY = "#13c8ec";
const PRIMARY_HOVER = "#0fb3d4";
const BG_DARK = "#101f22";
const SURFACE = "#162a2e";
const BORDER = "#1f2f33";

export default function Input({
  label,
  icon,
  placeholder,
  secure,
  secureValue,
  toggleSecure,
  focused,
  enabled = true,
  showError = false,
  error = "",
  width,
  height,
  radius,
  inputStyle,
  ...props
}) {
  return (
    <View style={[{ marginBottom: 22 }, width && { width }]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          enabled ? styles.inputContainer : styles.inputContainerDisabled,
          focused && { borderColor: PRIMARY },
          height && { height },
          radius && { borderRadius: radius },
        ]}
      >
        <MaterialIcons
          name={icon}
          size={20}
          color={focused ? PRIMARY : "#6b8a8f"}
          style={{ marginRight: 10 }}
        />
        {enabled ? (
          <TextInput
            placeholder={placeholder}
            placeholderTextColor="#6b8a8f"
            style={[styles.input, inputStyle, height && { height }]}
            secureTextEntry={secure ? secureValue : false}
            {...props}
          />
        ) : (
          <View style={[styles.input, inputStyle, height && { height }]}>
            <Text style={{ color: "#fff", fontSize: 15 }}>{props.value}</Text>
          </View>
        )}
        {secure && (
          <TouchableOpacity onPress={toggleSecure}>
            <MaterialIcons
              name={secureValue ? "visibility-off" : "visibility"}
              size={20}
              color="#6b8a8f"
            />
          </TouchableOpacity>
        )}
      </View>
      {showError && error !== "" && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: "#9fb4b8",
    marginBottom: 5,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  inputContainerDisabled: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff10",
    borderWidth: 2,
    borderColor: BORDER,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  input: {
    flex: 1,
    color: "#fff",
    fontSize: 15,
    justifyContent: "center",
  },

  errorText: {
    color: "red",
    fontSize: 11,
    marginTop: 4,
    marginLeft: 4,
  },
});