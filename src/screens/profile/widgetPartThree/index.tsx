import React, { useEffect } from 'react';
import { Page, StyleSheet, TouchableOpacity, Image } from '../../../widgets';
import { View, Text } from 'react-native';
import { sw, sh } from '../../../tools';
import { observer } from 'mobx-react';
import { TouchFeedback, Row } from 'components';
import { config } from 'store';

const subviews = [
    {
        name: '我的发布',
        icon: 'ic_mine_order',
        targetRoute: 'MyPublish',
    },
    {
        name: '我的收藏',
        icon: 'ic_mine_collection',
        targetRoute: 'FavoritesLog',
    },
    {
        name: '答题记录',
        icon: 'ic_mine_medal',
        targetRoute: 'AnswerLog',
    },
    {
        name: '排行榜',
        icon: 'rank',
        targetRoute: 'Rank',
    },
    {
        name: '消息中心',
        icon: 'ic_mine_speak',
        targetRoute: 'Notification',
    },
    {
        name: '常见问题',
        icon: 'ic_mine_shopping',
        targetRoute: 'CommonIssue',
    },
    {
        name: '反馈中心',
        icon: 'ic_mine_service',
        targetRoute: 'Feedback',
    },
    {
        name: '赚钱攻略',
        icon: 'ic_mine_gift',
        targetRoute: 'MakeMoenyManual',
    },
];
const subviewsPadding = 8;
const containerMarginH = 13;

const WidgetPartThree = (props: { navigation: any }) => {
    const subviewItemWidth = (sw - subviewsPadding * 2 - containerMarginH * 2) / (config.disableAd ? 3 : 4);
    return (
        <View
            style={[
                {
                    paddingHorizontal: subviewsPadding,
                    backgroundColor: '#FFFBFC',
                    marginTop: config.disableAd ? 30 : 5,
                },
                styles.container,
            ]}
        >
            {subviews.map((item: { name: string; icon: string; targetRoute: string }, index: number) => {
                if (config.disableAd && (item.name == '赚钱攻略' || item.name == '排行榜')) return null;
                return (
                    <TouchFeedback
                        navigation={props.navigation}
                        authenticated
                        onPress={() => {
                            props.navigation.navigate(item.targetRoute);
                        }}
                        key={index}
                        style={{
                            height: 85,
                            width: subviewItemWidth,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image source={{ uri: item.icon }} resizeMode='contain' style={{ height: 30, width: 30 }} />
                        <Text style={{ marginTop: 10 }}>{item.name}</Text>
                    </TouchFeedback>
                );
            })}
        </View>
    );
};

export default WidgetPartThree;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 13,
        height: 'auto',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 10,
        paddingVertical: 8,
    },
});
