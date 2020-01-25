import MyDefines from '../constants/MyDefines';

let   OneBoyOrGirl;
let   OneHeOrShe;
let   OneHimOrHer;
let   OneHisOrHer;
let   OneHisOrHers;

let   TwoBoyOrGirl;
let   TwoHeOrShe;
let   TwoHimOrHer;
let   TwoHisOrHer;
let   TwoHisOrHers;

let   ThreeBoyOrGirl;
let   ThreeHeOrShe;
let   ThreeHimOrHer;
let   ThreeHisOrHer;
let   ThreeHisOrHers;

class storyConversion {

    convertIt = (story, profile) => {
        let myStory = null;

        try {
            this.initText(profile);
            myStory = this.replacements(story, profile);
        } catch (error) {
            console.log(error);
        }
        return myStory;
    };

    initText = (profile) => {
        if (profile === null)
            profile = MyDefines.default_current_profile;

        if (profile.mainCharGender === 'male') {
            OneBoyOrGirl = 'Boy';
            OneHeOrShe   = 'he';
            OneHimOrHer  = 'him';
            OneHisOrHer  = 'his';
            OneHisOrHers = 'his';
        } else {
            OneBoyOrGirl = 'girl';
            OneHeOrShe   = 'she';
            OneHimOrHer  = 'her';
            OneHisOrHer  = 'her';
            OneHisOrHers = 'hers';
        }

        if (profile.charTwoGender === 'male') {
            TwoBoyOrGirl = 'Boy';
            TwoHeOrShe   = 'he';
            TwoHimOrHer  = 'him';
            TwoHisOrHer  = 'his';
            TwoHisOrHers = 'his';
        } else {
            TwoBoyOrGirl = 'girl';
            TwoHeOrShe   = 'she';
            TwoHimOrHer  = 'her';
            TwoHisOrHer  = 'her';
            TwoHisOrHers = 'hers';
        }

        if (profile.charThreeGender === 'male') {
            ThreeBoyOrGirl = 'boy';
            ThreeHeOrShe   = 'he';
            ThreeHimOrHer  = 'him';
            ThreeHisOrHer  = 'his';
            ThreeHisOrHers = 'his';
        } else {
            ThreeBoyOrGirl = 'girl';
            ThreeHeOrShe   = 'she';
            ThreeHimOrHer  = 'her';
            ThreeHisOrHer  = 'her';
            ThreeHisOrHers = 'hers';
        }
    };

    replacements = (inStory, profile) => {
        let rLine;

        if (profile === null)
            profile = MyDefines.default_current_profile;

        let i;
        for (i = 0; i < inStory.line.length; i++) {
            rLine = inStory.line[i].replace(/mainchar/gi, profile.mainChar);
            rLine = rLine.replace(/char1/gi, profile.mainChar);
            rLine = rLine.replace(/boy1/gi, OneBoyOrGirl);
            rLine = rLine.replace(/girl1/gi, OneBoyOrGirl);
            rLine = rLine.replace(/secondchar/gi, profile.charTwo);
            rLine = rLine.replace(/char2/gi, profile.charTwo);
            rLine = rLine.replace(/boy2/gi, TwoBoyOrGirl);
            rLine = rLine.replace(/girl2/gi, TwoBoyOrGirl);
            rLine = rLine.replace(/thirdchar/gi, profile.charThree);
            rLine = rLine.replace(/char3/gi, profile.charThree);
            rLine = rLine.replace(/boy3/gi, ThreeBoyOrGirl);
            rLine = rLine.replace(/girl3/gi, ThreeBoyOrGirl);
            rLine = rLine.replace(/city1/gi, profile.city);
            rLine = rLine.replace(/pet1/gi, profile.pet);
            rLine = rLine.replace(/petname1/gi, profile.petName);
            rLine = rLine.replace(/sport1/gi, profile.sport);
            rLine = rLine.replace(/team1/gi, profile.team);
            rLine = rLine.replace(/she1/gi, OneHeOrShe);
            rLine = rLine.replace(/he1/gi, OneHeOrShe);
            rLine = rLine.replace(/him1/gi, OneHimOrHer);
            rLine = rLine.replace(/herm1/gi, OneHimOrHer);
            rLine = rLine.replace(/his1/gi, OneHisOrHer);
            rLine = rLine.replace(/her1/gi, OneHisOrHer);
            rLine = rLine.replace(/hiss1/gi, OneHisOrHers);
            rLine = rLine.replace(/hers1/gi, OneHisOrHers);
            rLine = rLine.replace(/she2/gi, TwoHeOrShe);
            rLine = rLine.replace(/he2/gi, TwoHeOrShe);
            rLine = rLine.replace(/him2/gi, TwoHimOrHer);
            rLine = rLine.replace(/her2/gi, TwoHimOrHer);
            rLine = rLine.replace(/his2/gi, TwoHisOrHer);
            rLine = rLine.replace(/herm2/gi, TwoHisOrHer);
            rLine = rLine.replace(/hiss2/gi, TwoHisOrHers);
            rLine = rLine.replace(/hers2/gi, TwoHisOrHers);
            rLine = rLine.replace(/she3/gi, ThreeHeOrShe);
            rLine = rLine.replace(/he3/gi, ThreeHeOrShe);
            rLine = rLine.replace(/him3/gi, ThreeHimOrHer);
            rLine = rLine.replace(/herm3/gi, ThreeHimOrHer);
            rLine = rLine.replace(/his3/gi, ThreeHisOrHer);
            rLine = rLine.replace(/her3/gi, ThreeHisOrHer);
            rLine = rLine.replace(/hiss3/gi, ThreeHisOrHers);
            rLine = rLine.replace(/hers3/gi, ThreeHisOrHers);
            inStory.line[i] = rLine;
        }
        return inStory;
    }
}

const storyconversion = new storyConversion();
export default storyconversion;
