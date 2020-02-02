import React from 'react';
import { StyleSheet} from "react-native";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import {Ionicons} from '@expo/vector-icons';
import MyDefines from './constants/MyDefines';


import AudioScreen  from './screens/audio';
import StoriesScreen from './screens/stories';
import ProfilesScreen  from './screens/profiles';
import ProfileSettings  from './screens/profileSettings';
import SettingsScreen from './screens/settings';
import SettingsEndOfStory from './screens/SettingsEndOfStory';
import SettingsAudio from './screens/SettingsAudio';
import SettingsAbout from './screens/SettingsAbout';

let defNav = {
    headerStyle: {backgroundColor: MyDefines.myTabColor},
    headerTitleStyle: {color: MyDefines.myHeaderTextColor},
    headerBackTitleStyle: {color: MyDefines.myHeaderTextColor},
    headerTintColor: MyDefines.myHeaderTextColor,
};

const AudioStack = createStackNavigator({
    Audio: AudioScreen,
},
    {defaultNavigationOptions: () => (defNav)});

const StoriesStack = createStackNavigator({
    Stories: StoriesScreen,
}, {defaultNavigationOptions: () => (defNav)});

const ProfilesStack = createStackNavigator({
    Profiles: ProfilesScreen,
    ProfileSettings: ProfileSettings,
}, {defaultNavigationOptions: () => (defNav)});

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
    SettingsEndOfStory: SettingsEndOfStory,
    SettingsAudio: SettingsAudio,
    SettingsAbout: SettingsAbout,
}, {defaultNavigationOptions: () => (defNav)});

AudioStack.navigationOptions = {
    tabBarLabel: "Audio",
};
StoriesStack.navigationOptions = {
    tabBarLabel: 'Stories',
};
ProfilesStack.navigationOptions = {
    tabBarLabel: 'Profiles',
};
SettingsStack.navigationOptions = {
    tabBarLabel: 'Settings',
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
                labelStyle: {fontSize: 18},
                style: {
                    backgroundColor: MyDefines.myTabColor,
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