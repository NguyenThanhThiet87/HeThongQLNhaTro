import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const DotTyping = ({ text = "Bot đang soạn tin" }) => {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.typingText}>{text}{dots}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 60,
    minHeight: 24,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  typingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default DotTyping;