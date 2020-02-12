import React from 'react';
import {Text} from 'react-native';
import helpStyles from './helpStyles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import myfuncs from "../../services/myFuncs";

export const HelpStories = ( {} ) => {
    try {
	myfuncs.myBreadCrumbs('HelpStories', 'HelpStories');
		return (<KeyboardAwareScrollView
			// style={helpStyles.container}
			resetScrollToCoords={{x:0, y:0}}
			// contentContainerStyle={helpStyles.container}
		>

			<Text  style={helpStyles.helpText}>
				<Text style={helpStyles.helpBold}>Stories: </Text>
				The 'Stories' tab presents a full list of all stories in the Kibity
				library. Simply tap a story and it will start playing.
				{"\n"}
				{"\n"}
				If you cannot hear the story, ensure the hardware switches on your
				devices are correct and the volume is turned up. On iPhones the
				Ring/Silent switch on the left side must be ON/UP.
				for Kibity stories to be heard.
				{"\n"}
				{"\n"}
				You may utilize the search field to narrow the existing/current list of
				stories.  The search field is 'inclusive'.
				If you type 'summer' in the search field, only stories containing
				'summer' in each story's pertinent data will be displayed. If you
				type 'summer grandma', only the stories containing 'summer' AND
				'grandma' will be listed. You may type 'Grimm' to list only
				the stories that contain 'Grimm' (stories written by the Grimm brothers).
				The search field is powerful and may help quickly find a specific story.
				Note, our search only searches 'pertinent' data.  Pertinent data is the
				data we have subjectively added to the master story list for each story.

				{"\n"}
				{"\n"}
				The Favorites and PlayLists are per profile. You may have a different
				Favorites and PlayList for each of the three profiles.
				Add a story to 'Favorites' by tapping the heart on the right of the
				each story. The Favorites list persists until you modify the Favorites list.
				We suggest keeping Favorites lists as a permanent/persistent list of
				favorite stories for each profile.
				You may play the entire Favorites list non-stop.
				{"\n"}
				{"\n"}
				Add a story to 'PlayList' by tapping the 'list' icon just below the heart on the right of the
				each story.  A profile's Playlist persists until you modify the PlayList.
				You may play your entire Playlist non-stop.
				{"\n"}
				{"\n"}
				We suggest using your PlayList as a 'current' list of stories to play.  For example, if you
				enjoy a story, add it to Favorites.  Then each time you want to listen to specific favorites
				tap ShowPlayList at the top right. That will present
				a list of stories in the current Playlist.  Remove any story you do not wish to hear
				today.	Then tap the 'ShowFaves' at the top left and add stories from Favorites to the
				PlayList. Then play your PlayList.
				{"\n"}
				{"\n"}
				What is 'Filter'?  Filter is independent of the ShowFaves and ShowPlayList.
				Filter defaults to show ALL stories. If you tap 'Toddlers', the current list
				will be narrowed to only stories that target toddlers.
				If you tap 'Girls', the list will eliminate stories that are target
				Boys. We say 'eliminate Boys' because tapping 'Girls' will show
				all stories targeted to girls as well as all generic stories.
				{"\n"}
				{"\n"}
				If you have an existing Favorites list, you'll see a 'Play Faves' button near the top. Tapping
				'Play Faves' will immediately begin playing the favorite stories. Same for 'Play PlayList'
				{"\n"}
				{"\n"}

			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.mySentry(error);
    }
};
