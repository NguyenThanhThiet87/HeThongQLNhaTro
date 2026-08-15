import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const RadioButton = ({
    checked,
    onPress,
    text,
    style,
    textStyle,
}) => (
    <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.8}
    >
        <View style={[styles.radioOuter, checked && styles.radioOuterActive]}>
            {checked && <View style={styles.radioInner} />}
        </View>
        <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#13c8ec',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    radioOuterActive: {
        backgroundColor: '#13c8ec',
        borderColor: '#13c8ec',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#101f22',
    },
    text: {
        marginLeft: 6,
        color: '#334155',
        fontWeight: '500',
        fontSize: 14,
    },
});

export default RadioButton;