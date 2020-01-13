import {SET_TEST} from '../actions/testActions';

let testReducer;
export default testReducer = (state = false, action) => {
    if (action.payload === null) {
        return state;
    }
    switch (action.type) {
        case SET_TEST:
            return action.payload;
        default:
            return state
    }
};
