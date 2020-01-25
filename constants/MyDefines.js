import Constants from 'expo-constants';

export default {

    log_details: false,

    myStatusBarHeight: Constants.statusBarHeight,
    myBottomTabBarHeight: 45,

    stories_url_bucket: 'https://ribity.com/stories/',
    default_test: {
        test: false,
    },
    default_asyncStorage: {
        local_story_list: {
            story_num: 1,
            name: 'I shortened Beths test story',
            gender:   1,
            length_time:  200,
            filename:   'testTwoStory2.json',
            web_uri: false,
            date_published: "Jan 23, 2019",
        }
    },
    // profiled: {
    //     mainChar: 'Michael',
    //     mainCharGender: 'male',
    //     charTwo: 'Brandon',
    //     charTwoGender: 'male',
    //     charThree: 'Elizabeth',
    //     charThreeGender: 'female',
    //     team: 'Washington Redskins',
    //     sport: 'football',
    //     pet: 'monkey',
    // },

    default_current_profile:
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
            city: "Roanoke Rapids, North Carolina",
            favorites: [],   // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
            playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes

            active_profile: 0,  // zero-based
            currStoryIdx: -1,
            currListIdx: 0,
            currListType: 0,
        },

    default_profiles:
        {
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
                favorites: [],      // list of story indexes (integers) 0-based, must match allStoriesList.json indexes
                playList: [],       // list to story indexes (integers) 1-based, must match allStoriesList.json indexes
            },
            {
                mainChar: 'Beth Ann',
                mainCharGender: 'female',
                charTwo: 'Lisa Lou',
                charTwoGender: 'female',
                charThree: 'Steve',
                charThreeGender: 'male',
                team: 'Sanderson High School',
                sport: 'ice skating',
                pet: 'llama',
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
                favorites: [],
                playList: [],
            },
        ],
        },
    default_story_list:
        {
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

                },
            ]
        },
}

