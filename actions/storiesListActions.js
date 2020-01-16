export const UPDATE_STORIES_LIST = 'UPDATE_STORIES_LIST';

export const updateStoriesList = storiesList => (
    {
        type: UPDATE_STORIES_LIST,
        payload: storiesList,
    }
);