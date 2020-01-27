
import React from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import { AppLoading } from 'expo';
// import * as Expo from 'expo';

import LoginApp from './navigation/AppNavigator';
// import MainApp from './navigation/MainTabNavigator';
import AppContainer from './navigation/MainTabNavigator';
import ApiKeys from './constants/ApiKeys';
import * as firebase from 'firebase';
import MyDefines from './constants/MyDefines';
import myfuncs from './services/myFuncs';
import { Notifications, Linking } from 'expo';
import * as Icon from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as Constants from 'expo-constants';
import Toast from 'react-native-easy-toast';

import * as Sentry from 'sentry-expo';

import { Provider } from 'react-redux';
import { rootReducer } from './reducers/RootReducer';
import { createStore } from 'redux';

import myStyles from "./myStyles";
// import DevAppContainer from "expo/build/environment/DevAppContainer";

const store = createStore(rootReducer);

let prefix = {};
export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            // notification: {},
            prefix: {},
            isLoadingComplete: false,
            isAuthenticationReady: false,
            isAuthenticated: false,
        };

        // Sentry.enableInExpoDevelopment = true;
        // Sentry.config(ApiKeys.sentry_dsn, {deactivateStacktraceMerging: false,}).install();
        Sentry.init({
            dsn: ApiKeys.sentry_dsn,
            enableInExpoDevelopment: true,
            debug: true
        });
        Sentry.setRelease("1.0.0");

        Sentry.configureScope(function(scope) {
            scope.setExtra("character_name", "Mighty Fighter");
        });

        myfuncs.init();
    }
    componentDidMount() {
        try {
            Linking.addEventListener('url', ({ url }) => this.handleEvent(url));
            Linking.getInitialURL().then(url => url && this.handleUrl(url));

            // console.log("Constants= " + JSON.stringify(Constants));
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
    componentWillUnmount() {
        Linking.removeEventListener('url', this.handleEvent);
    }
    handleEvent = url => {
        prefix = Linking.makeUrl('/');
    };

    handleUrl = url => {
        prefix = Linking.makeUrl('/');
    };

    render() {
        if (!this.state.isLoadingComplete || !this.state.isAuthenticationReady) {
            return (
                <AppLoading
                    startAsync={this._loadResourcesAsync}
                    onError={this._handleLoadingError}
                    onFinish={this._handleFinishLoading}
                />
            );
        } else {
            // console.log("Prefix2: ", this.state.prefix);
            // console.log("oProps: ", this.state.myPrefix);

            return (

                <Provider store={ store }>
                    <View style={styles.container}>

                        <Toast
                            ref="toast"
                            style={myStyles.myBigToastStyle}
                            position='top'
                            positionValue={0}
                            fadeOutDuration={5000}
                            opacity={.9}
                            textStyle={myStyles.myBigToast}
                        />

                        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
                        {(this.state.isAuthenticated) ? <AppContainer uriPrefix={prefix}/> : <LoginApp/> }
                    </View>
                </Provider>
            );
        }
    }

    _loadResourcesAsync = async () => {
        return Promise.all([
            // Asset.loadAsync([
            //   require('./assets/images/pink.png'),
            //   require('./assets/images/purple.png'),
            // ]),
            Font.loadAsync({
                // This is the font that we are using for our tab bar
                ...Icon.Ionicons.font,
                // We include SpaceMono because we use it in HomeScreen.js. Feel free
                // to remove this if you are not using it in your app
                // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            }),
        ]);
    };

    _handleLoadingError = error => {
        console.warn(error);
        Sentry.captureException( error );
    };

    _handleFinishLoading = () => {
        this.setState({ isLoadingComplete: true });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});