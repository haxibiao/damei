import React ,{ useState,useEffect } from 'react';
import {View} from 'react-native';

const HocStatusWidget = React.memo((props:{
    widget:any,
    loading?:boolean,
    error?:any,
    loadingView?:any,
    errorView?:any
}) => {
    console.log('状态: ',props.loading,props.error)
    if(props?.loading){
        return props?.loadingView ?? null;
    }
    if(props?.error){
        return props?.errorView ?? null;
    }
    return props.widget
});

export default HocStatusWidget;