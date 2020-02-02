import hardStorage from "./deviceStorage";
import * as Sentry from "sentry-expo";
import MyDefines from '../constants/MyDefines';
import {Alert} from "react-native";
import { Linking } from 'expo';
import { Audio } from 'expo-av';
import * as SMS from 'expo-sms';
// import * as MailComposer from 'expo-mail-composer';
import * as Localization from 'expo-localization';
import ApiKeys from '../constants/ApiKeys';
import * as Constants from 'expo-constants';
import * as Device from 'expo-device';
// import {connect} from "react-redux";
// import {bindActionCreators} from "redux";
// import {updateSettings} from "../actions/settingsActions";

import * as Speech from "expo-speech";

const SOUNDS = {};
let SOURCES = {};
let bSoundsAreLoaded = false;
let bSoundIsPlaying = false;

class myFuncs  {

    init = async () => {
        let settings = MyDefines.default_settings;
        let new_user = false;
        try {
            this.initSentry();

            new_user = await this.check_new_user();
            let new_settings = await this.getUserSettingsFromLocalStorage();
            if (new_settings !== null)
                settings = {...settings, ...new_settings};

            this.prepareSound();

            this.loadSounds({
                // ribbit: {uri: "https://www.ribity.com/sounds/ribbit.wav"},
                ribbit: {uri: "https://ribity.com/sounds/ribbit2.wav"},
            });

            bSoundsAreLoaded = true;
            // this.audioPlayer = new Audio.Sound();
        } catch (error) {
            console.log("Send Sentry");
            this.mySentry(error);
        }
        return {settings: settings, new_user: new_user};
    };
    check_new_user = async () => {
        let new_user = false;
        try {
            let registered_user = await hardStorage.getKey("kibity_user");
            if (registered_user === null) {
                new_user = true;
                hardStorage.setKey("kibity_user", true);
                console.log("new user");
                Sentry.captureMessage("New Kibity user", 'info');
            }
        } catch (error) {
            this.mySentry(error);
        }
        return new_user;
    };
    getUserSettingsFromLocalStorage = async () => {
        let settings = MyDefines.default_settings;
        try {
            settings = await hardStorage.getKey("user_settings");
            // if (settings !== null) {
            //     console.log("Got User Settings from localDeviceStorage: ", settings);
            // } else {
            //     console.log("Error reading User Settings from localDeviceStorage");
            // }
        } catch (error) {
            this.mySentry(error);
        }
        // console.log("newsto:", settings);
        settings.retrieved_user_data = true;
        return settings;
    };
    writeUserSettingsToLocalStorage = async (settings) => {
        try {
            await hardStorage.setKey("user_settings", settings);
            // console.log("storage updated NewSettings:", settings);

            if (MyDefines.log_details)
                console.log("user_settings written to Storage");
        } catch (error) {
            this.mySentry(error);
        }
    };
    initSentry = () => {
        try {
            Sentry.init({
                dsn: ApiKeys.sentry_dsn,
                enableInExpoDevelopment: true,
                debug: true,
                beforeSend(event) {
                    console.log("sending to Sentry");
                    return event;
                }
            });
            Sentry.setRelease("1.0.0");
            Sentry.configureScope(function (scope) {
                scope.setExtra("myExtraData", {
                    // "releaseChannel": releaseChan,
                    "local_timezone": Localization.timezone,
                });
            });
            Sentry.configureScope(function (scope) {
                scope.setExtra("expoConstants", {
                    // "releaseChannel": releaseChan,
                    "appOwnership": Constants.default.appOwnership,
                    "debugMode": Constants.default.debugMode,
                    "deviceId": Constants.default.deviceId,
                    "deviceName": Constants.default.deviceName,
                    "deviceYearClass": Constants.default.deviceYearClass,
                    "experienceUrl": Constants.default.experienceUrl,
                    "expoRuntimeVersion": Constants.default.expoRuntimeVersion,
                    "expoVersion": Constants.default.expoVersion,
                    "platform": Constants.default.platform,
                    "installationId": Constants.default.installationId,
                    "isDetached": Constants.default.isDetached,
                    "isDevice": Constants.default.isDevice,
                    "sessionId": Constants.default.sessionId,
                    "isHeadless": Constants.default.isHeadless,
                    "statusBarHeight": Constants.default.statusBarHeight,
                    "supportedExpoSdks": Constants.default.supportedExpoSdks,
                    "releaseChannel": Constants.default.releaseChannel,
                });
            });
            Sentry.configureScope(function (scope) {
                scope.setExtra("deviceInfo", {
                    "brand": Device.brand,
                    "manufacturer": Device.manufacturer,
                    "modelId": Device.modelId,
                    "modelName": Device.modelName,
                    "osBuildId": Device.osBuildId,
                    "osInternalBuildId": Device.osInternalBuildId,
                    "osName": Device.osName,
                    "osVersion": Device.osVersion,
                    "osTotalMemory": Device.totalMemory,
                });
            });
        } catch (error) {
            console.log("Send Sentry");
            this.mySentry(error);
        }
    };
    playRibbit = async (routeName) => {
            try {
                this.myBreadCrumbs('playRibbit', routeName);

                if (!bSoundsAreLoaded)
                    return;

                console.log("Play Ribbit");
                await this.playSound("ribbit");
                // console.log("Ribbit played");
            } catch (error) {
                console.log("Ribbit audio error:", error);
                // this.mySentry(error);
            }
    };
    prepareSound = async () => {
        await Audio.setIsEnabledAsync(true);
        if (MyDefines.detail_logging)
            console.log('Set Expo.Audio enabled');
        await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: true,  // added June 6, 2019.  With Expo v33.0 an exception was requiring this
            allowsRecordingIOS: false,
            interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
            shouldDuckAndroid: false,
            interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
            playThroughEarpieceAndroid: false,
        });
        if (MyDefines.detail_logging)
            console.log('Set Expo.Audio mode');
    };

    loadSounds(sources) {
        SOURCES = {...SOURCES, ...sources};
    }

    playSound = async (key) => {
        try {
            if (bSoundIsPlaying)    // PlayAsync kept sending an exception to Sentry occasionally. Trying this to fix it.
                return;

            bSoundIsPlaying = true;
            if (SOUNDS[key]) {
                // console.log("That sound has already been played, let's reload.");
                await SOUNDS[key].unloadAsync();
                // console.log('Sound unloaded successfully!');
            } else {
                // console.log('New sound to play!');
                SOUNDS[key] = new Audio.Sound();
            }

            try {
                // console.log("LoadAsync");
                await SOUNDS[key].loadAsync(SOURCES[key]);
                // console.log("LoadAsync completed");
            } catch (error) {
                console.log("Ignore: Sound was already loading");
            }

            // console.log('Sound loaded successfully!');
            SOUNDS[key].playAsync();
            // console.log('Playing ' + key);
        } catch (error) {
            console.log("Exception playSound");
            // this.mySentry(error);
        }
        setTimeout(this.resetSound, 1000);
    };
    resetSound = () => {
        bSoundIsPlaying = false;
    };

    mySentry = (error) => {
        try {
            Sentry.captureException(error);
        } catch (error) {
            console.log(error);
        }
    };
    myBreadCrumbs = (message, category) => {
        try {
            if (MyDefines.sentry_logging  && MyDefines.console_log_breadcrumbs) {
                    let bc_object = {
                    message: message,
                };
                if (category !== undefined) {
                    bc_object.category = category;
                }
                Sentry.addBreadcrumb(bc_object);
                if (MyDefines.console_log_breadcrumbs) {
                    if (category !== undefined)
                        console.log(message, ":", category);
                    else
                        console.log(message);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    sendToRecipient = async (ribbon_or_event, routeName, bRibbon) => {
        try {
            this.myBreadCrumbs('sendToRecipient', routeName);
            let type = "ribbon";

            if (bRibbon === false)
                type = "event";

            // console.log("SMS or Email the ribbon");

            Alert.alert(ribbon_or_event.name,"Click to Text or Email this " + type + " using your normal services",
                [
                    {text: 'Text', onPress: () => {this.textTheRecipient(ribbon_or_event, routeName, bRibbon)} },
                    // {text: 'EMail', onPress: () => {this.emailTheRecipient(ribbon_or_event, routeName, bRibbon)} },
                    {text: 'Never mind'},
                ]);
        } catch (error) {
            myfuncs.mySentry(null);
        }
    };

    buildContactMsg = (ribbon_or_event, bRibbon) => {
        let msg;
        let type = "ribbon";

        if (bRibbon === false)
            type = "event";
        // if (ribbon_or_event.creator_id === funcsUserParms.user_id)
        //     msg = "I created a Ribity " + type + " that may interest you:" + "\r\n'" + ribbon_or_event.name + "'";
        // else
            msg = "This Ribity " + type + " may interest you:" + "\r\n'" + ribbon_or_event.name + "'";

        if (bRibbon === false) {
            if (ribbon_or_event.end_address.length > 0 )
                msg += "\r\nDestination: " + ribbon_or_event.end_address;
            if (ribbon_or_event.sponsor.length > 0)
                msg += "\r\nPledge by: " + ribbon_or_event.sponsor;
            msg += "\r\nClick the following link to view it:";
            msg += "\r\n" + Linking.makeUrl("event/" + ribbon_or_event.id);
        } else {
            msg += "\r\nRibbonId #:  " + ribbon_or_event.id;
            if (ribbon_or_event.start_address.length > 0)
                msg += "\r\nStarting address: " + ribbon_or_event.start_address;
            if (ribbon_or_event.bearing_desc !== "Wandering")
                msg += "\r\nCurrently Headed: " + ribbon_or_event.bearing_desc;
            else
                msg += "\r\n" + ribbon_or_event.bearing_desc;
            if (ribbon_or_event.end_address.length > 0)
                msg += "\r\nDestination: " + ribbon_or_event.end_address;
            if (ribbon_or_event.public_message.length > 0)
                msg += "\r\n'" + ribbon_or_event.public_message + "'";
            msg += "\r\nClick the following link to vuew it:";
            msg += "\r\n" + Linking.makeUrl("ribbon/" + ribbon_or_event.id);
        }
        return(msg);
    };

    textTheRecipient = async (ribbon_or_event, routeName, bRibbon) => {
        try {
            this.myBreadCrumbs('textTheRecipient', routeName);
            // console.log("Text the ribbon or event: ", ribbon_or_event);
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                // console.log("SMS is available on this device");
                // await SMS.sendSMSAsync(['9196968390'], this.buildContactMsg(ribbon));  -- you can specify a phone number in if desired.
                try {
                    await SMS.sendSMSAsync([], this.buildContactMsg(ribbon_or_event, bRibbon));
                } catch (error) {
                    alert("SMS Texting not available on your device");
                }
            } else {
                console.log("SMS is NOT available on this device");
            }
        } catch (error) {
            this.mySentry(error);
        }
    };

    // emailTheRecipient = async (ribbon_or_event, routeName, bRibbon) => {
    //     try {
    //         this.myBreadCrumbs('emailTheRecipient', routeName);
    //
    //         // console.log("EMail the ribbon or event: ", ribbon_or_event);
    //
    //         // let myImage = myimages.getImage(ribbon_or_event.image);
    //
    //         let options = {
    //             // recipients: ['mark_king@yahoo.com'],
    //             subject: ribbon_or_event.name,
    //             body: this.buildContactMsg(ribbon_or_event, bRibbon),
    //             // attachments: [myImage]
    //         };
    //         try {
    //             MailComposer.composeAsync(options)
    //         } catch (error) {
    //             alert("EMail is not available on your device");
    //         }
    //
    //     } catch (error) {
    //         this.mySentry(error);
    //     }
    // };
    playSpeech = (text, date) => {
        try {
            this.myBreadCrumbs('playTest', "MyFuncs");


            Speech.speak(text, {
                // voice: "com.apple.ttsbundle.Samantha-compact",
                // language: 'en',
                pitch: 0.9,
                rate: 0.9,
                // onDone: this.Done,
                // onStopped: this.Stopped,
                // onStart: this.Started,
            });

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    Done = () => {
        console.log("Speech Done");
    };
    Stopped = () => {
        console.log("Speech Stopped");
    };
    Started = () => {
        console.log("Speech Started");
    };
    pauseSpeech = () => {
        try {
            Speech.pause();

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    resumeSpeech = () => {
        try {
            Speech.resume();

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };
    stopSpeech = () => {
        try {
            Speech.stop();

        } catch (error) {
            myfuncs.mySentry(error);
        }
    };

    isEmpty = (myObj) => {
        return !myObj || Object.keys(myObj).length === 0;
    };
    androidPadding = (textFocused, extraPad) => {
        let padLines = 0;
        if (Platform.OS === 'android' && textFocused === true)
            padLines = 100 + extraPad;
        return(padLines);
    };
    isAndroid = () => {
        if (Platform.OS === 'android')
            return true;
        else
            return false;
    };
    sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
}

const myfuncs = new myFuncs();
export default myfuncs;

// const mapStateToProps = (state) => {
//     const { settings } = state;
//     return { settings }
// };
// const mapDispatchToProps = dispatch => (
//     bindActionCreators({
//         updateSettings,
//     }, dispatch)
// );
// export default connect(mapStateToProps, mapDispatchToProps)(myfuncs);

