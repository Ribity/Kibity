export const UPDATE_CURRENT_PROFILE = 'UPDATE_CURRENT_PROFILE';
export const SET_FAVORITES_IDX = 'SET_FAVORITES_IDX';
export const SET_PLAYLIST_IDX = 'SET_PLAYLIST_IDX';

export const updateCurrentProfile = current_profile => (
    {
        type: UPDATE_CURRENT_PROFILE,
        payload: current_profile,
    }
);
export const setFavoritesIdx = idx => (
    {
        type: SET_FAVORITES_IDX,
        payload: idx,
    }
);
export const setPlayListIdx = idx => (
    {
        type: SET_PLAYLIST_IDX,
        payload: idx,
    }
);