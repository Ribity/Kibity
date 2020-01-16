import {UPDATE_STORIES_LIST} from '../actions/storiesListActions';

const INITIAL_STATE = [];

let storiesListReducer;
export default storiesListReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_STORIES_LIST:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
};
