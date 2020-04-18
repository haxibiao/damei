import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import { SvgIcon, Icons } from '../../res';
import { sh, sw } from '../../tools';

export default function SearchBox() {

    return (
        <View style={s.wrapper}>
            <SvgIcon name={Icons.search} size={15} scale={0.015} color='#868E96' />
            <Text style={{ fontSize: 13, color: '#868E96', marginStart: 3 }}>搜索你感兴趣的题库</Text>
        </View>
    )
}

const s = StyleSheet.create({
    wrapper:{ 
        width: sw * 0.76, 
        height: 34, 
        borderRadius: 20, 
        borderWidth: 1, 
        borderColor: '#C4C9DF', 
        alignSelf: 'center', 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingStart: 13 
    }
})