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
				The more fields you customize for each profile, the better each
				Kibity story will be for your family.
				{"\n"}
				{"\n"}
				Be sure to SAVE any modifications you make. Once you go back to the main
				profile screen, any unsaved changes in the Customize Profile screen will be discarded.
				There are three potential profiles you may set up.
				If you have three kids, you may wish to set up a separate profile for each kid.
				You set up one profile at a time, save it, then go set up a second profile.
				{"\n"}
				{"\n"}
				There are default values already populating each field. You may modify one or all
				of the fields to better customize the story for your kid's profile.
				Once you've modified and saved a profile, be sure to make that profile ACTIVE
				in order for the stories to use the characters you have specified for the profile.
				{"\n"}
				{"\n"}
				Typically, your kid's first name is the name of the main character.
				You do not need to save after each field. But you must hit SAVE when you've
				completed each profile.  Also, be sure to select a pronoun for each character.
				{"\n"}
				{"\n"}
				Second and third characters could be a sibling, or friend, or neighbor, or a pet's name
				or Mom, or Grandpa, or The Beatles, or the shortstop for the Yankees. Typically
				2nd and 3rd characters are best friends or siblings.
				{"\n"}
				{"\n"}
				The town is typically your hometown.
				{"\n"}
				{"\n"}
				The pet fields are typically your actual pet and pet's name,
				but these fields could be 'Tyrannosaurus Rex' and 'Charlie Brown' if you like.
				{"\n"}
				{"\n"}
				Again, be sure to save before going back to the main Profiles screen.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};

