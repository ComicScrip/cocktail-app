import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Tag({ name }: { name: string }) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.text}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'orange',
    margin: 20,
    padding: 12,
    borderRadius: 25,
    elevation: 2,
  },
  text: { fontSize: 25 },
});
