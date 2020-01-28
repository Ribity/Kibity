import React from 'react';
import {View} from 'react-native';
import myfuncs from '../services/myFuncs';
import helpStyles from "./helpModals/helpStyles";
import HelpProfileSettings from './helpModals/HelpProfileSettings';

export default class HelpComponent extends React.Component {
    render() {
        try {
            return <View style={helpStyles.modalStyle}>

                {this.props.screen === "ProfileSettings" &&
                    <HelpProfileSettings/>
                }

            </View>;
        } catch (error) {
            myfuncs.mySentry(error);
        }
    }
}
