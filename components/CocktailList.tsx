import axios from 'axios';
import React, { useCallback, useContext } from 'react';
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
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';

import { Drink, RootStackParamList } from '../types';
import handleNetworkError from '../helpers/handleNetworkErrors';
import transformCockatailFromAPI from '../helpers/tranformCocktailFromAPI';
import { AntDesign } from '@expo/vector-icons';
import { FavoritesContext, FavoritesContextValue } from '../contexts/favorites';

const searchBgImage = require('../assets/cocktail-beach2.jpg');

const DrinkListElement = ({
  drink,
  toggleFavorite,
  isFavorite,
}: {
  drink: Drink;
  toggleFavorite: (drink: Drink) => void;
  isFavorite: boolean;
}) => {
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
};

export default function CocktailList({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  const { isFavorite, toggleFavorite, savedFavorites } =
    useContext<FavoritesContextValue>(FavoritesContext as any);
  const [cocktails, setCocktails] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorite] = useState(false);

  const fetchCocktails = useCallback(
    (onComplete) => {
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

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
          const cocktails = data ? data.map(transformCockatailFromAPI) : [];
          onComplete(_.uniqBy(cocktails, 'id') as any);
        })
        .catch(handleNetworkError)
        .finally(() => setIsLoading(false));

      return source;
    },
    [search]
  );

  useEffect(() => {
    const source = fetchCocktails(setCocktails);
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
      <DrinkListElement
        drink={item}
        toggleFavorite={() => toggleFavorite(item)}
        isFavorite={isFavorite(item.id)}
      />
    </TouchableOpacity>
  );

  const handleLoadMore = () => {
    if (!search) {
      fetchCocktails((cocktails: Drink[]) =>
        setCocktails((prev) => _.uniqBy([...prev, ...cocktails], 'id'))
      );
    }
  };

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
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingRight: 15,
                  opacity: 0.8,
                }}
              >
                <TextInput
                  style={styles.searchInput}
                  onChangeText={(val) => {
                    setSearch(val);
                    setShowFavorite(false);
                  }}
                  value={search}
                  placeholder='Search for a cocktail'
                />
                <TouchableOpacity
                  onPress={() => setShowFavorite(!showFavorites)}
                  style={{ paddingTop: 10, opacity: showFavorites ? 0.9 : 0.7 }}
                >
                  <AntDesign
                    name={showFavorites ? 'heart' : 'hearto'}
                    size={50}
                    color={showFavorites ? 'orange' : 'gray'}
                  />
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </View>
        }
        refreshing={isLoading}
        onRefresh={() => fetchCocktails(setCocktails)}
        data={showFavorites ? savedFavorites : cocktails}
        ListEmptyComponent={
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {showFavorites
                ? 'No favorite drinks yet, press the heart icons to save drinks you love and find them back here'
                : 'No drink match your search'}
            </Text>
          </View>
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.cocktailListContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.8}
        initialNumToRender={10}
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
    maxWidth: '50%',
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
  favorite: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    marginLeft: 20,
  },
  noDataContainer: {
    margin: 100,
    marginHorizontal: 50,
  },
  noDataText: {
    fontSize: 25,
    textAlign: 'center',
  },
});
