import React, { memo } from 'react';
import { Image, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Drink } from '../types';

function CocktailListElement({
  drink,
  toggleFavorite,
  isFavorite,
}: {
  drink: Drink;
  toggleFavorite: (drink: Drink) => void;
  isFavorite: boolean;
}) {
  return (
    <View style={styles.cocktailListItemContainer}>
      <Image source={{ uri: drink.thumbUrl }} style={styles.cocktailImage} />
      <Text style={styles.cocktailName}>{drink.name}</Text>
      <View style={styles.favorite}>
        <TouchableOpacity onPress={() => toggleFavorite(drink)}>
          <AntDesign
            name={isFavorite ? 'heart' : 'hearto'}
            size={50}
            color={isFavorite ? 'red' : 'gray'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default memo(CocktailListElement);

const styles = StyleSheet.create({
  cocktailListItemContainer: {
    padding: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cocktailImage: { width: 70, height: 70, borderRadius: 35 },
  cocktailName: {
    paddingLeft: 15,
    fontSize: 20,
    flexShrink: 1,
    maxWidth: '50%',
  },
  favorite: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
});
