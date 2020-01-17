export const UPDATE_STORY_IDX = 'UPDATE_STORY_IDX';

export const updateStoryIdx = story_idx => (
    {
        type: UPDATE_STORY_IDX,
        payload: story_idx,
    }
);