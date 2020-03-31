import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Platform, View, Text, ViewStyle } from 'react-native';
import { PxFit, Theme, ISAndroid } from '../../utils';

import NetInfo from '@react-native-community/netinfo';

function Button(props: {
    size?: 'default' | 'small' | 'large',
    title: any,
    titleStyle: any,
    onPress: any,
    style: ViewStyle,
    disabled: any,
    children: any,
    textColor: any,
    others: any
}) {
    
    const size = props?.size ?? 'default';
    const activeOpacity = props?.activeOpacity ?? 0.6;
    const hitSlop = { top: 12, bottom: 12, left: 8, right: 8 };
    let style = props?.style ?? {};
    let disabled = props.disabled;
    let title = props?.title;
    let titleStyle = props?.titleStyle ?? {};
    let textColor = props.textColor;
    let children = props?.children ?? null;

    const checkNetwork = (submit: any) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                submit();
            } else {
                Toast.show({ content: '网络错误,请检查是否连接网络' });
            }
        });
    }

    let borderRadius, paddingVertical, paddingHorizontal, textFontSize;
    let borderColor = Theme.primaryColor;
    // let textColor = '#fff';
    switch (size) {
        case 'large':
            borderRadius = PxFit(6);
            paddingVertical = PxFit(8);
            paddingHorizontal = PxFit(20);
            textFontSize = PxFit(20);
            break;
        case 'small':
            borderRadius = PxFit(3);
            paddingVertical = PxFit(2);
            paddingHorizontal = PxFit(4);
            textFontSize = PxFit(10);
            break;
        default:
            borderRadius = PxFit(4);
            paddingVertical = PxFit(6);
            paddingHorizontal = PxFit(12);
            textFontSize = PxFit(14);
    }
    style = {
        borderColor,
        borderRadius,
        paddingVertical,
        paddingHorizontal,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
    };
    if (disabled) {
        style.opacity = 0.65;
    }
    if (!React.isValidElement(title)) {
        let style = {
            color: props.textColor ? props.textColor : '#FFF',
            fontSize: textFontSize,
            overflow: 'hidden',
        };
        title = (
            <Text style={Object.assign({}, style, titleStyle)} numberOfLines={1}>
                {title}
            </Text>
        );
    }
    if (!children) children = title;

    return (
        <View style={style}>
            <TouchableOpacity style={styles.touch} onPress={() => checkNetwork(props.onPress)} {...props.others}>
                {children}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    touch: { flex: 1, alignItems: 'center' },
});

export default Button;