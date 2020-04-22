import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Page, Avatar } from '../../widgets';
import { sh, sw } from '../../tools';
import { DataCenter } from "../../data";
import { app, observer } from 'store';

const WalletEntry = (props: any) => {
    const me = DataCenter.User.me;

    return (
        <>
            <View style={{ width: sw * 0.9, marginStart: sw * 0.05, height: 1, backgroundColor: '#f1f1f1', marginVertical: 20 }} />
            <View style={{ width: sw, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'diamond' }} resizeMode='contain' style={{ height: 22, width: 22, marginEnd: 5 }} />
                    <Text style={{ color: '#555' }}>智慧点</Text>
                    <Text style={{ color: '#333', fontSize: 18, marginStart: 8 }}>{me.gold}</Text>
                </View>
                <View style={{ height: '100%', width: 1, backgroundColor: 'gray' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: 'heart' }} resizeMode='contain' style={{ height: 22, width: 22, marginEnd: 5 }} />
                    <Text style={{ color: '#555' }}>精力点</Text>
                    <Text style={{ color: '#333', fontSize: 18, marginStart: 8 }}>{me.ticket}</Text>
                </View>
            </View>
            <View style={{ width: sw * 0.9, marginStart: sw * 0.05, height: 1, backgroundColor: '#f1f1f1', marginVertical: 20 }} />
        </>
    )
}

export default observer(WalletEntry);