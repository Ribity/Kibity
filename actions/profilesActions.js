export const UPDATE_PROFILES = 'UPDATE_PROFILES';

export const updateProfiles = profiles => (
    {
        type: UPDATE_PROFILES,
        payload: profiles,
    }
);