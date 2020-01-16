import { combineReducers } from 'redux'
import storiesListReducer from './StoriesListReducer'

export const rootReducer = combineReducers({
    stories_list: storiesListReducer,
});