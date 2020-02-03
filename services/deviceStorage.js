import { AsyncStorage } from 'react-native';
// import myfuncs from './myFuncs';

class deviceStorage  {
    setKey = async (key, valueToSave) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(valueToSave));
        } catch (error) {
            console.log('AsyncStorage.setItem Error: ' + key + "|" + error.message);
            // myfuncs.mySentry(error);
        }
    };

    getKey = async (key, ignoreNotFound) => {
        try {
            let value = await AsyncStorage.getItem(key);
            let item = JSON.parse(value);
            return (item);
        } catch (error) {
            if (ignoreNotFound !== true) {
                console.log('AsyncStorage.getItem Error: ' + key + "|" + error.message);
                // myfuncs.mySentry(error);
            }
            return null;
        }
    };

    deleteKey = async (key) => {
        try{
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.log('AsyncStorage.deleteKey Error: ' + error.message);
            // myfuncs.mySentry(error);
        }
    };

    clearAll = async () => {
        try{
            await AsyncStorage.clear();
        } catch (error) {
            console.log('AsyncStorage.clear Error: ' + error.message);
            // myfuncs.mySentry(error);
        }
    };

}

const hardStorage = new deviceStorage();
export default hardStorage;
