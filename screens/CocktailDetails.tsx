import React, { useContext } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  Image,
  Platform,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { FavoritesContext, FavoritesContextValue } from '../contexts/favorites';
import { CocktailDetailsRouteProp, Drink, RootStackParamList } from '../types';
import { AntDesign } from '@expo/vector-icons';
import { getCocktailById } from '../services/cocktails';
import Tag from '../components/Tag';
import Ingredient from '../components/Ingredient';
import { StackNavigationProp } from '@react-navigation/stack';

export default function CocktailsDetails({
  route,
  navigation,
}: {
  route: CocktailDetailsRouteProp;
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  const { isFavorite, toggleFavorite } =
    useContext<FavoritesContextValue>(FavoritesContext);
  const { cocktailId } = route.params;
  const [cocktail, setCocktail] = useState<Drink | null>(null);

  useEffect(() => {
    const { request, cancel } = getCocktailById(cocktailId);
    request
      .then((cocktail) => {
        if (cocktail) {
          setCocktail(cocktail);
          navigation.setOptions({ title: cocktail.name });
        }
      })
      .catch(console.error);
    return () => {
      cancel();
    };
  }, [cocktailId]);

  if (!cocktail)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const { id, pictureUrl, ingredients, instructions, tags } = cocktail;

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: pictureUrl }} style={styles.cocktailImage} />
        </View>
        <View style={{ ...styles.tagList, marginTop: tags?.length ? 50 : 0 }}>
          {tags?.map((t) => (
            <Tag key={t} name={t} />
          ))}
        </View>
        <View style={styles.ingredientsContainer}>
          {ingredients.map((i) => (
            <Ingredient key={i.name} {...i} />
          ))}
        </View>
        {instructions.map((i, idx) => (
          <View key={idx} style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{idx + 1}</Text>
            </View>
            <View style={styles.stepText}>
              <Text style={styles.instruction}>{i}</Text>
            </View>
          </View>
        ))}
        <View style={styles.favorite}>
          <TouchableOpacity onPress={() => toggleFavorite(cocktail)}>
            <AntDesign
              name={isFavorite(id) ? 'heart' : 'hearto'}
              size={100}
              color={isFavorite(id) ? 'red' : 'gray'}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  cocktailImage: {
    width: '100%',
    height: 420,
  },
  ingredientsContainer: {
    marginTop: 40,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  instructions: {
    maxWidth: '85%',
    marginTop: 30,
    fontSize: 25,
    textAlign: 'center',
  },
  step: {
    display: 'flex',
    flexDirection: 'row',
    width: '85%',
    alignItems: 'center',
    marginBottom: 35,
  },
  stepNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: 'orange',
    marginRight: 30,
  },
  stepText: {
    flex: 5,
  },
  stepNumberText: {
    fontSize: 40,
    opacity: 0.8,
  },
  instruction: {
    fontSize: 20,
  },
  imageContainer: {
    backgroundColor: '#222',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  favorite: {
    margin: 50,
  },
  tagList: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});
