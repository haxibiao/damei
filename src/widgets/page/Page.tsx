import React, { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Dimensions, ScrollView,View, Animated, Text, TextStyle, ViewStyle, Platform } from 'react-native';
import HeaderBackButton from '../HeaderBackButton';
import DeviceInfo from 'react-native-device-info';
const { width, height } = Dimensions.get('window');
import {useStatusHeight} from '../../tools';
var StatusBarHeight = StatusBar.currentHeight ?? 0;// 状态栏高度

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
    enableNavBottomBorder?: boolean;
    navBottomBorderColor?: string;
    centerTitle?: string;
    leftTitle?: string;
    centerTitleStyle?: TextStyle;
    leftTitleStyle?: TextStyle;
    rightWidget?: JSX.Element;
    arrow?: boolean;
    barStyle?: keyof BarStyle;
    barBackground?: string;
    navigation: any;
    
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
    var navBottomBorderStyle:ViewStyle = {borderBottomColor: props?.navBottomBorderColor ?? 'transparent' ,borderBottomWidth: props?.navBottomBorderColor ? 1 : 0};
    if(props?.enableNavBottomBorder){// 允许顶部导航栏下划线
        navBottomBorderStyle = {borderBottomWidth:1,borderBottomColor:'#f1f1f1'}
    }

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

    StatusBarHeight = useStatusHeight();

    return (
        <View style={{ backgroundColor: backgroundColor,flex:1 }}>

            <StatusBar backgroundColor={props?.barBackground ?? 'transparent'} barStyle={barStyle}/>

            {/*  头部导航栏  开始*/}
            <View style={[
                styles.body,
                {
                    minHeight: NavBarHeight + StatusBarHeight,
                    width: width,
                    backgroundColor: navBackgroundColor,
                },
                navBottomBorderStyle
            ]}>
                <View style={[styles.leftWidgetContainer,{height: NavBarHeight}]}>
                    <HeaderBackButton arrow={props?.arrow ?? false} color={'#454545'} navigation={props.navigation}/>
                    <Text style={props?.leftTitleStyle ?? { marginStart: 5, fontSize: 18 }}>{props?.leftTitle ?? ''}</Text>
                </View>
                <View style={[styles.centerWidgetContainer,{height: NavBarHeight}]}>
                    <Text style={props?.centerTitleStyle ?? { fontSize: 17, color: '#222' }}>
                        {props?.centerTitle ?? ''}
                    </Text>
                </View>
                <View style={[styles.rightWidgetContainer,{height: NavBarHeight}]}>
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
    },
    rightWidgetContainer: {
        flex:3,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center'
    },
    centerWidgetContainer:{
        flex:2,
        flexDirection:'row',
        alignItems:'center'
    },
    leftWidgetContainer:{ 
        flex:3,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center'
    }
})