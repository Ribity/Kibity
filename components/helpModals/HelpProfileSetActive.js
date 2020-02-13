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
				There is one exactly one active profile. The customized names of the active profile is used
				for stories that read aloud.
				{"\n"}
				{"\n"}
				Tap the name in the box. Then tap the profile you wish to make active.
				{"\n"}
				{"\n"}
				You new active profile is automatically made active immediately. However, if a story is currently
				playing, the new active profile will be used for the next story.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.mySentry(error);
    }
};

