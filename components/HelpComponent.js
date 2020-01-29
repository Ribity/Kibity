import React from 'react';
import {View} from 'react-native';
import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import HelpAudio from './helpModals/HelpAudio';
import HelpStories from './helpModals/HelpStories';
import HelpProfiles from './helpModals/HelpProfiles';
import HelpSettings from './helpModals/HelpSettings';
import HelpProfileSettings from './helpModals/HelpProfileSettings';

export default class HelpComponent extends React.Component {
    render() {
        try {
            return <View style={helpStyles.modalStyle}>

                {this.props.screen === "Audio" &&
                <HelpAudio/>
                }
                {this.props.screen === "Stories" &&
                <HelpStories/>
                }
                {this.props.screen === "Profiles" &&
                <HelpProfiles/>
                }
                {this.props.screen === "ProfileSettings" &&
                <HelpProfileSettings/>
                }
                {this.props.screen === "Settings" &&
                <HelpSettings/>
                }

            </View>;
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
}
