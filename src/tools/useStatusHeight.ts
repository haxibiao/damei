import React,{useState,useEffect} from 'react';
import { StatusBar,NativeModules,Platform } from 'react-native';

const {StatusBarManager} = NativeModules;

export default function useStatusHeight(){

    const [h,seth] = useState(0);

    useEffect(() => {
        if(Platform.OS == 'android'){
            seth(StatusBar?.currentHeight ?? 0);
        }else{
            StatusBarManager.getHeight((height:any) => {
                seth(height.height);
            });
        }
    }, [])

    return h;
}