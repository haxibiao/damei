import React, { Component,useState } from 'react';
import { StyleSheet, View, Image, PixelRatio,ViewStyle,ImageStyle } from 'react-native';
import { Theme, PxFit } from '../../utils';



function Avatar (props:{
    size?: number,
    style?: ImageStyle,
    source?: any,
}){

    const [loading,setloading] = useState(true);

    /**
     *  可选props 参数的默认值
     */
    let size = props?.size ?? PxFit(44);
    let style:ImageStyle = props?.style ?? {};
    let source = props.source;
    //固定值
    const backgroundColor = '#f9f9f9';
    const radius = PixelRatio.roundToNearestPixel(size / 2);

    //错误回调
    const _onError = () => {
        setloading(false);
	};

    if(typeof source === 'string'){
        source = {uri:source};
    }

    return <Image 
            source={source} 
            resizeMode="cover" 
            onError={_onError}
            style={[
                {height:size,width:size,backgroundColor:backgroundColor,borderRadius:radius},
                style
            ]}
            />;
}

export default Avatar;