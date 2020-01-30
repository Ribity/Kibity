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
import ProfileSettingsScreen  from './screens/profileSettingsScreen';
import SettingsScreen from './screens/settings';
import SettingsAudioScreen from './screens/SettingsAudioScreen';
import SettingsAboutScreen from './screens/SettingsAboutScreen';

let defNav = {
    headerStyle: {backgroundColor: 'goldenrod'},
    headerTitleStyle: {color: 'purple'},
    headerBackTitleStyle: {color: 'purple'},
    headerTintColor: 'purple',
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
    ProfileSettings: ProfileSettingsScreen,
}, {defaultNavigationOptions: () => (defNav)});

const SettingsStack = createStackNavigator({
    Settings: SettingsScreen,
    SettingsAudio: SettingsAudioScreen,
    SettingsAbout: SettingsAboutScreen,
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
                    backgroundColor: 'goldenrod',
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