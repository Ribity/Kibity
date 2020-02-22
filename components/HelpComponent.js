import React from 'react';
import {View} from 'react-native';

import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import {HelpAudio} from './helpModals/HelpAudio';
import {HelpStories} from './helpModals/HelpStories';
import {HelpProfiles} from './helpModals/HelpProfiles';
import {HelpSettings} from './helpModals/HelpSettings';
import {HelpSettingsAudio} from './helpModals/HelpSettingsAudio';
import {HelpProfileSetActive} from './helpModals/HelpProfileSetActive';
import {HelpProfileCustomize} from './helpModals/HelpProfileCustomize';
export const HelpComponent= ( {screen, parm1} ) => {
    try {
        myfuncs.myBreadCrumbs('HelpComponent', 'HelpComponent');
        return (

        <View style={helpStyles.modalStyle}>

            {screen === "Audio" &&
            <HelpAudio/>
            }
            {screen === "Stories" &&
            <HelpStories/>
            }
            {screen === "Profiles" &&
            <HelpProfiles/>
            }
            {screen === "ProfileSetActive" &&
            <HelpProfileSetActive/>
            }
            {screen === "ProfileCustomize" &&
            <HelpProfileCustomize/>
            }
            {screen === "Settings" &&
            <HelpSettings/>
            }
            {screen === "SettingsAudio" &&
            <HelpSettingsAudio/>
            }

        </View>
        );
    } catch (error) {
        myfuncs.myRepo(error);
    }
};
