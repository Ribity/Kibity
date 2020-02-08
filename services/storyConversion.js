import MyDefines from '../constants/MyDefines';

let   BoyOrGirl = [];
let   HeOrShe = [];
let   HimOrHer = [];
let   HisOrHer = [];
let   HisOrHers = [];

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
            profile = MyDefines.default_profiles.profile[0];

        for (let i=0; i<3; i++) {
            if (profile.character[i].pronoun === 0) {
                BoyOrGirl[i] = 'Boy';
                HeOrShe[i] = 'he';
                HimOrHer[i] = 'him';
                HisOrHer[i] = 'his';
                HisOrHers[i] = 'his';
            } else if (profile.character[i].pronoun === 1) {
                BoyOrGirl[i] = 'girl';
                HeOrShe[i] = 'she';
                HimOrHer[i] = 'her';
                HisOrHer[i] = 'her';
                HisOrHers[i] = 'hers';
            } else {
                BoyOrGirl[i] = 'group';
                HeOrShe[i] = 'they';
                HimOrHer[i] = 'them';
                HisOrHer[i] = 'their';
                HisOrHers[i] = 'theirs';
            }
        }
    };
    replacements = (inStory, profile) => {
        let rLine;
        let outStory = {line: []};  // Doing this and the JSON.parse below so as not modify original story
                                    // so we convert it with a different profile is active.profile is changed
                                    // without changing storyIdx.
        if (profile === null)
            profile =  MyDefines.default_profiles.profile[0];

        let i;
        for (i = 0; i < inStory.line.length; i++) {
            let newLine = JSON.parse(JSON.stringify(inStory.line[i]));
            rLine = newLine.replace(/mainchar/gi, profile.character[0].name);
            rLine = rLine.replace(/char1/gi, profile.character[0].name);
            rLine = rLine.replace(/boy1/gi, BoyOrGirl[0]);
            rLine = rLine.replace(/girl1/gi, BoyOrGirl[0]);
            rLine = rLine.replace(/secondchar/gi, profile.character[1].name);
            rLine = rLine.replace(/char2/gi, profile.character[1].name);
            rLine = rLine.replace(/boy2/gi, BoyOrGirl[1]);
            rLine = rLine.replace(/girl2/gi, BoyOrGirl[1]);
            rLine = rLine.replace(/thirdchar/gi, profile.character[2].name);
            rLine = rLine.replace(/char3/gi, profile.character[2].name);
            rLine = rLine.replace(/boy3/gi, BoyOrGirl[2]);
            rLine = rLine.replace(/girl3/gi, BoyOrGirl[2]);
            rLine = rLine.replace(/city1/gi, profile.city);
            rLine = rLine.replace(/pet1/gi, profile.pet);
            rLine = rLine.replace(/petname1/gi, profile.petName);
            rLine = rLine.replace(/sport1/gi, profile.sport);
            rLine = rLine.replace(/team1/gi, profile.team);
            rLine = rLine.replace(/she1/gi, HeOrShe[0]);
            rLine = rLine.replace(/he1/gi, HeOrShe[0]);
            rLine = rLine.replace(/him1/gi, HimOrHer[0]);
            rLine = rLine.replace(/herm1/gi, HimOrHer[0]);
            rLine = rLine.replace(/his1/gi, HisOrHer[0]);
            rLine = rLine.replace(/her1/gi, HisOrHer[0]);
            rLine = rLine.replace(/hiss1/gi, HisOrHers[0]);
            rLine = rLine.replace(/hers1/gi, HisOrHers[0]);
            rLine = rLine.replace(/she2/gi, HeOrShe[1]);
            rLine = rLine.replace(/he2/gi, HeOrShe[1]);
            rLine = rLine.replace(/him2/gi, HimOrHer[1]);
            rLine = rLine.replace(/her2/gi, HimOrHer[1]);
            rLine = rLine.replace(/his2/gi, HisOrHer[1]);
            rLine = rLine.replace(/herm2/gi, HisOrHer[1]);
            rLine = rLine.replace(/hiss2/gi, HisOrHers[1]);
            rLine = rLine.replace(/hers2/gi, HisOrHers[1]);
            rLine = rLine.replace(/she3/gi, HeOrShe[2]);
            rLine = rLine.replace(/he3/gi, HeOrShe[2]);
            rLine = rLine.replace(/him3/gi, HimOrHer[2]);
            rLine = rLine.replace(/herm3/gi, HimOrHer[2]);
            rLine = rLine.replace(/his3/gi, HisOrHer[2]);
            rLine = rLine.replace(/her3/gi, HisOrHer[2]);
            rLine = rLine.replace(/hiss3/gi, HisOrHers[2]);
            rLine = rLine.replace(/hers3/gi, HisOrHers[2]);
            // inStory.line[i] = rLine;
            outStory.line[i] = rLine;
        }
        return outStory;
    }
}

const storyconversion = new storyConversion();
export default storyconversion;
