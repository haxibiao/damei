import React, { useState,useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { sw, sh,useStatusHeight } from '../../tools';


const FindPalWidth = sw * 0.88; //答题交友卡片宽
const FindPalMarginStart = sw * 0.06; //答题交友卡片距离左边距离(居中)


const FindPal = () => {
    return (
        <View style={{ 
            height: 120, 
            borderRadius: 15, 
            width: FindPalWidth, 
            marginStart: FindPalMarginStart, 
            backgroundColor: 'lightblue',
            marginTop:20,
            shadowColor:'#000',
            shadowOpacity:0.1,
            shadowRadius:3,
            shadowOffset:{width:0,height:3}
        }}>
            <View style={{height:'100%',width:'100%',borderRadius:15,overflow:"hidden"}}>
                <Image source={require('./findpal.png')} style={{height:'100%',width:'100%'}} resizeMode='cover'/>
            </View>
        </View>
    )
}

export default FindPal;