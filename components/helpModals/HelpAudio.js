import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

export const HelpAudio = ( {} ) => {
	return (<KeyboardAwareScrollView
	    // style={helpStyles.container}
	    resetScrollToCoords={{x:0, y:0}}
	    // contentContainerStyle={helpStyles.container}
	>

		<Text  style={helpStyles.helpText}>
			<Text style={helpStyles.helpBold}>Audio: </Text>
			Your point total is updated periodically. Not real time.
		    {"\n"}
		    {"\n"}
		    By default, a new user is an Advanced User.  If you would like
			to keep Ribity as simple to understand and operate as possible simply flip Advanced User to OFF.  Off will disable several
			options for searching, creating events, etc.
		    {"\n"}
		    {"\n"}
			Allow pop-up enables several additional popups that many users might find
			cumbersome and slow. For example, if you disable popups, when you create/drop a ribbon, you'll
			be taken directly to the Map screen instead of a popup giving you options to text or view
			the ribbon.
		    {"\n"}
		    {"\n"}
		    If "Keep Awake" is ON, your phone will not go to sleep if the Ribity application is on the screen.  Once
			Ribity is no longer the active application, your phone's Sleep/Display mode will operate according to your
			overall phone settings.
		    {"\n"}
		    {"\n"}
			The other (non-switch) settings will take to a new screen for additional settings/options.
		    {"\n"}
		    {"\n"}
			The "Sign Out" tab will immediately sign you out and take you to the Login screen.
		    {"\n"}
		    {"\n"}
			The "About" tab will display the background and history of Ribity.
            {"\n"}
            {"\n"}
            The "Disclaimer" tab will display a "We're not responsible" screen.
	       </Text>
	    </KeyboardAwareScrollView>
	);
}

