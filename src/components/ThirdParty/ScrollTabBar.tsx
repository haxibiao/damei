/*
 * @flow
 * created by wyk made in 2018-12-12 15:27:15
 */
// custuom scroll-tab-view header
import React, { Component, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableNativeFeedback, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Theme, PxFit, ISIOS } from '../../utils';

function ScrollTabBar(props: {
    containerWidth: number, //tabBar外部容器宽度
    scrollValue: any, //切换tab的对应系数
    tabs: any,
    tabUnderlineWidth?: number,
    tabUnderlineHeight?: number,
    tabUnderlineScaleX?: number,
    hiddenUnderLine?: boolean,
    underLineColor?: string,
    underlineStyle?: any,
    activeTextStyle?: string,
    tintTextStyle?: string,
    tabWidth?: number,
    tabStyle?: any,
    textStyle?: any,
    // ...View.propTypes,
    goToPage?: any,
    activeTab?: number,
    style?: ViewStyle,
    onMounted: any
}) {

    const activeTextStyle = { color: Theme.defaultTextColor };
    const tintTextStyle = { color: Theme.subTextColor };
    const underLineColor = Theme.secondaryColor;
    const tabUnderlineHeight = 2;
    const hiddenUnderLine = false;

    const _renderTab = (name: string, page: number, isTabActive: boolean, onPressHandler: Function) => {
        // let { tabWidth, tabStyle, textStyle, activeTextStyle, tintTextStyle } = this.props;
        let style = isTabActive ? activeTextStyle : tintTextStyle;
        let tabWidthStyle = props.tabWidth ? { width: props.tabWidth } : { flex: 1 };
        // tabStyle = {
        //     alignItems: 'center',
        //     justifyContent: 'center',
        //     ...tabWidthStyle,
        //     ...tabStyle,
        // };
        // textStyle = {
        //     fontSize: PxFit(16),
        //     ...style,
        //     ...textStyle,
        // };
        return (
            <TouchableOpacity
                style={[{ alignItems: 'center', justifyContent: 'center', }, tabWidthStyle, props.tabStyle]}
                key={name}
                onPress={() => onPressHandler(page)}>
                <Text style={[{ fontSize: PxFit(16), }, style, props.textStyle]}>{name}</Text>
            </TouchableOpacity>
        );
    }

    const _renderUnderline = () => {
        // let {
        //     tabs,
        //     underlineStyle,
        //     containerWidth,
        //     tabWidth,
        //     tabUnderlineWidth,
        //     tabUnderlineHeight,
        //     tabUnderlineScaleX,
        //     underLineColor,
        //     scrollValue,
        // } = this.props;
        let numberOfTabs = props.tabs.length;
        let underlineWidth = props.tabUnderlineWidth
            ? props.tabUnderlineWidth
            : props.tabWidth
                ? props.tabWidth * 0.6
                : props.containerWidth / (numberOfTabs * 2);
        let scale = props.tabUnderlineScaleX ? props.tabUnderlineScaleX : 2;
        let deLen = props.tabWidth ? props.tabWidth * 0.2 : (props.containerWidth / numberOfTabs - underlineWidth) / 2;
        // let tabUnderlineStyle = {
        //     position: 'absolute',
        //     width: underlineWidth,
        //     height: tabUnderlineHeight,
        //     borderRadius: tabUnderlineHeight,
        //     backgroundColor: underLineColor,
        //     bottom: 0,
        //     left: deLen,
        //     ...underlineStyle,
        // };

        // 滑动tab，对应系数0~1
        let translateX = props.scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, props.tabWidth ? props.tabWidth : props.containerWidth / numberOfTabs],
        });

        // 计算scaleX动画系数
        let scaleValue = (defaultScale: any) => {
            let number = 4;
            let arr = new Array(number * 2);
            return arr.fill(0).reduce(
                function (pre, cur, idx) {
                    idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
                    idx % 2 ? pre.outputRange.push(defaultScale) : pre.outputRange.push(1);
                    return pre;
                },
                { inputRange: [], outputRange: [] },
            );
        };

        let scaleX = props.scrollValue.interpolate(scaleValue(scale));

        return (
            <Animated.View
                style={[
                    props.underlineStyle,
                    {
                        transform: [{ translateX }, { scaleX }],
                        position: 'absolute',
                        width: underlineWidth,
                        height: tabUnderlineHeight,
                        borderRadius: tabUnderlineHeight,
                        backgroundColor: underLineColor,
                        bottom: 0,
                        left: deLen,
                    },
                ]}
            />
        );
    }

    useEffect(() => {
        props.onMounted && props.onMounted();
    })

    return (
        <Animated.View style={[styles.tabBar, props.style]}>
            {props.tabs.map((name: any, page: any) => {
                const isTabActive = props.activeTab === page;
                return _renderTab(name, page, isTabActive, props.goToPage);
            })}
            {!hiddenUnderLine && _renderUnderline}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: PxFit(Theme.navBarContentHeight),
        flexDirection: 'row',
        alignItems: 'stretch',
        // borderWidth: PxFit(0.5),
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderColor: Theme.borderColor,
    },
});

export default ScrollTabBar;