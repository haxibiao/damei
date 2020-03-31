import React, { Component } from "react";
import { View, Text, TextStyle, ViewStyle } from "react-native";
import { Theme, PxFit, Tools } from "../../utils";

function Badge(props: {
    countStyle: any;
    count: string | number;
    maxCount?: number;
    style: any;
}) {


    const buildProps = () => {
        let { style, countStyle, count } = props;
        let maxCount = props?.maxCount ?? 99;
        let width = PxFit(20);
        let height = PxFit(20);
        let borderRadius = width / 2;

        style = [
            {
                backgroundColor: Theme.errorColor,
                minWidth: width,
                height: height,
                borderRadius: borderRadius,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
            },
        ].concat(style);

        countStyle = [
            {
                color: '#fff',
                fontSize: PxFit(11),
            },
        ].concat(countStyle);

        return { style, countStyle, count, maxCount };
    }
    let { style, countStyle, count, maxCount } = buildProps();
    return (
        <View style={style}>
            <Text
                style={countStyle}
                allowFontScaling={false}
                numberOfLines={1}
            >
                {count > maxCount ? maxCount + "+" : count}
            </Text>
        </View>
    );
}

export default Badge;
