class myStories {

    getStory = (storyName) => {
        try {
            let storyToUse = -1;
            console.log("mystories.getStory storyName:", storyName);

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
            // myfuncs.mySentry(error);
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
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_c_to_j = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                case 'hotelCaledonia.json':
                case 'hotelCaledonia':
                    storyToUse = require('../assets/stories/hotelCaledonia.json');
                    break;
                case 'classFieldTrip.json':
                case 'classFieldTrip':
                    storyToUse = require('../assets/stories/classFieldTrip.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };
    getStory_k_to_o = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {    // images in assets/images
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_p_to_s = (storyName) => {
        let storyToUse = -1;
        try {
            switch (storyName) {
                case 'summerVacationAtGrandmas.json':
                case 'summerVacationAtGrandmas':
                    storyToUse = require('../assets/stories/summerVacationAtGrandmas.json');
                    break;
                case 'pecanTree.json':
                case 'pecanTree':
                    storyToUse = require('../assets/stories/pecanTree.json');
                    break;
                case 'shortTest.json':
                case 'shortTest':
                    storyToUse = require('../assets/stories/shortTest.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

    getStory_t_to_z = (storyName) => {
        let storyToUse = -1;    // This commented out code works. Use it if we want to package the
        try {
            switch (storyName) {    // images in assets/images
                case 'uncleNedsFireworks.json':
                case 'uncleNedsFireworks':
                    storyToUse = require('../assets/stories/uncleNedsFireworks.json');
                    break;
                case 'toysAndAnimals.json':
                case 'toysAndAnimals':
                    storyToUse = require('../assets/stories/toysAndAnimals.json');
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("exception for getstoryName:", storyName);
            // myfuncs.mySentry(error);
        }
        return storyToUse;
    };

}

const mystories = new myStories();
export default mystories;
