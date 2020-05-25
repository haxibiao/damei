import React,{ useState,useEffect } from 'react';
import { NativeModules,Platform,StatusBar } from 'react-native';

const { StatusBarManager } = NativeModules;

const useStatusHeight = () => {

    const [height,setheight] = useState(0)

    useEffect(() => {
        if(Platform.OS == 'android'){
            setheight(StatusBar?.currentHeight ?? 0);
        }else {
            StatusBarManager.getHeight((h:any) => {
                setheight(h.height);
            });
        }
    },[])

    return height;
};
export default useStatusHeight;