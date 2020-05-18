/*
 * @flow
 * created by wyk made in 2019-04-11 17:14:30
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image } from 'react-native';
import { Theme, PxFit, SCREEN_WIDTH } from '../../../utils';

function WithdrawLogItem(props) {
    const { style, navigation, item } = props;
    let statusText,
        color,
        image_url,
        withdrawTips,
        size = 40;
    switch (item.status) {
        case -1:
            statusText = '提现失败';
            color = Theme.errorColor;
            break;
        case 1:
            statusText = '提现成功';
            color = Theme.weixin;
            break;
        case 0:
            statusText = '待处理';
            color = Theme.correctColor;
            break;
    }

    switch (item.to_platform) {
        case 'alipay':
            image_url = require('../../../assets/images/zhifubao.png');
            break;
        case 'wechat':
            image_url = require('../../../assets/images/wechat.png');
            break;
        case 'dongdezhuan':
            image_url = require('../../../assets/images/dongdezhuan.png');
            withdrawTips = '(提现到懂得赚)';
            break;
        case 'datizhuanqian':
            image_url = require('../../../assets/images/datizhuanqianicon.png');
            withdrawTips = '(提现到答题赚钱)';
            break;
        default:
            image_url = require('../../../assets/images/money_icon.png');
            size = 46;
            break;
    }

    return (
        <TouchableOpacity
            style={[styles.item, style]}
            activeOpacity={0.7}
            disabled={item.status == 0}
            onPress={() =>
                navigation.navigate('withdrawLogDetails', {
                    withdraw_id: item.id,
                })
            }
        >
            <Image source={image_url} style={{ width: size, height: size, marginVertical: PxFit(15) }} />
            <View style={{ width: (SCREEN_WIDTH * 4) / 7 }}>
                <Text style={{ fontSize: PxFit(15), color: Theme.defaultTextColor }}>
                    {statusText}
                    {withdrawTips}
                    <Text style={{ fontSize: 15, color: Theme.themeRed }}>{item.remark && `   (${item.remark})`}</Text>
                </Text>
                <Text style={{ fontSize: PxFit(12), color: Theme.subTextColor, paddingTop: PxFit(10) }}>
                    {item.created_at}
                </Text>
            </View>
            <View>
                <Text style={{ fontSize: PxFit(20), color }}>￥{item.amount}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomColor: Theme.lightBorder,
        borderBottomWidth: 0.5,
        paddingHorizontal: 15,
    },
});

export default WithdrawLogItem;
