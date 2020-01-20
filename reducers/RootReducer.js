import { combineReducers } from 'redux'
import storiesListReducer from './StoryListReducer'
import storyIdxReducer from './StoryIdxReducer'
import profilesReducer from './ProfilesReducer'
import currentProfileReducer from './CurrentProfileReducer'

export const rootReducer = combineReducers({
    story_list: storiesListReducer,
    story_idx: storyIdxReducer,
    profiles: profilesReducer,
    current_profile: currentProfileReducer,
});