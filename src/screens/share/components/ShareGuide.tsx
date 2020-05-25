import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';
import * as WeChat from 'react-native-wechat-lib';
const ShareGuide = (props) => {
    const content = props.user.invite_slogan;
    return (
        <View style={styles.container}>
            <TouchFeedback
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
                onPress={() => props.hide()}
            >
                <Iconfont name={'close'} size={16} color={Theme.grey} />
            </TouchFeedback>
            <View>
                <View style={{ marginVertical: PxFit(20) }}>
                    <View style={styles.textWrap}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>1</Text>
                        </View>
                        <Text>选择微信好友或微信群</Text>
                    </View>
                    <View style={styles.textWrap}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>2</Text>
                        </View>
                        <Text>在聊天窗口长按"粘贴"</Text>
                    </View>
                </View>
                <Image source={require('@src/assets/images/share_guide.png')} style={styles.guideImage} />
                <TouchFeedback
                    style={styles.buttonImage}
                    onPress={() => {
                        props.hide();
                        try {
                            WeChat.shareText({
                                text: content,
                                scene: 0,
                            })
                                .then((result) => {
                                    console.log('result', result);
                                })
                                .catch((err) => {
                                    console.log('err', err);
                                });
                            // console.log('result', result);
                        } catch (e) {
                            Toast.show({ content: '未安装微信或当前微信版本较低' });
                        }
                    }}
                >
                    <ImageBackground
                        source={require('@src/assets/images/share_guide_button.png')}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>去粘贴</Text>
                    </ImageBackground>
                </TouchFeedback>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(70),
        // height: ((SCREEN_WIDTH - PxFit(110)) * 1000) / 618,
        paddingHorizontal: PxFit(15),
        paddingVertical: PxFit(15),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
    },
    textWrap: {
        paddingVertical: PxFit(5),
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        backgroundColor: Theme.primaryColor,
        width: PxFit(20),
        height: PxFit(20),
        borderRadius: PxFit(10),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: PxFit(5),
    },
    guideImage: {
        width: SCREEN_WIDTH - PxFit(100),
        height: ((SCREEN_WIDTH - PxFit(100)) * 320) / 1125,
    },
    buttonImage: {
        marginTop: PxFit(20),
        marginBottom: PxFit(10),
        alignItems: 'center',
    },
    button: {
        width: SCREEN_WIDTH - PxFit(110),
        height: ((SCREEN_WIDTH - PxFit(110)) * 131) / 722,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Theme.white,
        fontSize: PxFit(15),
    },
});

export default ShareGuide;
