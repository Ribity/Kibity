import {UPDATE_SETTINGS} from '../actions/settingsActions';
import MyDefines from "../constants/MyDefines";

const INITIAL_STATE = MyDefines.default_settings;

let settingsReducer;
export default settingsReducer = (state = INITIAL_STATE, action) => {

    switch (action.type) {
        case UPDATE_SETTINGS:
            if (action.payload === null) {
                return state
            }
            return action.payload;

        default:
            return state
    }
};
