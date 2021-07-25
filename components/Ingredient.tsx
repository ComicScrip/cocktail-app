import React from 'react';
import { Image, View, StyleSheet, Text } from 'react-native';
import { getIngredientPictureUrl } from '../services/cocktails';
import { IngredientWithQuantity } from '../types';

export default function Ingredient({ quantity, name }: IngredientWithQuantity) {
  return (
    <View style={styles.ingredient}>
      <Image
        source={{ uri: getIngredientPictureUrl(name) }}
        style={styles.ingredientImage}
      />
      <Text style={styles.ingredientText}>{name}</Text>
      <Text style={styles.ingredientText}>
        {quantity ? `(${quantity})` : null}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  ingredientImage: {
    width: 120,
    height: 120,
    margin: 5,
  },
  ingredient: {
    alignItems: 'center',
    maxWidth: 120,
    margin: 5,
  },
  ingredientText: {
    opacity: 0.8,
    flexShrink: 1,
    textAlign: 'center',
  },
});
