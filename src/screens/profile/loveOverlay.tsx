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
import { Icons, SvgIcon } from '../../res';

import { Overlay } from "teaset";
import { sw, sh } from "../../tools";
import * as  icon from "../../res/svgicon/icons";
import { observer } from 'mobx-react';
import LocalStore from './LocalStore';
const subviews = [
    {
        name: "单身",
    },
    {
        name: "热恋",
    },
    {
        name: "暗恋",
    },
    {
        name: "求交往",
    },
    {
        name: "保密",
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
                {subviews.map((item: { name: string; }, index: number) => {
                    return (
                        <TouchableOpacity style={styles.touchable} onPress={() => {
                            //处理恋爱状态选择数据
                            LocalStore.setlove(item.name);
                            hide();
                        }}>
                            <Text>{item.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
});

let overlayKey: any = null;

const show = () => {
    const view = (
        <Overlay.View>
            <Content />
        </Overlay.View>
    );
    overlayKey = Overlay.show(view);
};

const hide = () => {
    Overlay.hide(overlayKey);
};
export { show, hide };

const styles = StyleSheet.create({
    war: {
        height: sh * 0.4,
        width: sw,
        marginTop: sh * 0.6,
        backgroundColor: "#FFFCFC",
        paddingTop: sh * 0.05,
    },
    touchable: {
        width: sw * 0.4,
        height: 40,
        marginLeft: sw * 0.3,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: "center",
        borderBottomColor: "#F8F7F6",
        borderBottomWidth: 2,
    },
});
