import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CocktailsDetails from './screens/CocktailDetails';
import CocktailList from './components/CocktailList';
import FavoritesContextProvider from './contexts/favorites';

const Stack = createStackNavigator();

function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
        <FavoritesContextProvider>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name='Cocktails' component={CocktailList} />
            <Stack.Screen
              name='Cocktail details'
              options={{ headerShown: true }}
              component={CocktailsDetails}
            />
          </Stack.Navigator>
        </FavoritesContextProvider>
      </NavigationContainer>
    </>
  );
}

export default App;
