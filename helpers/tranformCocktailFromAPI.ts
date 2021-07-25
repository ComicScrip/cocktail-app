import { Drink } from '../types';

export default function transformCockatailFromAPI(cocktail: any): Drink {
  const ingredients = Object.keys(cocktail)
    .filter((k) => k.startsWith('strIngredient'))
    .map((k) => cocktail[k])
    .filter((el) => el !== null);

  const ingredientWithQuantity = ingredients.map((name, index) => ({
    name,
    quantity: cocktail[`strMeasure${index}`],
  }));

  return {
    id: cocktail.idDrink,
    thumbUrl: cocktail.strDrinkThumb,
    name: cocktail.strDrink,
    ingredients: ingredientWithQuantity,
    tags: cocktail.strTags?.split(',') || [],
    instructions: cocktail.strInstructions
      .split('.')
      .map((step: string) => step.trim())
      .filter((el: string) => !!el),
  };
}
