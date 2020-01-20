import {UPDATE_CURRENT_PROFILE} from '../actions/currentProfileActions';
import {SET_FAVORITES_IDX} from '../actions/currentProfileActions';
import {SET_PLAYLIST_IDX} from '../actions/currentProfileActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_current_profile;

let currentProfileReducer;
export default currentProfileReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_CURRENT_PROFILE:
            if (action.payload === null) {
                return state
            }
            return {...INITIAL_STATE, ...action.payload};   // this resets the keyFields that are in default_current_profile
                                                            // but not in default profiles. ie, the playList curr_indexes
        case SET_FAVORITES_IDX:
            if (action.payload === null) {
                return state
            }
            console.log("setFaveIdx:", state);
            let temp_fave = state;
            temp_fave.currFavoritesIdx = action.payload;
            return temp_fave;

        case SET_PLAYLIST_IDX:
            if (action.payload === null) {
                return state
            }
            let temp_play = state;
            temp_play.currPlayListIdx = action.payload;
            return temp_play;

        default:
            return state
    }
};
