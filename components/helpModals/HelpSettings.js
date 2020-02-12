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
				Help Screen for main Settings
				{"\n"}
				{"\n"}

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
        myfuncs.mySentry(error);
    }
};

