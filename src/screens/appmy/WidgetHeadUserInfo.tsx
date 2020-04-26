import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Page, Avatar, HocStatusWidget } from '../../widgets';
import { sh, sw } from '../../tools';
import { FemaleTag, LevelTag } from './Tags';
import { observer } from 'store';
import { DataCenter } from "../../data";


const HeadUserInfo = (props: any) => {

    const { navigation } = props;
    const me = DataCenter.User.me;

    const PersonalTag = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LevelTag text={me.level?.level} />
            </View>
        );
    };

    return (

        <TouchableOpacity onPress={() => navigation.navigate('User', { user: me })}
            style={{
                flexDirection: 'row',
            }}>
            <Avatar uri={me.avatar} size={56} frameStyle={{ marginBottom: 12, marginEnd: 12 }} />
            <View style={{ justifyContent: 'center', paddingBottom: 10 }}>
                <Text style={{ fontSize: 18, color: 'white', fontWeight: '500', marginBottom: 6 }}>{me.name}</Text>
                <PersonalTag />
            </View>
        </TouchableOpacity>
    );
};

export default observer(HeadUserInfo);