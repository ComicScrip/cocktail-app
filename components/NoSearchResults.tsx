import React from 'react';
import { View, StyleSheet, Text, Image, Button } from 'react-native';

const cocktailGif = require('../assets/cocktail-movie.gif');
const cocktailGif2 = require('../assets/cocktail-movie2.gif');

export default function NoSearchResults({
  showFavorites,
  setSearch,
  setShowFavorite,
}: {
  showFavorites: boolean;
  setSearch: (val: string) => void;
  setShowFavorite: (val: boolean) => void;
}) {
  return (
    <View style={styles.noDataContainer}>
      {showFavorites ? (
        <>
          <Text style={styles.noDataText}>
            {
              'No favorite drinks yet \n\n Tip : press the heart icon next to the cocktails you love to save them. You will find them back on this screen'
            }{' '}
          </Text>
          <Button
            onPress={() => {
              setShowFavorite(false);
              setSearch('');
            }}
            title='See random cocktails'
          ></Button>
        </>
      ) : (
        <>
          <Text style={styles.noDataText}>
            {
              'Sorry, but no cocktail match your search \n\n Tip : change your search in the input above or'
            }
          </Text>
          <Button
            onPress={() => setSearch('')}
            title='clear your search to see random cocktails'
          ></Button>
        </>
      )}
      <Image
        style={styles.noResultstImage}
        source={showFavorites ? cocktailGif2 : cocktailGif}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noDataContainer: {
    margin: 100,
    marginHorizontal: 50,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 25,
    textAlign: 'center',
    marginBottom: 30,
  },
  noResultstImage: {
    marginTop: 50,
    width: 300,
    height: 150,
  },
});
