import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpAudio = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpAudio', 'HelpAudio');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Audio: </Text>
				If you cannot hear the story as it's playing, ensure the hardware switches on your
				devices are correct and the volume is turned up. On iPhones, the
				Ring/Silent hardware switch on the left side of the device must be ON/UP
				for Kibity stories to be heard.
				{"\n"}
				{"\n"}
				This screen allows you to control the story as it's being told.
				Also, you'll see each sentence displayed as it's being read aloud.
				You may tap 'Settings' on the very bottom right and increase the pause
				between each line that is spoken/displayed. Increasing the pause may allow
				listeners that are beginning to read a longer time to process each sentence
				as they attempt to read it in their minds.
				{"\n"}
				{"\n"}
				Also in 'Settings', you can speed up the voice, or slow it down.
				{"\n"}
				{"\n"}
				Depending on your device, 'Settings' may present you with a list of
				other voices to choose from.
				{"\n"}
				{"\n"}
				To easily switch to a different active profile, you may tap the Active Profile
				on the top left of the Audio screen. If you change active profiles, the new profile will
				be used on the next story presented.  (The current story will finish with the previous
				profile).
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
}

