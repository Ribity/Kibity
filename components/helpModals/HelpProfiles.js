import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpProfiles = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpProfiles', 'HelpProfiles');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Profiles: </Text>
				 This screen presents several options to go to
				 additional screens.
				{"\n"}
				{"\n"}
				You may tap 'Select Active Profile' to set a new active profile.
				All stories presented/spoken by Kibity use the characters specified
				in the profile that is 'active'.
				{"\n"}
				{"\n"}
				Below the Kibity logo are three buttons that allow you to
				customize each of the three profiles.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.mySentry(error);
    }
}

