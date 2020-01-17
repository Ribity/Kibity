import {UPDATE_STORY_LIST} from '../actions/storyListActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_story_list;

let storyListReducer;
export default storyListReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_STORY_LIST:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
};
