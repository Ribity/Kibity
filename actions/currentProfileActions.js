export const UPDATE_CURRENT_PROFILE = 'UPDATE_CURRENT_PROFILE';
export const SET_STORY_IDX = 'SET_STORY_IDX';
export const SET_LIST_TYPE = 'SET_LIST_TYPE';
export const SET_LIST_IDX = 'SET_LIST_IDX';
export const ADD_FAVORITE = 'ADD_FAVORITE';
export const ADD_PLAYLIST = 'ADD_PLAYLIST';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';
export const REMOVE_PLAYLIST = 'REMOVE_PLAYLIST';

export const updateCurrentProfile = current_profile => (
    {
        type: UPDATE_CURRENT_PROFILE,
        payload: current_profile,
    }
);
export const setStoryIdx = idx => (
    {
        type: SET_STORY_IDX,
        payload: idx,
    }
);
export const setListType = type => (
    {
        type: SET_LIST_TYPE,
        payload: type,
    }
);
export const setListIdx = idx => (
    {
        type: SET_LIST_IDX,
        payload: idx,
    }
);
export const addFavorite = idx => (
    {
        type: ADD_FAVORITE,
        payload: idx,
    }
);
export const addPlayList = idx => (
    {
        type: ADD_PLAYLIST,
        payload: idx,
    }
);
export const removeFavorite = idx => (
    {
        type: REMOVE_FAVORITE,
        payload: idx,
    }
);
export const removePlayList = idx => (
    {
        type: REMOVE_PLAYLIST,
        payload: idx,
    }
);