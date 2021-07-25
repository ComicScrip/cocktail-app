import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const searchBgImage = require('../assets/cocktail-beach3.jpg');

export default function SearchBar({
  showFavorites,
  setShowFavorite,
  search,
  setSearch,
}: {
  showFavorites: boolean;
  setShowFavorite: (val: boolean) => void;
  search: string;
  setSearch: (val: string) => void;
}) {
  return (
    <View style={{ ...styles.searchContainer, ...styles.shadow }}>
      <ImageBackground
        source={searchBgImage}
        resizeMode='cover'
        style={{ ...styles.searchBgImage }}
      >
        <View style={styles.controls}>
          <TextInput
            style={{ ...styles.searchInput, ...styles.shadow }}
            onChangeText={(val) => {
              setSearch(val);
              setShowFavorite(false);
            }}
            value={search}
            placeholder='Search for a cocktail'
          />
          <TouchableOpacity onPress={() => setShowFavorite(!showFavorites)}>
            <AntDesign
              style={{ paddingTop: 10, opacity: showFavorites ? 1 : 0.6 }}
              name={showFavorites ? 'heart' : 'hearto'}
              size={50}
              color={showFavorites ? 'orange' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    margin: 10,
    marginLeft: 15,
    borderWidth: 1,
    width: 200,
    borderColor: '#eee',
    borderRadius: 20,
    padding: 15,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  searchBgImage: {
    flex: 1,
    justifyContent: 'center',
    height: 110,
  },
  searchContainer: {
    height: 110,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  controls: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 15,
  },
});
