import {UPDATE_PROFILES, SET_STORY_IDX, SET_LIST_IDX, SET_LIST_TYPE,
    ADD_FAVORITE, ADD_PLAYLIST, REMOVE_PLAYLIST, REMOVE_FAVORITE} from '../actions/profilesActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_profiles;

let profilesReducer;
export default profilesReducer = (state = INITIAL_STATE, action) => {
    if (action.payload === null) {
        return state;
    }
    let temp_prof = state;
    let currIdx = state.profilesIdx;

    switch (action.type) {
        case UPDATE_PROFILES:
            console.log("reducer new redux profiles:", action.payload);
            return action.payload;
        case SET_STORY_IDX:
            // console.log("reducer currIdx:", currIdx, " currStoryIdx:", action.payload);
            temp_prof.profile[currIdx].currStoryIdx = action.payload;
            return temp_prof;
        case SET_LIST_TYPE:
            temp_prof.profile[currIdx].currListType = action.payload;
            return temp_prof;
        case SET_LIST_IDX:
            temp_prof.profile[currIdx].currListIdx = action.payload;
            return temp_prof;
        case ADD_FAVORITE:
            temp_prof.profile[currIdx].favorites.push(action.payload);
            return temp_prof;
        case ADD_PLAYLIST:
            temp_prof.profile[currIdx].playList.push(action.payload);
            return temp_prof;
        case REMOVE_FAVORITE:
            let index = temp_prof.profile[currIdx].favorites.indexOf(action.payload);
            if (index > -1)
                temp_prof.profile[currIdx].favorites.splice(index,1);
            return temp_prof;
        case REMOVE_PLAYLIST:
            let idx = temp_prof.profile[currIdx].playList.indexOf(action.payload);
            if (idx > -1)
                temp_prof.profile[currIdx].playList.splice(idx,1);
            return temp_prof;


        default:
            return state
    }
};
