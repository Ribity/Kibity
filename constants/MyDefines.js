import Constants from 'expo-constants';

export default {

    log_details: false,
    log_audio: false,
    sentry_logging: true,
    console_log_breadcrumbs: true,


    myStatusBarHeight: Constants.statusBarHeight,
    myBottomTabBarHeight: 45,

    stories_url_bucket: 'https://kibity.com/stories/',
    default_settings: {
        playEndOfStoryRibbit: false,
        ribbit_wav_num: 2,
        keep_awake: true,
    },

    default_current_profile: {
        mainChar: 'Michael',
        mainCharGender: 'male',
        charTwo: 'Brandon',
        charTwoGender: 'male',
        charThree: 'Elizabeth',
        charThreeGender: 'female',
        team: 'Washington Redskins',
        sport: 'football',
        pet: 'dog',
        petName: "Fluffy",
        city: "Roanoke Rapids, North Carolina",

        favorites: [],   // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
        playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes
        active_profile: 0,  // zero-based idx of the three profiles
        currStoryIdx: -1,
        currListIdx: 0,
        currListType: 0,
        },

    default_profiles: {
        profile: [
            {
                mainChar: 'Michael',
                mainCharGender: 'male',
                charTwo: 'Brandon',
                charTwoGender: 'male',
                charThree: 'Elizabeth',
                charThreeGender: 'female',
                team: 'Washington Redskins',
                sport: 'football',
                pet: 'dog',
                petName: "Fluffy",
                city: "Raleigh, North Carolina",
                favorites: [],      // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
                playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes
            },
            {
                mainChar: 'Beth Ann',
                mainCharGender: 'female',
                charTwo: 'Lisa',
                charTwoGender: 'female',
                charThree: 'Stephen Andrew Johnson',
                charThreeGender: 'male',
                team: 'Sanderson High School',
                sport: 'ice skating',
                pet: 'llama',
                petName: "Skippy",
                city: "Raleigh",
                favorites: [],
                playList: [],
            },
            {
                mainChar: 'Mark Anthony',
                mainCharGender: 'male',
                charTwo: 'Dennis',
                charTwoGender: 'male',
                charThree: 'Charlie',
                charThreeGender: 'male',
                team: 'Atlanta Braves',
                sport: 'baseball',
                pet: 'monkey',
                petName: "Cricket",
                city: "Toronto, Canada",
                favorites: [],
                playList: [],
            },
        ],
        },
    default_story_list: {
        stories: [
            {
                "story_num": 1,
                "title": "",
                "gender": 1,
                "num_lines": 0,
                "filename": "uncleNedsFireworks.json",
                "date_published": "",
                "snippet": "",
                "written_by": "",
                "keywords": "",
            }
            ]
        },
}

