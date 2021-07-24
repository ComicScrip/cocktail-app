import axios from 'axios';
import React, { useCallback } from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Drink, RootStackParamList } from './types';
import handleNetworkError from './helpers/handleNetworkErrors';
import transformCockatailFromAPI from './helpers/tranformCocktailFromAPI';
const searchBgImage = require('./assets/cocktail-beach2.jpg');

const DrinkListElement = ({ name, thumbUrl }: Drink) => {
  return (
    <View style={styles.cocktailListItemContainer}>
      <Image source={{ uri: thumbUrl }} style={styles.cocktailImage} />
      <Text style={styles.cocktailName}>{name}</Text>
    </View>
  );
};

export default function CocktailList({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  const [cocktails, setCocktails] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchCocktails = useCallback(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const url = search
      ? `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`
      : 'https://www.thecocktaildb.com/api/json/v1/1/random.php';

    const apiCall = search
      ? axios
          .get(
            `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`,
            {
              cancelToken: source.token,
            }
          )
          .then((res) => res.data.drinks)
      : Promise.all(
          Array(10)
            .fill('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .map((url) =>
              axios
                .get(url, { cancelToken: source.token })
                .then((res) => res.data.drinks[0])
            )
        );

    setIsLoading(true);
    apiCall
      .then((data: any) => {
        setCocktails(data ? data.map(transformCockatailFromAPI) : []);
      })
      .catch(handleNetworkError)
      .finally(() => setIsLoading(false));

    return source;
  }, [search]);

  useEffect(() => {
    const source = fetchCocktails();
    return () => {
      source.cancel('Request cancelled');
    };
  }, [search]);

  const onCocktailPress = (id: string) => {
    navigation.navigate('Cocktail details', {
      cocktailId: id,
    });
  };

  const renderItem = ({ item }: { item: Drink }) => (
    <TouchableOpacity onPress={() => onCocktailPress(item.id)}>
      <DrinkListElement {...item} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.searchContainer}>
            <ImageBackground
              source={searchBgImage}
              resizeMode='cover'
              style={styles.searchBgImage}
            >
              <TextInput
                style={styles.searchInput}
                onChangeText={setSearch}
                value={search}
                placeholder='Search for a cocktail by name'
              />
            </ImageBackground>
          </View>
        }
        refreshing={isLoading}
        onRefresh={fetchCocktails}
        data={cocktails}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.cocktailListContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cocktailListItemContainer: {
    padding: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cocktailImage: { width: 100, height: 100, borderRadius: 40 },
  cocktailListContainer: {
    width: '100%',
  },
  cocktailName: {
    paddingLeft: 15,
    fontSize: 20,
    flexShrink: 1,
  },
  searchInput: {
    margin: 10,
    borderWidth: 1,
    width: '55%',
    borderColor: '#eee',
    borderRadius: 5,
    padding: 15,
    backgroundColor: 'white',
  },
  searchBgImage: {
    flex: 1,
    justifyContent: 'center',
    height: 100,
  },
  searchContainer: {
    height: 100,
  },
});
