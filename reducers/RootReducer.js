import { combineReducers } from 'redux'
import storiesListReducer from './StoryListReducer'
import profilesReducer from './ProfilesReducer'
import currentProfileReducer from './CurrentProfileReducer'
import settingsReducer from './SettingsReducer'


export const rootReducer = combineReducers({
    story_list: storiesListReducer,
    profiles: profilesReducer,
    current_profile: currentProfileReducer,
    settings: settingsReducer,

});