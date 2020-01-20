import {UPDATE_PROFILES} from '../actions/profilesActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_profiles;

let profilesReducer;
export default profilesReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_PROFILES:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
};
