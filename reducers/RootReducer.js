import { combineReducers } from 'redux'
import storiesListReducer from './StoryListReducer'
import storyIdxReducer from './StoryIdxReducer'

export const rootReducer = combineReducers({
    story_list: storiesListReducer,
    story_idx: storyIdxReducer,
});