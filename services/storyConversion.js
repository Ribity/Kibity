import MyDefines from '../constants/MyDefines';
import myfuncs from "./myFuncs";

let   BoyOrGirl = [];
let   HeOrShe = [];
let   HimOrHer = [];
let   HisOrHer = [];
let   HisOrHers = [];
let   wasWere = [];

class storyConversion {
    convertIt = (story, profile) => {
        let myStory = null;

        try {
            myfuncs.myBreadCrumbs('storyConversion', 'storyConversion');
            this.initText(profile);
            myStory = this.replacements(story, profile);
        } catch (error) {
            myfuncs.myRepo(error);
        }
        return myStory;
    };
    initText = (profile) => {
        try {
            myfuncs.myBreadCrumbs('initText', 'storyConversion');
            if (profile === null)
                profile = MyDefines.default_profiles.profile[0];

            for (let i=0; i<6; i++) {
                if (profile.character[i].pronoun === 0) {
                    BoyOrGirl[i] = 'Boy';
                    HeOrShe[i] = 'he';
                    HimOrHer[i] = 'him';
                    HisOrHer[i] = 'his';
                    HisOrHers[i] = 'his';
                    wasWere[i] = "was";
                } else if (profile.character[i].pronoun === 1) {
                    BoyOrGirl[i] = 'girl';
                    HeOrShe[i] = 'she';
                    HimOrHer[i] = 'her';
                    HisOrHer[i] = 'her';
                    HisOrHers[i] = 'hers';
                    wasWere[i] = "was";
                } else {
                    BoyOrGirl[i] = 'group';
                    HeOrShe[i] = 'they';
                    HimOrHer[i] = 'them';
                    HisOrHer[i] = 'their';
                    HisOrHers[i] = 'theirs';
                    wasWere[i] = "were";
                }
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
    };
    replacements = (inStory, profile) => {
        let rLine;
        let outStory = {line: []};  // Doing this and the JSON.parse below so as not modify original story
                                    // so we convert it with a different profile is active.profile is changed
                                    // without changing storyIdx.
        try {
            myfuncs.myBreadCrumbs('replacements', 'storyConversion');
            if (profile === null)
                profile =  MyDefines.default_profiles.profile[0];

            let i;
            for (i = 0; i < inStory.line.length; i++) {
                rLine = JSON.parse(JSON.stringify(inStory.line[i]));
                rLine = rLine.replace(/mainchar/gi, profile.character[0].name);
                rLine = rLine.replace(/char1/gi, profile.character[0].name);
                rLine = rLine.replace(/boy1/gi, BoyOrGirl[0]);
                rLine = rLine.replace(/girl1/gi, BoyOrGirl[0]);
                rLine = rLine.replace(/char2/gi, profile.character[1].name);
                rLine = rLine.replace(/boy2/gi, BoyOrGirl[1]);
                rLine = rLine.replace(/girl2/gi, BoyOrGirl[1]);
                rLine = rLine.replace(/char3/gi, profile.character[2].name);
                rLine = rLine.replace(/boy3/gi, BoyOrGirl[2]);
                rLine = rLine.replace(/girl3/gi, BoyOrGirl[2]);
                rLine = rLine.replace(/char4/gi, profile.character[3].name);
                rLine = rLine.replace(/parent1/gi, profile.character[3].name);
                rLine = rLine.replace(/boy4/gi, BoyOrGirl[3]);
                rLine = rLine.replace(/girl4/gi, BoyOrGirl[3]);
                rLine = rLine.replace(/char5/gi, profile.character[4].name);
                rLine = rLine.replace(/parent2/gi, profile.character[4].name);
                rLine = rLine.replace(/boy5/gi, BoyOrGirl[4]);
                rLine = rLine.replace(/girl5/gi, BoyOrGirl[4]);
                rLine = rLine.replace(/char5/gi, profile.character[5].name);
                rLine = rLine.replace(/parent3/gi, profile.character[5].name);
                rLine = rLine.replace(/boy5/gi, BoyOrGirl[5]);
                rLine = rLine.replace(/girl5/gi, BoyOrGirl[5]);

                rLine = rLine.replace(/city1/gi, profile.city);
                rLine = rLine.replace(/pet1/gi, profile.pet);
                rLine = rLine.replace(/petname1/gi, profile.petName);
                rLine = rLine.replace(/event1/gi, profile.event);
                rLine = rLine.replace(/snack1/gi, profile.snack);
                rLine = rLine.replace(/celebrity1/gi, profile.celebrity);

                rLine = rLine.replace(/she1/gi, HeOrShe[0]);
                rLine = rLine.replace(/he1/gi, HeOrShe[0]);
                rLine = rLine.replace(/him1/gi, HimOrHer[0]);
                rLine = rLine.replace(/herm1/gi, HimOrHer[0]);
                rLine = rLine.replace(/his1/gi, HisOrHer[0]);
                rLine = rLine.replace(/her1/gi, HisOrHer[0]);
                rLine = rLine.replace(/hiss1/gi, HisOrHers[0]);
                rLine = rLine.replace(/hers1/gi, HisOrHers[0]);
                rLine = rLine.replace(/was1/gi, wasWere[0]);

                rLine = rLine.replace(/she2/gi, HeOrShe[1]);
                rLine = rLine.replace(/he2/gi, HeOrShe[1]);
                rLine = rLine.replace(/him2/gi, HimOrHer[1]);
                rLine = rLine.replace(/her2/gi, HimOrHer[1]);
                rLine = rLine.replace(/his2/gi, HisOrHer[1]);
                rLine = rLine.replace(/herm2/gi, HisOrHer[1]);
                rLine = rLine.replace(/hiss2/gi, HisOrHers[1]);
                rLine = rLine.replace(/hers2/gi, HisOrHers[1]);
                rLine = rLine.replace(/was2/gi, wasWere[1]);

                rLine = rLine.replace(/she3/gi, HeOrShe[2]);
                rLine = rLine.replace(/he3/gi, HeOrShe[2]);
                rLine = rLine.replace(/him3/gi, HimOrHer[2]);
                rLine = rLine.replace(/herm3/gi, HimOrHer[2]);
                rLine = rLine.replace(/his3/gi, HisOrHer[2]);
                rLine = rLine.replace(/her3/gi, HisOrHer[2]);
                rLine = rLine.replace(/hiss3/gi, HisOrHers[2]);
                rLine = rLine.replace(/hers3/gi, HisOrHers[2]);
                rLine = rLine.replace(/was3/gi, wasWere[2]);

                rLine = rLine.replace(/she4/gi, HeOrShe[3]);
                rLine = rLine.replace(/he4/gi, HeOrShe[3]);
                rLine = rLine.replace(/him4/gi, HimOrHer[3]);
                rLine = rLine.replace(/herm4/gi, HimOrHer[3]);
                rLine = rLine.replace(/his4/gi, HisOrHer[3]);
                rLine = rLine.replace(/her4/gi, HisOrHer[3]);
                rLine = rLine.replace(/hiss4/gi, HisOrHers[3]);
                rLine = rLine.replace(/hers4/gi, HisOrHers[3]);
                rLine = rLine.replace(/was4/gi, wasWere[3]);

                rLine = rLine.replace(/she5/gi, HeOrShe[4]);
                rLine = rLine.replace(/he5/gi, HeOrShe[4]);
                rLine = rLine.replace(/him5/gi, HimOrHer[4]);
                rLine = rLine.replace(/herm5/gi, HimOrHer[4]);
                rLine = rLine.replace(/his5/gi, HisOrHer[4]);
                rLine = rLine.replace(/her5/gi, HisOrHer[4]);
                rLine = rLine.replace(/hiss5/gi, HisOrHers[4]);
                rLine = rLine.replace(/hers5/gi, HisOrHers[4]);
                rLine = rLine.replace(/was5/gi, wasWere[4]);

                rLine = rLine.replace(/she6/gi, HeOrShe[5]);
                rLine = rLine.replace(/he6/gi, HeOrShe[5]);
                rLine = rLine.replace(/him6/gi, HimOrHer[5]);
                rLine = rLine.replace(/herm6/gi, HimOrHer[5]);
                rLine = rLine.replace(/his6/gi, HisOrHer[5]);
                rLine = rLine.replace(/her6/gi, HisOrHer[5]);
                rLine = rLine.replace(/hiss6/gi, HisOrHers[5]);
                rLine = rLine.replace(/hers6/gi, HisOrHers[5]);
                rLine = rLine.replace(/was6/gi, wasWere[5]);

                // inStory.line[i] = rLine;
                outStory.line[i] = this.capitalizeFirstChar(rLine);
            }
        } catch (error) {
            myfuncs.myRepo(error);
        }
        return outStory;
    };

    capitalizeFirstChar = (s) => {
        try {
            myfuncs.myBreadCrumbs('capitalizeFirstChar', 'storyConversion');
            return s.charAt(0).toUpperCase() + s.substring(1);
        } catch (error) {
            myfuncs.myRepo(error);
            return s;
        }
    };
}



const storyconversion = new storyConversion();
export default storyconversion;
