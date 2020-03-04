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
				The 'Stories' tab presents a list of all stories in the Kibity
				library. Simply tap a story and it will start playing.
				{"\n"}
				{"\n"}
				If you cannot hear the story, ensure the hardware switches on your
				device are correct and the volume is turned up. On iPhones the
				Ring/Silent switch on the left side must be ON/UP
				for Kibity stories to be heard.
				{"\n"}
				{"\n"}
				We encourage you to write your own story. Send it to us at Stories@kibity.com
				and we will publish it for all Kibity users to enjoy.
				{"\n"}
				{"\n"}
				You may utilize the search field to narrow the existing/current list of
				stories.  The search field is 'inclusive'.
				If you type 'summer' in the search field, only stories containing
				'summer' in the pertinent data of each story will be displayed. If you
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
				Add a story to the active profile's 'Favorites' by tapping the grey heart icon to the right of
				each story in the scrollable list.
				The Favorites list for each profile persists until you modify the Favorites list for that profile.
				We suggest keeping Favorites lists as a permanent/persistent list of
				favorite stories for each profile.
				You may play the entire Favorites list non-stop.
				{"\n"}
				{"\n"}
				Add a story to 'PlayList' by tapping the icon just below the heart on the right of
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
				What is 'ALL Toddlers Boys Girls Other'?
				These are one-click filters that are independent of the ShowFaves and ShowPlayList.
				It defaults to show ALL stories. If you tap 'Toddlers', the current list
				will be narrowed to only stories that target toddlers.
				If you tap 'Girls', the list will eliminate stories that target
				Boys. We say 'eliminate Boys' because tapping 'Girls' will show
				all stories targeted to girls as well as all generic stories, not just stories targeted for girls.
				{"\n"}
				{"\n"}
				'Other' will present a screen of one-click buttons to filter the stories. For example, tap
				'Other', then tap 'Kibity Originals'. That will filter the list of stories to show ONLY
				the Kibity Original stories (stories that are exclusive to Kibity). Or tap 'Age/5' to list
				all stories that are suggested for a five-year-old.
				{"\n"}
				{"\n"}
				Summary/Example: There are three independent types of filters. The very top allows you to filter on
				Favorites or Playlist.  The purple line allows you to quick-filter on subjects. And you
				may use the Search field for your specific search. Let's say you have an eight-year-old son.
				First, we suggest you customize his profile via the 'Profiles/Customize' tab. Then on this
				stories list, tap 'Other' then hit the 'Age/8' button, then type 'science' in the search
				field.
				{"\n"}
				{"\n"}
				If you have an existing Favorites list, you'll see a 'Play Faves' button near the top. Tapping
				'Play Faves' will immediately begin playing the favorite stories. Same for 'Play PlayList'
				Playing your favorites or playlist will play the entire list of stories, then start over,
				repeating endlessly.
			   </Text>
			</KeyboardAwareScrollView>
		);
    } catch (error) {
	myfuncs.myRepo(error);
    }
};
