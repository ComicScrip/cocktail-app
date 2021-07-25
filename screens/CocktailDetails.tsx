import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
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
import transformCockatailFromAPI from '../helpers/tranformCocktailFromAPI';
import { Drink, IngredientWithQuantity, RootStackParamList } from '../types';
import { AntDesign } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 100,
  },
  cocktailName: {
    fontSize: 60,
    flexShrink: 1,
    margin: 10,
  },
  cocktailImage: {
    width: '100%',
    height: 420,
  },
  ingredientImage: {
    width: 120,
    height: 120,
    margin: 5,
  },
  ingredientsContainer: {
    marginTop: 40,
    marginBottom: 50,
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
});

type CocktailDetailsRouteProp = RouteProp<
  RootStackParamList,
  'Cocktail details'
>;

const Ingredient = ({ quantity, name }: IngredientWithQuantity) => {
  const uri = `https://www.thecocktaildb.com/images/ingredients/${name}.png`;

  return (
    <View style={styles.ingredient}>
      <Image source={{ uri }} style={styles.ingredientImage} />

      <Text style={styles.ingredientText}>{name}</Text>

      <Text style={styles.ingredientText}>
        {quantity ? `(${quantity})` : null}
      </Text>
    </View>
  );
};

const Tag = ({ name }: { name: string }) => {
  return (
    <View
      style={{
        backgroundColor: 'orange',
        margin: 20,
        padding: 12,
        borderRadius: 25,
        elevation: 2,
      }}
    >
      <Text style={{ fontSize: 25 }}>{name}</Text>
    </View>
  );
};

export default function CocktailsDetails({
  route,
  navigation,
}: {
  route: CocktailDetailsRouteProp;
  navigation: StackNavigationProp<RootStackParamList>;
}) {
  const { isFavorite, toggleFavorite } = useContext<FavoritesContextValue>(
    FavoritesContext as any
  );
  const { cocktailId } = route.params;
  const [cocktail, setCocktail] = useState<Drink | null>(null);

  useEffect(() => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    if (cocktailId)
      axios
        .get(
          `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${cocktailId}`,
          {
            cancelToken: source.token,
          }
        )
        .then((res) => res.data)
        .then((data) => {
          const cocktail = transformCockatailFromAPI(data.drinks[0]);
          setCocktail(cocktail);
          navigation.setOptions({
            title: `${cocktail.name}`,
          });
        })
        .catch(console.error);
    return () => {
      source.cancel('Request cancelled');
    };
  }, [cocktailId]);

  if (!cocktail)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );

  const { id, thumbUrl, ingredients, instructions, tags } = cocktail;
  console.log(tags);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: thumbUrl }} style={styles.cocktailImage} />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: tags?.length ? 50 : 0,
            justifyContent: 'space-around',
          }}
        >
          {tags?.map((t) => (
            <Tag key={t} name={t} />
          ))}
        </View>
        <View style={styles.ingredientsContainer}>
          {ingredients &&
            ingredients
              .filter((i) => !!i.name)
              .map((i) => <Ingredient key={i.name} {...i} />)}
        </View>
        {instructions &&
          instructions.map((i, idx) => (
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
