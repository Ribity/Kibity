import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {Ionicons} from '@expo/vector-icons';
import MyDefines from './constants/MyDefines';


import AudioScreen  from './screens/audio';
import StoriesScreen from './screens/stories';
import ProfilesScreen  from './screens/profiles';
import SettingsScreen from './screens/settings';

const AudioStack = createStackNavigator({
    Audio: AudioScreen,
});
const StoriesStack = createStackNavigator({
    Stories: StoriesScreen,
});
const ProfilesStack = createStackNavigator({
    Profiles: ProfilesScreen,
});
const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
});

AudioStack.navigationOptions = {
    tabBarLabel: "Audio",
};
StoriesStack.navigationOptions = {
    title: 'Stories',
    };
ProfilesStack.navigationOptions = {
    title: 'Profiles',
};
SettingsStack.navigationOptions = {
    title: 'Settings',
};

const bottomTabNavigator = createBottomTabNavigator({
    AudioStack,
    StoriesStack,
    ProfilesStack,
    SettingsStack,
}, {
     defaultNavigationOptions: ({ navigation }) => ({
         tabBarOptions: {
                activeTintColor: 'purple',
                inactiveTintColor: 'gray',
                showIcon: true,
                labelStyle: {
                    fontSize: 18,
                },
                style: {
                    backgroundColor: 'white',
                    height: MyDefines.myBottomTabBarHeight,
                },
         },
         tabBarIcon: ({ focused, horizontal, tintColor }) => {
             const { routeName } = navigation.state;
             let iconName;
             if (routeName === 'AudioStack') {
                 iconName = focused
                     ? 'ios-play'
                     : 'ios-play-circle';
             } else if (routeName === 'StoriesStack') {
                 iconName = 'ios-book';
             } else if (routeName === 'ProfilesStack') {
                 iconName = 'ios-person';
             } else if (routeName === 'SettingsStack') {
                 iconName = 'ios-settings';
             }
             // You can return any component that you like here!
             return <Ionicons name={iconName} size={20} color={tintColor} />;
             },
        }),
    });

export const AppNavigator = createAppContainer (bottomTabNavigator);