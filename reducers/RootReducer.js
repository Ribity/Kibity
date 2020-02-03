import { combineReducers } from 'redux'
import storiesListReducer from './StoryListReducer'
import profilesReducer from './ProfilesReducer'
import settingsReducer from './SettingsReducer'


export const rootReducer = combineReducers({
    story_list: storiesListReducer,
    profiles: profilesReducer,
    settings: settingsReducer,

});