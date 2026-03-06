import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
    primary: '#13c8ec',
    backgroundDark: '#101f22',
    surfaceDark: '#1a2e32',
    danger: '#ff4d4f',
    textLight: '#f1f5f9',
    textMuted: '#94a3b8',
};
const BORDER = "rgba(19,200,236,0.1)";

export const InfoRow = ({ label, value, highlight }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={highlight ? styles.highlightBadge : null}>
            <Text style={[styles.infoValue, highlight && { color: COLORS.primary }]}>{value}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(19, 200, 236, 0.05)',
    },
    infoLabel: {
        color: COLORS.textMuted,
    },
    infoValue: {
        color: COLORS.textLight,
        fontWeight: '500',
    },
});