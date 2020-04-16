import React from 'react';
import {View} from 'react-native';

const Card = React.memo((props:{
    height?:number,
    width?:number,
    radius?:number
}) => {
    const h = props?.height ?? 'auto';
    const w = props?.height ?? 'auto';
    const r = props?.radius ?? 0;

    return (
        <View style={{height: h,width: w,borderRadius: r}}>

        </View>
    )
});

export default Card;