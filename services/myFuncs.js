import hardStorage from "./deviceStorage";
import {Platform} from 'react-native'
import * as Sentry from "sentry-expo";
import MyDefines from '../constants/MyDefines';
import { Audio } from 'expo-av';
// import * as Localization from 'expo-localization';
import ApiKeys from '../constants/ApiKeys';
import * as Constants from 'expo-constants';
import * as Device from 'expo-device';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';

const SOUNDS = {};
let SOURCES = {};
let bSoundsAreLoaded = false;
let bSoundIsPlaying = false;

class myFuncs  {

    init = async () => {
        let settings = MyDefines.default_settings;
        let profiles = MyDefines.default_profiles;
        let new_user = false;
        try {
            this.initRepo();

            this.myBreadCrumbs('init', "myfuncs");

            if (MyDefines.clearAllStorage === true)
                await hardStorage.clearAll();

            new_user = await this.check_new_user();

            let retObj = await this.getUserSettingsFromLocalStorage();
            for (let i=0; i<3; i++) {
                if (retObj.profiles.profile[i].character.length === 3) {
                    retObj.profiles.profile[i].character[3] = JSON.parse(JSON.stringify(profiles.profile[i].character[3]));
                    retObj.profiles.profile[i].character[4] = JSON.parse(JSON.stringify(profiles.profile[i].character[4]));
                    retObj.profiles.profile[i].character[5] = JSON.parse(JSON.stringify(profiles.profile[i].character[5]));
                }
                if (retObj.profiles.profile[i].celebrity === null ||
                    retObj.profiles.profile[i].celebrity === undefined ||
                    retObj.profiles.profile[i].celebrity === "")
                    retObj.profiles.profile[i].celebrity = JSON.parse(JSON.stringify(profiles.profile[i].celebrity));
                if (retObj.profiles.profile[i].event === null ||
                    retObj.profiles.profile[i].event === undefined ||
                    retObj.profiles.profile[i].event === "")
                    retObj.profiles.profile[i].event = JSON.parse(JSON.stringify(profiles.profile[i].event));
                if (retObj.profiles.profile[i].snack === null ||
                    retObj.profiles.profile[i].snack === undefined ||
                    retObj.profiles.profile[i].snack === "")
                    retObj.profiles.profile[i].snack = JSON.parse(JSON.stringify(profiles.profile[i].snack));
            }


            settings = {...settings, ...retObj.settings};
            profiles = { ...profiles, ...retObj.profiles};

            // console.log("init after", profiles);

            this.prepareSound();

            this.loadSounds({
                // ribbit: {uri: "https://www.ribity.com/sounds/ribbit.wav"},
                ribbit: {uri: "https://ribity.com/sounds/ribbit2.wav"},
            });

            bSoundsAreLoaded = true;
            // this.audioPlayer = new Audio.Sound();
        } catch (error) {
            this.myRepo(error);
        }
        return {settings: settings, profiles: profiles, new_user: new_user};
    };
    check_new_user = async () => {
        let new_user = false;
        try {
            this.myBreadCrumbs('check_new_user', "myfuncs");
            let registered_user = await hardStorage.getKey("kibity_user");
            if (registered_user === null) {
                new_user = true;
                hardStorage.setKey("kibity_user", true);
                // console.log("new user");
                Sentry.captureMessage("New Kibity user", 'info');
            }
        } catch (error) {
            this.myRepo(error);
        }
        return new_user;
    };
    getUserSettingsFromLocalStorage = async () => {
        let settings = MyDefines.default_settings;
        let profiles = MyDefines.default_profiles;
        try {
            this.myBreadCrumbs('getUserSettingsFromLocalStorage', "myfuncs");
            let user_settings = await hardStorage.getKey("user_settings");
            if (user_settings !== null) {
                settings = {...settings, ...user_settings};
                if (MyDefines.log_details)
                    console.log("Successfully retrieved settings from Storage:", settings)
            }
            let user_profiles = await hardStorage.getKey("user_profiles");
            if (user_profiles !== null) {
                profiles = {...profiles, ...user_profiles};
                if (MyDefines.log_details)
                    console.log("Successfully retrieved profiles from Storage:", profiles)
            }
        } catch (error) {
            this.myRepo(error);
        }
        // console.log("settingsFromStorage:", settings);
        // console.log("profilesFromStorage:", profiles);
        settings.retrieved_user_data = true;
        profiles.retrieved_user_data = true;
        return {settings: settings, profiles: profiles};
    };
    writeUserDataToLocalStorage = async (key, data) => {
        try {
            this.myBreadCrumbs('writeUserDataToLocalStorage', "myfuncs");

            await hardStorage.setKey(key, data);
            // console.log("storage updated ", key, ":", data );

            if (MyDefines.log_details)
                console.log("user_data written to Storage:", key, ":", data );
        } catch (error) {
            this.myRepo(error);
        }
    };
    initRepo = () => {
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
            // Sentry.configureScope(function (scope) {
            //     scope.setExtra("myExtraData", {
            //         "local_timezone": Localization.timezone,
            //     });
            // });
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
                    // "releaseChannel": Constants.default.releaseChannel,
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
            this.myRepo(error);
        }
    };
    playRibbit = async (routeName) => {
        try {
            this.myBreadCrumbs('playRibbit', routeName);

            if (!bSoundsAreLoaded)
                return;

            // console.log("Play Ribbit");
            await this.playSound("ribbit");
            // console.log("Ribbit played");
        } catch (error) {
            this.myRepo(error);
        }
    };
    prepareSound = async () => {
        try {
            this.myBreadCrumbs('prepareSound', "myfuncs");
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
        } catch (error) {
            this.myRepo(error);
        }
    };

    loadSounds(sources) {
        try {
            this.myBreadCrumbs('loadSounds', "myfuncs");
            SOURCES = {...SOURCES, ...sources};
        } catch (error) {
            this.myRepo(error);
        }
    }

    playSound = async (key) => {
        try {
            this.myBreadCrumbs('playSound', "myfuncs");
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
            this.myRepo(error);
        }
        setTimeout(this.resetSound, 1000);
    };
    resetSound = () => {
        bSoundIsPlaying = false;
    };
    myRepo = (error) => {
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
    setAwakeorNot = (bKeepAwake) => {
        if (bKeepAwake) {
            activateKeepAwake();
        } else {
            deactivateKeepAwake();
        }
    };
    shortenName = (name, length) => {
        // console.log("Shorten name: ", name, " len: ", length);
        let short_name = name.substr(0, length);
        let space_ofs = short_name.lastIndexOf(" ");
        if (space_ofs > 0)
            short_name = short_name.substr(0, space_ofs);

        // console.log("Short: ", short_name);
        return short_name;
    };
    isEmpty = (myObj) => {
        return !myObj || Object.keys(myObj).length === 0;
    };
    isAndroid = () => {
        if (Platform.OS === 'android')
            return true;
        else
            return false;
    };
    reviewChosen = async () => {
        await hardStorage.setKey("reviewedApp", true);
    };
    hasUserReviewed = async () => {
        let reviewedApp = await hardStorage.getKey("reviewedApp");
        if (reviewedApp !== null) {
            if (reviewedApp === true)
                return true;
        }
        return false;
    };
    incrementNumStoriesPlayed = async () => {
        let numPlayed = await hardStorage.getKey("numPlayed");

        if (numPlayed !== null) {
            numPlayed++;
        } else {
            numPlayed = 1;
        }
        await hardStorage.setKey("numPlayed", numPlayed);

        if (Constants.isDevice || Constants.default.isDevice) {
            if (numPlayed === 5 || numPlayed === 20 || numPlayed % 100 === 0) {
                let msg = 'Number of Stories Played = ' + numPlayed.toString();
                Sentry.captureMessage(msg, 'info');
            }
        }
        return numPlayed;
    }
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

