export default {

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
    default_profile: {
          mainChar: 'Michael',
          mainCharGender: 'male',
          charTwo: 'Brandon',
          charTwoGender: 'male',
          charThree: 'Elizabeth',
          charThreeGender: 'female',
          team: 'Washington Redskins',
          sport: 'football',
          pet: 'monkey',
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
                },
            ]
        },
}

