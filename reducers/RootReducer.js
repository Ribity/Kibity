import { combineReducers } from 'redux'
import testReducer from './TestReducer'

export const rootReducer = combineReducers({
    test: testReducer,
});