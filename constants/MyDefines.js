import Constants from 'expo-constants';

export default {

    clearAllStorage: false,
    log_details: false,
    log_audio: false,
    console_log_breadcrumbs: false,

    sentry_logging: true,

    myStatusBarHeight: Constants.statusBarHeight,
    myBottomTabBarHeight: 45,

    myTabColor: 'lavender',
    myHeaderTextColor: 'purple',

    stories_url_bucket: 'https://kibity.com/stories/',
    default_settings: {
        keep_awake: true,
        playEndOfStoryRibbit: true,
        pauseLineIdx: 0,
        pauseStoryIdx: 2,
        pitchIdx: 6,
        rateIdx: 6,
        voice: "",
        retrieved_user_data: false,
    },

    // default_current_profile: {
    //     charOne: 'Michael',
    //     charOneGender: 'male',
    //     charTwo: 'Brandon',
    //     charTwoGender: 'male',
    //     charThree: 'Elizabeth',
    //     charThreeGender: 'female',
    //     team: 'Washington Redskins',
    //     sport: 'football',
    //     pet: 'dog',
    //     petName: "Fluffy",
    //     city: "Roanoke Rapids, North Carolina",
    //
    //     favorites: [],   // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
    //     playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes
    //     currStoryIdx: -1,
    //     currListIdx: 0,
    //     currListType: 0,
    //     },

    default_profiles: {
        profilesIdx: 0,
        profile: [
            {
                character: [
                    {name: 'Michael', pronoun: 0},
                    {name: 'Brandon', pronoun: 0},
                    {name: 'Elizabeth', pronoun: 1},
                ],
                team: 'Washington Redskins',
                sport: 'football',
                pet: 'dog',
                petName: "Fluffy",
                city: "Raleigh, North Carolina",
                favorites: [],      // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
                playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes
                currStoryIdx: -1,
                currListIdx: 0,
                currListType: 0,
            },
            {
                character: [
                    {name: 'Beth Anne', pronoun: 1},
                    {name: 'Ramona Lynn', pronoun: 1},
                    {name: 'Christopher', pronoun: 0},
                ],
                team: 'Sanderson High School',
                sport: 'ice skating',
                pet: 'horse',
                petName: "Skippy",
                city: "Raleigh",
                favorites: [],
                playList: [],
                currStoryIdx: -1,
                currListIdx: 0,
                currListType: 0,
            },
            {
                character: [
                    {name: 'Mark Anthony', pronoun: 0},
                    {name: 'Dennis', pronoun: 0},
                    {name: 'The Johnson Twins', pronoun: 2},
                ],
                team: 'Atlanta Braves',
                sport: 'baseball',
                pet: 'monkey',
                petName: "Cricket",
                city: "Toronto, Canada",
                favorites: [],
                playList: [],
                currStoryIdx: -1,
                currListIdx: 0,
                currListType: 0,
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
                "written_by": "",
                "keywords": "",
                "ages": "",
                "toddler_pause": 0,
            }
            ]
        },


    pause_data: [
        {idx: 0,  text: '1 second', value: 1},
        {idx: 1,  text: '2 seconds', value: 2},
        {idx: 2,  text: '3 seconds', value: 3},
        {idx: 3,  text: '5 seconds', value: 5},
        {idx: 4,  text: '8 seconds', value: 8},
        {idx: 5,  text: '10 seconds', value: 10},
    ],

    pitch_data: [
        {idx: 0, text: 'Super duper high', value: 1.9},
        {idx: 1, text: 'Super high', value: 1.5},
        {idx: 2, text: 'Soprano', value: 1.4},
        {idx: 3, text: 'Mezzo Soprano', value: 1.3},
        {idx: 4, text: 'Alto', value: 1.2},
        {idx: 5, text: 'Just a little high', value: 1.1},
        {idx: 6, text: 'Normal pitch', value: 1.0},
        {idx: 7, text: 'Just a little low', value: .9},
        {idx: 8, text: 'Tenor', value: .8},
        {idx: 9, text: 'Baritone', value: .7},
        {idx: 10, text: 'Base', value: .6},
        {idx: 11, text: 'Super low', value: .5},
        {idx: 12, text: 'Super duper low', value: .1},
    ],
    rate_data: [
        {idx: 0, text: 'Super Duper fast', value: 1.9},
        {idx: 1, text: 'Super fast', value: 1.5},
        {idx: 2, text: 'Really fast', value: 1.4},
        {idx: 3, text: 'Fast', value: 1.3},
        {idx: 4, text: 'Somewhat fast', value: 1.2},
        {idx: 5, text: 'Just a little fast', value: 1.1},
        {idx: 6, text: 'Normal speed', value: 1.0},
        {idx: 7, text: 'Just a little slow', value: .9},
        {idx: 8, text: 'Somewhat slow', value: .8},
        {idx: 9, text: 'Slow', value: .7},
        {idx: 10, text: 'Really slow', value: .6},
        {idx: 11, text: 'Super slow', value: .5},
        {idx: 12, text: 'Super Duper slow', value: .1},
    ],

    profiles_data: [
        {idx: 0, text: ' ', value: 0},
        {idx: 1, text: ' ', value: 1},
        {idx: 2, text: ' ', value: 2},
    ],
}

