class myStories {

    getStory = (storyName) => {
        try {
            let storyToUse = -1;
            // console.log("mystories.getStory storyName:", storyName);

            if (storyName < 'c')
                storyToUse = this.getStory_a_to_b(storyName);
            else if (storyName < 'k')
                storyToUse = this.getStory_c_to_j(storyName);
            else if (storyName < 'p')
                storyToUse = this.getStory_k_to_o(storyName);
            else if (storyName < 't')
                storyToUse = this.getStory_p_to_s(storyName);
            else
                storyToUse = this.getStory_t_to_z(storyName);

            if (storyToUse !== -1) {
                // console.log("StoryFound: ", storyToUse);
                return storyToUse;
            } else {
                return null;
            }
        } catch (error) {
            console.log("exception for getStory:", storyName);
            console.log(error);
            // myfuncs.myRepo(error);
        }
    };

    getStory_a_to_b = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.myRepo(error);
        }
        return storyToUse;
    };

    getStory_c_to_j = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                case 'hotelCaledonia.json':
                    storyToUse = require('../assets/stories/hotelCaledonia.json');
                    break;
                case 'classFieldTrip.json':
                    storyToUse = require('../assets/stories/classFieldTrip.json');
                    break;
                case 'homeUnderTheRainbow.json':
                    storyToUse = require('../assets/stories/homeUnderTheRainbow.json');
                    break;
                case 'hushLittleBaby.json':
                    storyToUse = require('../assets/stories/hushLittleBaby.json');
                    break;
                case 'grandmaAndGrandpaHouse.json':
                    storyToUse = require('../assets/stories/grandmaAndGrandpaHouse.json');
                    break;
                case 'dashcam.json':
                    storyToUse = require('../assets/stories/dashcam.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.myRepo(error);
        }
        return storyToUse;
    };
    getStory_k_to_o = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                case 'lambsTail.json':
                    storyToUse = require('../assets/stories/lambsTail.json');
                    break;
                case 'newFriend.json':
                    storyToUse = require('../assets/stories/newFriend.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.myRepo(error);
        }
        return storyToUse;
    };

    getStory_p_to_s = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {
                case 'summerVacationAtGrandmas.json':
                    storyToUse = require('../assets/stories/summerVacationAtGrandmas.json');
                    break;
                case 'pecanTree.json':
                    storyToUse = require('../assets/stories/pecanTree.json');
                    break;
                case 'rockAByeBaby.json':
                    storyToUse = require('../assets/stories/rockAByeBaby.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.myRepo(error);
        }
        return storyToUse;
    };

    getStory_t_to_z = (storyName) => {
        let storyToUse = -1;    // This commented out code works. Use it if we want to package the
        try {
            switch (storyName) {    // images in assets/images
                case 'uncleNedsFireworks.json':
                    storyToUse = require('../assets/stories/uncleNedsFireworks.json');
                    break;
                case 'toysAndAnimals.json':
                    storyToUse = require('../assets/stories/toysAndAnimals.json');
                    break;
                case 'thisLittlePiggy.json':
                    storyToUse = require('../assets/stories/thisLittlePiggy.json');
                    break;
                case 'windAndToes.json':
                    storyToUse = require('../assets/stories/windAndToes.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.myRepo(error);
        }
        return storyToUse;
    };

}

const mystories = new myStories();
export default mystories;
