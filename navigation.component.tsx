import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { HomeScreen } from './screens/home.component';
import { DetailsScreen } from './screens/details.component';

const HomeNavigator = createStackNavigator({
    Home: HomeScreen,
    Details: DetailsScreen,
}, {
    headerMode: 'none',
});

export const AppNavigator = createAppContainer(HomeNavigator);