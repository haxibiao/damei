import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { sh, sw } from '../../tools';
import { useTheme } from '@react-navigation/native';

import { observer, config, } from 'store';
import { DataCenter } from "../../data";
const CoverSize = 32; //卡片尺寸

const RankPart = (props: any) => {
    const { navigation } = props;
    const me = DataCenter.User.me;

    const { colors } = useTheme();

    return (
        <>
            {
                !config.disableAd && <TouchableOpacity
                    onPress={() => navigation.navigate('Rank')}
                    style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: CoverSize * 1.6, width: CoverSize * 1.6, borderRadius: 5, overflow: 'hidden', backgroundColor: colors.primary }}>
                        <Image source={{ uri: 'rank' }} style={{ height: CoverSize, width: CoverSize }} resizeMode='contain' />
                    </View>
                    <View style={{ marginStart: 8 }}>
                        <Text style={{ fontSize: 18, color: colors.primaryText, marginBottom: 10 }}>答题排行</Text>
                        <Text style={{ fontSize: 14, color: colors.secondaryText }}>累计答题12891道</Text>
                    </View>
                </TouchableOpacity>
            }
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 7, marginHorizontal: 16 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: CoverSize * 1.6, width: CoverSize * 1.6, borderRadius: 5, overflow: 'hidden', backgroundColor: colors.primary }}>
                    <Image source={{ uri: 'heart' }} style={{ height: CoverSize, width: CoverSize }} resizeMode='contain' />
                </View>
                <View style={{ marginStart: 8 }}>
                    <Text style={{ fontSize: 18, color: colors.primaryText, marginBottom: 10 }}>我喜欢的题库</Text>
                    <Text style={{ fontSize: 14, color: colors.secondaryText }}>8个,答题629次</Text>
                </View>
            </TouchableOpacity>
        </>
    )
};

export default observer(RankPart);