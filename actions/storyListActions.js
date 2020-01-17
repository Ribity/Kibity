export const UPDATE_STORY_LIST = 'UPDATE_STORY_LIST';

export const updateStoryList = storyList => (
    {
        type: UPDATE_STORY_LIST,
        payload: storyList,
    }
);