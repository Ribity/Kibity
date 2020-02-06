import React from 'react';
import {View} from 'react-native';
import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import {HelpAudio} from './helpModals/HelpAudio';
import {HelpStories} from './helpModals/HelpStories';
import {HelpProfiles} from './helpModals/HelpProfiles';
import {HelpSettings} from './helpModals/HelpSettings';
import {HelpProfileCustomize} from './helpModals/HelpProfileCustomize';
export const HelpComponent= ( {screen, parm1} ) => {
    try {
        return <View style={helpStyles.modalStyle}>

            {screen === "Audio" &&
            <HelpAudio/>
            }
            {screen === "Stories" &&
            <HelpStories/>
            }
            {screen === "Profiles" &&
            <HelpProfiles/>
            }
            {screen === "ProfileCustomize" &&
            <HelpProfileCustomize/>
            }
            {screen === "Settings" &&
            <HelpSettings/>
            }

        </View>;
    } catch (error) {
        myfuncs.mySentry(error);
    }
};
