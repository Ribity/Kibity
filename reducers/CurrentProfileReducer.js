import {UPDATE_CURRENT_PROFILE, SET_STORY_IDX, SET_LIST_IDX, SET_LIST_TYPE,
            ADD_FAVORITE, ADD_PLAYLIST, REMOVE_PLAYLIST, REMOVE_FAVORITE} from '../actions/currentProfileActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_current_profile;

let currentProfileReducer;
export default currentProfileReducer = (state = INITIAL_STATE, action) => {
    if (action.payload === null) {
        return state;
    }
    let temp_prof = state;
    switch (action.type) {
        case UPDATE_CURRENT_PROFILE:
            return {...INITIAL_STATE, ...action.payload};   // this resets the keyFields that are in default_current_profile// but not in default profiles. ie, the playList curr_indexes
        case SET_STORY_IDX:
            temp_prof.currStoryIdx = action.payload;
            return temp_prof;
        case SET_LIST_TYPE:
            temp_prof.currListType = action.payload;
            return temp_prof;
        case SET_LIST_IDX:
            temp_prof.currListIdx = action.payload;
            return temp_prof;
        case ADD_FAVORITE:
            temp_prof.favorites.push(action.payload);
            return temp_prof;
        case ADD_PLAYLIST:
            temp_prof.playList.push(action.payload);
            return temp_prof;
        case REMOVE_FAVORITE:
            let index = temp_prof.favorites.indexOf(action.payload);
            if (index > -1)
                temp_prof.favorites.splice(index,1);
            return temp_prof;
        case REMOVE_PLAYLIST:
            let idx = temp_prof.playList.indexOf(action.payload);
            if (idx > -1)
                temp_prof.playList.splice(idx,1);
            return temp_prof;
        default:
            return state
    }
};
