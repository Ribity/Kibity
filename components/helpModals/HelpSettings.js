import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpSettings = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpSettings', 'HelpSettings');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Settings: </Text>
				When you modify a setting, you do not have to 'Save' it. It's automatically saved and
				persists.
				{"\n"}
				{"\n"}
				Turning ON 'Keep Screen Awake' will override your device settings
				and NOT go to sleep while the Kibity app is in the foreground on your screen.
				We turn this ON by default to keep the stories playing and not
				going to sleep.
				{"\n"}
				{"\n"}
				By default, we play a 'Ribbit' sound after each story is told.
				You may disable this if you like.  If you disable, we'll say 'The End' instead.
				{"\n"}
				{"\n"}
				By default, we pause 1 second after each line is spoken. You may modify this if you like.
				Note, for most toddler stories we pause additional seconds. You should see in the stories
				list the specified additional pause for each specific toddler story.
				{"\n"}
				{"\n"}
				By default, we pause 3 seconds after each story. You may modify this for your liking.
				{"\n"}
				{"\n"}
				The last two settings specify the pitch and speed of the voice for the stories. These
				are mostly for fun.  Set them as you like.
				{"\n"}
				{"\n"}
				If your device offers addtional voices, you'll see a 'Select Voice' button. Click
				that button to see a list of additional voices you can use.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
