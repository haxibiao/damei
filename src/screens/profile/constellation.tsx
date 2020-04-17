import React, { Component } from "react";
import {
    View,
    Text,
    Page,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
} from "../../widgets";

import Picker from "react-native-picker";
import { Icons,SvgIcon } from '../../res';

import { Overlay } from "teaset";
import { sw, sh } from "../../tools";
import * as  icon from "../../res/svgicon/icons";
import {observer} from 'mobx-react';
import LocalStore from './LocalStore';
const subviews = [
    {
        name: "白羊座",
        icon:icon.baiyang
    },
    {
        name: "金牛座",
        icon:icon.jinniu
    },
    {
        name: "双子座",
        icon:icon.shuangzi
    },
    {
        name: "巨蟹座",
        icon:icon.juxie
    },
    {
        name: "狮子座",
        icon:icon.shizi
    },
    {
        name: "处女座",
        icon:icon.chunv

    },
    {
        name: "天秤座",
        icon:icon.tiancheng

    },
    {
        name: "天蝎座",
        icon:icon.tianxie

    },
    {
        name: "射手座",
        icon:icon.sheshou

    },
    {
        name: "摩羯座",
        icon:icon.mojie
    },
    {
        name: "水瓶座",
        icon:icon.shuiping
    },
    {
        name: "双鱼座",
        icon:icon.shuangyu
    },
];

/**
 *  内容组件
 */
const Content = observer(() => {
    return (
        <View style={styles.war}>
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                    {subviews.map((item: { name: string ,icon:any}, index: number) => {
                        return (
                            <TouchableOpacity style={styles.touchable} onPress={() => {
                                //处理星座选择数据
                                LocalStore.setConstellation(item.name);
                                hide();
                            }}>
                                    <SvgIcon name={item.icon} color={'#000'}  />
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
        </View>
    )
});

let overlayKey: any = null;

const show = () => {
    const view = (
        <Overlay.View>
            <Content />
        </Overlay.View>
    )
    overlayKey = Overlay.show(view);
};

const hide = () => {
    Overlay.hide(overlayKey);
};
export { show, hide };

const styles = StyleSheet.create({
    war: {
        height: sh * 0.4,
        width: sw ,
        marginTop:sh * 0.6,
        backgroundColor: "#FFFCFC",
        paddingTop:sh*0.05,
    },
    touchable: {
        width: sw * 0.4,
        height: 40,
        marginLeft:sw * 0.3,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems: "center",
        borderBottomColor: "#F8F7F6",
        borderBottomWidth: 2,
    },
});
