import {UPDATE_STORY_IDX} from '../actions/storyIdxActions';

const INITIAL_STATE = [];

let storyIdxReducer;
export default storyIdxReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_STORY_IDX:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
};
