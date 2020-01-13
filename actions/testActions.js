export const SET_TEST = 'SET_TEST';

export const setTest = boolVal => (
    {
        type: SET_TEST,
        payload: boolVal,
    }
);