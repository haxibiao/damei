import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { sw, sh } from '../../tools';
import {InspirationWidth,InspirationMarginStart} from './res';


/**
 *  每日鸡汤 组件
 */
const DayInspiration = () => {
    const { colors } = useTheme();
    return (
        <View style={{
            width: InspirationWidth,
            marginStart: InspirationMarginStart,
            paddingVertical: 4.2,
            borderRadius: 20,
            backgroundColor: colors.dayInspiration,
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 20
        }}>
            <Text style={{ color: colors.secondaryText, fontSize: 13 }}>💖 "今天、又是美好的一天"</Text>
        </View>
    )
}

export default DayInspiration;