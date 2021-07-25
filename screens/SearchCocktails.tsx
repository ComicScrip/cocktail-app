import React, { useCallback, useContext } from 'react';
import { useState, useEffect } from 'react';
import {
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import _ from 'lodash';
import { Drink, RootStackParamList } from '../types';
import { FavoritesContext, FavoritesContextValue } from '../contexts/favorites';
import DrinkListElement from '../components/CocktailListElement';
import { getCocktails } from '../services/cocktails';
import SearchBar from '../components/SearchBar';
import NoSearchResults from '../components/NoSearchResults';

export default function SearchCocktails({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  const { isFavorite, toggleFavorite, savedFavorites } =
    useContext<FavoritesContextValue>(FavoritesContext);
  const [cocktails, setCocktails] = useState<Drink[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFavorites, setShowFavorite] = useState(false);

  const loadCocktails = useCallback(
    (onComplete = setCocktails) => {
      setIsLoading(true);
      const { cancel, request } = getCocktails({ name: search });
      request
        .then((cocktails) => cocktails && onComplete(cocktails))
        .finally(() => {
          setIsLoading(false);
        });
      return { request, cancel };
    },
    [search]
  );

  const loadMoreCocktails = useCallback(() => {
    if (!search && !isLoading) {
      loadCocktails((cocktails: Drink[] | void) =>
        setCocktails((prev) => _.uniqBy([...prev, ...(cocktails || [])], 'id'))
      );
    }
  }, [search]);

  useEffect(() => {
    const { cancel } = loadCocktails();
    return () => {
      cancel();
    };
  }, [search]);

  const onCocktailPress = (id: string) => {
    navigation.navigate('Cocktail details', {
      cocktailId: id,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <SearchBar
            setShowFavorite={setShowFavorite}
            showFavorites={showFavorites}
            search={search}
            setSearch={setSearch}
          />
        }
        refreshing={isLoading}
        onRefresh={showFavorites ? null : loadCocktails}
        data={showFavorites ? savedFavorites : cocktails}
        ListEmptyComponent={
          isLoading ? null : (
            <NoSearchResults
              setShowFavorite={setShowFavorite}
              setSearch={setSearch}
              showFavorites={showFavorites}
            />
          )
        }
        renderItem={({ item }: { item: Drink }) => (
          <TouchableOpacity onPress={() => onCocktailPress(item.id)}>
            <DrinkListElement
              drink={item}
              toggleFavorite={() => toggleFavorite(item)}
              isFavorite={isFavorite(item.id)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        style={styles.cocktailListContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        onEndReached={loadMoreCocktails}
        onEndReachedThreshold={0.3}
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
  cocktailListContainer: {
    width: '100%',
  },
});
