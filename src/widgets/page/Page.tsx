import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native-ui-lib';
import { StatusBar, StyleSheet, Dimensions, ScrollView, Animated, Text, TextStyle, ViewStyle, Platform } from 'react-native';
import HeaderBackButton from '../HeaderBackButton';
import DeviceInfo from 'react-native-device-info';
const { width, height } = Dimensions.get('window');
const StatusBarHeight = StatusBar.currentHeight ?? 0;// 状态栏高度

const PageBackground = '#ffffff';//最外层view的背景色 
const NavBackgroundColor = '#ffffff';// 导航栏的背景色
const ContentBackgroundColor = '#ffffff'; //内容容器背景色

interface BarStyle {
    'light-content': string;
    'dark-content': string;
    'default': string;
}

function isAndroid() {
    return Platform.OS == 'android';
}

export default function Page(props: {
    safe?: boolean;
    safeStatus?: boolean;
    header?: JSX.Element;
    children?: JSX.Element[] | JSX.Element;
    backgroundColor?: string;
    contentBackgroundColor?: string;
    contentFrameStyle?: ViewStyle;
    navBackgroundColor?: string;
    centerTitle?: string;
    leftTitle?: string;
    centerTitleStyle?: TextStyle;
    leftTitleStyle?: TextStyle;
    rightWidget?: JSX.Element;
    arrow?: boolean;
    barStyle?: keyof BarStyle;
    barBackground?: string;
}) {

    const backgroundColor = props?.backgroundColor ?? PageBackground; //最外层view的背景色 
    const navBackgroundColor = props?.navBackgroundColor ?? NavBackgroundColor; // 导航栏的背景色
    const contentBackgroundColor = props?.contentBackgroundColor ?? ContentBackgroundColor; //内容容器背景颜色

    /**
     *  安卓顶部导航栏高 Material Design 当前标准为56，市场常见为 48 ,
     *  ios顶部导航栏 
     *      非刘海屏： 导航栏 44 , 状态栏 20 , tabBar 49
     *      刘海屏 : 导航栏 44 , 状态栏 20 , tabBar 83
     */

    //导航栏高度适配
    const NavBarHeight = isAndroid() ? 48 : 44; //安卓对应48，IOS对应44


    const barStyle = props?.barStyle ?? (props?.barBackground == 'white' || !props?.barBackground) ? 'dark-content' : 'default';

    const hasNotch = DeviceInfo.hasNotch();
    //判断 hasNotch。iPhone刘海高 34
    let MT = 0;
    if (hasNotch) {
        if (hasNotch) {
            MT = 34;
        }
    }
    /**
     *  状态栏安全预留高度，如果设置了 safeStatus 属性为false，则默认全屏，占据statusBar的位置。
     *  默认安卓下预留状态栏高度
     */
    const safeStatusHeight = () => {
        if (props?.safeStatus != undefined) {
            if (props?.safeStatus == false) return 0;
        }
        return StatusBarHeight;
    }

    /**
     *  如果启用 safe 属性，则内容顶部将预留出 （导航栏高 + 状态栏高 : 前提是设置了状态栏透明）
     */
    // const safePT: () => number = () => {
    //     let statusH = safeStatusHeight();
    //     let result = 0;
    //     if (Platform.OS == 'android') {
    //         result = props.safe ? HeaderHeight + statusH : statusH;
    //     } else if (Platform.OS == 'ios') {
    //         //TODO: 适配IOS下状态栏透明时距离顶部预留高度
    //     }
    //     return result;
    // }

    return (
        <View flex style={{ backgroundColor: backgroundColor }}>

            <StatusBar backgroundColor={props?.barBackground ?? 'white'} barStyle={barStyle} />

            {/*  头部导航栏  开始*/}
            <View style={[
                styles.body,
                {
                    minHeight: NavBarHeight + StatusBarHeight,
                    width: width,
                    backgroundColor: navBackgroundColor,
                },
            ]}>
                <View flex-3 row left centerV style={{ height: NavBarHeight }}>
                    <HeaderBackButton arrow={props?.arrow ?? false} color={'#454545'} />
                    <Text style={props?.leftTitleStyle ?? { marginStart: 5, fontSize: 18 }}>{props?.leftTitle ?? ''}</Text>
                </View>
                <View flex-2 row center style={{ height: NavBarHeight }}>
                    <Text style={props?.centerTitleStyle ?? { fontSize: 20, color: '#222' }}>
                        {props?.centerTitle ?? ''}
                    </Text>
                </View>
                <View flex-3 row right style={{ height: NavBarHeight }}>
                    {
                        props?.rightWidget ?? <View />
                    }
                </View>
            </View>
            {/*  头部导航栏  结束*/}

            <ScrollView
                contentContainerStyle={[{ backgroundColor: contentBackgroundColor, flex: 1 },props?.contentFrameStyle ?? {}]}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                {props.children}
            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    body: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-end',
    }
})