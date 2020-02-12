import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpProfileCustomize = ( {} ) => {
    try {
        myfuncs.myBreadCrumbs('HelpProfileCustomize', 'HelpProfileCustomize');
		return (<KeyboardAwareScrollView
			resetScrollToCoords={{x:0, y:0}}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Profile Customize: </Text>
				Help Screen for customizing Profiles
				{"\n"}
				{"\n"}

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

