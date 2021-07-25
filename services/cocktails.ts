import axios from 'axios';
import _ from 'lodash';
import { CancellableRequest, Drink } from '../types';

function getCancelSource() {
  return axios.CancelToken.source();
}

function handleCancellation(err: any) {
  if (!axios.isCancel(err)) throw err;
}

function transformCockatailFromAPI(cocktail: any): Drink {
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
    thumbUrl: `${cocktail.strDrinkThumb}/preview`,
    pictureUrl: `${cocktail.strDrinkThumb}`,
    name: cocktail.strDrink,
    ingredients: ingredientWithQuantity.filter((i) => !!i.name),
    tags: cocktail.strTags?.split(',') || [],
    instructions: cocktail.strInstructions
      .split('.')
      .map((step: string) => step.trim())
      .filter((el: string) => !!el),
    isAlcoholic: cocktail.strAlcoholic === 'Alcoholic',
    category: cocktail.strCategory,
  };
}

function getRandomCocktails(
  source = axios.CancelToken.source(),
  n = 5
): Promise<Drink>[] {
  return Array(n)
    .fill('https://www.thecocktaildb.com/api/json/v1/1/random.php')
    .map((url) =>
      axios
        .get(url, { cancelToken: source.token })
        .then((res) => res.data.drinks[0] as Drink)
    );
}

function searchForCocktailsByName(
  source = axios.CancelToken.source(),
  name = ''
): Promise<Drink[]> {
  return axios
    .get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`, {
      cancelToken: source.token,
    })
    .then((res) => res.data.drinks);
}

export function getCocktails(
  search = { name: '' }
): CancellableRequest<Drink[] | void> {
  const source = getCancelSource();
  const apiCall = search.name
    ? searchForCocktailsByName(source, search.name)
    : Promise.all(getRandomCocktails(source, 10));
  const request = apiCall
    .then((data) =>
      data ? _.uniqBy<Drink>(data.map(transformCockatailFromAPI), 'id') : []
    )
    .catch(handleCancellation);
  return { cancel: source.cancel, request };
}

export function getCocktailById(id: string): CancellableRequest<Drink | void> {
  const source = getCancelSource();
  const request = axios
    .get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`, {
      cancelToken: source.token,
    })
    .then((res) => res.data)
    .then((data) => transformCockatailFromAPI(data.drinks[0]))
    .catch(handleCancellation);
  return { cancel: source.cancel, request };
}

export function getIngredientPictureUrl(name: string) {
  return `https://www.thecocktaildb.com/images/ingredients/${name}.png`;
}
