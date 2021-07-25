import { RouteProp } from '@react-navigation/native';

export interface IngredientWithQuantity {
  name: string;
  quantity: string;
}
export interface Drink {
  id: string;
  name: string;
  thumbUrl: string;
  pictureUrl: string;
  ingredients: IngredientWithQuantity[];
  instructions: string[];
  isAlcoholic: boolean;
  category: string;
  tags: string[];
}

export interface CancellableRequest<T> {
  request: Promise<T>;
  cancel: () => void;
}

export type RootStackParamList = {
  Cocktails: undefined;
  'Cocktail details': { cocktailId: string };
};

export type CocktailDetailsRouteProp = RouteProp<
  RootStackParamList,
  'Cocktail details'
>;
