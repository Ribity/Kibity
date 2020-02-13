import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";


export const HelpSettingsAudio = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettings', 'HelpSettings');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Settings Audio: </Text>
				This screen is only available if your device offers additional
				voices. Select a voice, then hit Test.	If you like the voice,
				save it.  The voice you save will persist until you modify
				the voice via this screen again.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.mySentry(error);
    }
};
