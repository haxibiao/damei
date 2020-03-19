import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import { Toast} from 'teaset';

const message = (text:string,position?:string,duration?:number) => {
    Toast.show({
        text: text,
        position: position ?? "bottom",
        duration: duration ?? 1000
    });
}

let toastKey:any = null;
function showLoadingToast(text?:string,opacity?:number){
    toastKey = Toast.show({
      text: text ?? '加载中',
      icon: <ActivityIndicator size={'large'} color={"#f1f1f1"}/>,
      position: 'center',
      duration: 1000000,
      modal: true,
      overlayOpacity: opacity ?? 0.37,
    });
    let timeout = setTimeout(() => {
        hideLoadingToast();
        message('操作超时、未知错误');
        clearTimeout(timeout);
    },12000);
}
const hideLoadingToast = () => {
    if(toastKey == null) return;
    Toast.hide(toastKey);
    toastKey = null;
}

export {message , showLoadingToast,hideLoadingToast}