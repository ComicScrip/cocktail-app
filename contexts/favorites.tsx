import React, { createContext, useState } from 'react';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Drink } from '../types';

interface FavoritesObject {
  [key: string]: boolean | undefined;
}
export interface FavoritesContextValue {
  isFavorite: (id: string) => boolean;
  toggleFavorite: (drink: Drink) => void;
  savedFavorites: Drink[];
}

export const FavoritesContext = createContext<FavoritesContextValue>({
  isFavorite: () => false,
  toggleFavorite: () => {},
  savedFavorites: [],
});

export default function FavoritesContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [favorites, setFavorites] = useState<FavoritesObject>({});
  const [savedFavorites, setSavedFavorites] = useState<Drink[]>([]);

  const isFavorite = (id: string) => !!favorites[id];

  const toggleFavorite = (drink: Drink) => {
    if (isFavorite(drink.id))
      setSavedFavorites((saved) => saved.filter((d) => d.id !== drink.id));
    else {
      setSavedFavorites((saved) => [...saved, drink]);
    }
    setFavorites((favs) => ({ ...favs, [drink.id]: !favs[drink.id] }));
  };

  const storeData = async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  const getStoredData = async (key: string, defaultValue: any = {}) => {
    try {
      const json = await AsyncStorage.getItem(key);
      if (json) return JSON.parse(json);
      return defaultValue;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getStoredData('favorites').then(setFavorites);
    getStoredData('savedFavorites', []).then(setSavedFavorites);
  }, []);

  useEffect(() => {
    storeData('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    storeData('savedFavorites', savedFavorites);
  }, [savedFavorites]);

  return (
    <FavoritesContext.Provider
      value={{ isFavorite, toggleFavorite, savedFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
