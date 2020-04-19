import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { sh, sw } from '../../tools';

const OverflowHeight = 30;
const TopHeadHeight = sh * 0.29 + OverflowHeight;

const HeadBG = () => {

    return (
        <View style={{ width: sw, height: TopHeadHeight, position: 'absolute' }}>
            <Image source={require('./background1.jpg')} resizeMode='cover' style={{ position: 'absolute', zIndex: -1, height: TopHeadHeight, width: sw }} />
            <View style={{ height: TopHeadHeight, width: sw, position: 'absolute', zIndex: 0, backgroundColor: '#00000055' }} />
        </View>
    )
}

export default HeadBG;