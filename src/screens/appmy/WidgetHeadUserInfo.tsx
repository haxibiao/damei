import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Page, Avatar } from '../../widgets';
import { sh, sw } from '../../tools';
import { FemaleTag, LevelTag } from './Tags';

const PersonalTag = () => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LevelTag text='9' />
        </View>
    )
};

const HeadUserInfo = () => {

    return (
        <View style={{
            flexDirection: 'row',
        }}>
            <Avatar uri={'default_avatar'} size={56} frameStyle={{ marginBottom: 12, marginEnd: 12 }} />
            <View style={{ justifyContent: 'center', paddingBottom: 10 }}>
                <Text style={{ fontSize: 18, color: 'white', fontWeight: '500', marginBottom: 6 }}>Mr------------L</Text>
                <PersonalTag />
            </View>
        </View>
    )
}

export default HeadUserInfo;