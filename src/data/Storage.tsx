import AsyncStorage from '@react-native-community/async-storage';

const TAG = "数据 :: 持久化存储storage :: \\ "
interface KeyType {
    user: string;
    firstInstall: string;
}

async function getItem(key: keyof KeyType) {
    let results: any;
    try {
        results = await AsyncStorage.getItem(key);
        return JSON.parse(results);
    } catch (error) {
        return null;
    }
}

async function setItem(key: keyof KeyType, value: any) {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
        console.log(TAG,`Key > ${key} < saved successfully`);
        return value;
    } catch (error) {
        console.log(TAG,`Key > ${key} < saved failure`);
    }
}

async function removeItem(key: keyof KeyType) {
    try {
        await AsyncStorage.removeItem(key);
        console.log(TAG,`Key > ${key} < removed successfully`);
        return true;
    } catch (error) {
        console.log(TAG,`Key > ${key} < removed failure`);
    }
}

export const Storage = {
    removeItem,
    getItem,
    setItem,
};
