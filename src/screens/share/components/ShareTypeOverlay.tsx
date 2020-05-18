import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, Clipboard, NativeModules } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH, Api } from 'utils';

import { Overlay } from 'teaset';
import { Share } from 'native';

import * as WeChat from 'react-native-wechat';

const ShareTypeOverlay = (props) => {
    const { user } = props;
    const content = user.invite_slogan;

    Clipboard.setString(user.invite_slogan);
    return (
        <View style={{ backgroundColor: '#FFF' }}>
            <View style={styles.top}>
                {/*  <TouchFeedback
                    onPress={async () => {
                        // props.hide();

                        let callback = await Share.shareWechatMoment(content);

                        if (callback == false) {
                            Toast.show({
                                content: '请先安装微信客户端',
                            });
                        }

                        console.log('callback', callback);
                    }}
                    style={{ alignItems: 'center' }}>
                    <Image source={require('@src/assets/images/friends.png')} style={styles.imageStyle} />
                    <Text style={{ color: Theme.grey, fontSize: 12 }}>朋友圈</Text>
                </TouchFeedback> */}
                <TouchFeedback
                    onPress={async () => {
                        // props.hide();
                        try {
                            await WeChat.shareToSession({
                                type: 'text',
                                description: content,
                            });
                        } catch (e) {
                            Toast.show({ content: '未安装微信或当前微信版本较低' });
                        }
                    }}
                    style={{ alignItems: 'center' }}
                >
                    <Image source={require('@src/assets/images/wechat.png')} style={styles.imageStyle} />

                    <Text style={{ color: Theme.grey, fontSize: 12 }}>微信好友</Text>
                </TouchFeedback>
                <TouchFeedback
                    onPress={async () => {
                        // props.hide();

                        let callback = await Share.shareTextToQQ(content);

                        if (callback == false) {
                            Toast.show({
                                content: '请先安装QQ客户端',
                            });
                        }
                    }}
                    style={{ alignItems: 'center' }}
                >
                    <Image source={require('@src/assets/images/qq.png')} style={styles.imageStyle} />
                    <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ好友</Text>
                </TouchFeedback>
                <TouchFeedback
                    onPress={async () => {
                        // props.hide();

                        let callback = await Share.shareToSinaFriends(content);

                        if (callback == false) {
                            Toast.show({
                                content: '请先安装微博客户端',
                            });
                        }
                    }}
                    style={{ alignItems: 'center' }}
                >
                    <Image source={require('@src/assets/images/weibo.png')} style={styles.imageStyle} />
                    <Text style={{ color: Theme.grey, fontSize: 12 }}>微博</Text>
                </TouchFeedback>
                <TouchFeedback
                    onPress={async () => {
                        // props.hide();

                        let callback = await Share.shareImageToQQZone(content);

                        if (callback == false) {
                            Toast.show({
                                content: '请先安装QQ空间客户端',
                            });
                        }
                    }}
                    style={{ alignItems: 'center' }}
                >
                    <Image source={require('@src/assets/images/qzone.png')} style={styles.imageStyle} />
                    <Text style={{ color: Theme.grey, fontSize: 12 }}>QQ空间</Text>
                </TouchFeedback>
            </View>
            {/*  <TouchFeedback style={styles.closeItem} onPress={() => props.hide()}>
                <Text style={styles.headerText}>取消</Text>
            </TouchFeedback> */}
        </View>
    );
};

const styles = StyleSheet.create({
    top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: PxFit(Theme.itemSpace),
    },
    imageStyle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginBottom: 10,
    },
    closeItem: {
        height: PxFit(40),
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginBottom: 5,
        borderRadius: PxFit(6),
    },
    headerText: {
        fontSize: PxFit(15),
        color: Theme.confirmColor,
        textAlign: 'center',
    },
});

export default ShareTypeOverlay;
