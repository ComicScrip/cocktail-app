import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CocktailsDetails from './CocktailDetails';
import CocktailList from './CocktailList';

const Stack = createStackNavigator();

function App() {
  return (
    <>
      <StatusBar />
      <NavigationContainer>
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
      </NavigationContainer>
    </>
  );
}

export default App;
