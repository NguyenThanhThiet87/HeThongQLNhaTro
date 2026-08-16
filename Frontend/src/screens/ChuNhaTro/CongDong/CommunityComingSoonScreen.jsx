import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/useTheme";

export default function CommunityComingSoonScreen() {
  const { COLORS } = useTheme();
  const styles = createStyles(COLORS);

  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <MaterialIcons name="groups" size={52} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>Cộng đồng</Text>
      <Text style={styles.description}>
        Không gian kết nối chủ trọ, người thuê và các nhà cung cấp đang được phát triển.
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>COMING SOON</Text>
      </View>
    </View>
  );
}

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    backgroundColor: COLORS.bgLight,
  },
  iconWrap: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    backgroundColor: COLORS.primaryLight,
  },
  title: { fontSize: 26, fontWeight: "800", color: COLORS.textMain },
  description: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
  },
  badge: {
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800", letterSpacing: 1 },
});
