export interface IngredientWithQuantity {
  name: string;
  quantity: string;
}

export interface Drink {
  id: string;
  name: string;
  thumbUrl: string;
  ingredients?: IngredientWithQuantity[];
  instructions?: string[];
  alcoholic?: boolean;
  category?: string;
  tags?: string[];
}

export type RootStackParamList = {
  Cocktails: undefined;
  'Cocktail details': { cocktailId: string };
};
