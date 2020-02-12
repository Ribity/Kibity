import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpProfileSetActive = ( {} ) => {
    try {
        myfuncs.myBreadCrumbs('HelpProfileSetActive', 'HelpProfileSetActive');
		return (<KeyboardAwareScrollView
			resetScrollToCoords={{x:0, y:0}}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Set Active Profile: </Text>
				Help Screen  for setting active profile
				{"\n"}
				{"\n"}

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

