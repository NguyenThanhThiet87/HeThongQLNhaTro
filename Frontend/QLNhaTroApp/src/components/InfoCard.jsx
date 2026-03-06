import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const COLORS = {
    primary: '#13c8ec',
    backgroundDark: '#101f22',
    surfaceDark: '#1a2e32',
    danger: '#ff4d4f',
    textLight: '#f1f5f9',
    textMuted: '#94a3b8',
};

export const InfoCard = ({ title, children }) => (
    <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.card}>{children}</View>
    </View>
);

const styles = StyleSheet.create({
    sectionContainer: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: COLORS.textMuted,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginLeft: 4,
        marginBottom: 8,
    },
    card: {
        backgroundColor: COLORS.surfaceDark,
        borderRadius: 16,
        overflow: 'hidden',
    },
});