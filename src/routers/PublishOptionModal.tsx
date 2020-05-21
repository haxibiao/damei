import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Overlay } from 'teaset';
import { app, config, observer } from 'store';
import * as PermissionChecker from '../screens/live/CommonWidgetPermissionChecker';
import { ISAndroid } from 'utils';

const { width: sw, height: sh } = Dimensions.get('window');

const IconSize = 65;

const StartLiveButton = observer((props: any) => {
    const navigation = props.navigation;

    return (
        <TouchableOpacity
            onPress={() => {
                if (app.login) {
                    if (app.sufficient_permissions) {
                        navigation.navigate('startlive');
                        hidePublishOption();
                    } else {
                        //权限不够，打开权限窗口
                        PermissionChecker.showPermissionCheck();
                    }
                } else {
                    navigation.navigate('Login');
                    hidePublishOption();
                }
            }}
            style={styles.btn}
        >
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../assets/images/publish_live.png')}
                    resizeMode='contain'
                    style={{ height: IconSize, width: IconSize }}
                />
                <Text style={styles.title1}>开直播</Text>
                <Text style={styles.subtitle}>分享你的有趣生活</Text>
            </View>
        </TouchableOpacity>
    );
});

let overlaykey: any = null;
const showPublishOption = (navigation: any) => {
    const chooseView = (
        <Overlay.View overlayOpacity={0} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.container}>
                <View style={styles.live_wrapper}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(app.login ? 'AskQuestion' : 'Login');
                            hidePublishOption();
                        }}
                        style={styles.btn}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Image
                                source={require('../assets/images/publish_twitter.png')}
                                resizeMode='contain'
                                style={{ height: IconSize, width: IconSize }}
                            />
                            <Text style={styles.title1}>发动态</Text>
                            <Text style={styles.subtitle}>分享有趣视频</Text>
                        </View>
                    </TouchableOpacity>
                    {!config.disableAd && <StartLiveButton navigation={navigation} />}
                </View>

                <TouchableOpacity
                    onPress={() => {
                        hidePublishOption();
                    }}
                    style={styles.close}
                >
                    <Text style={{ fontSize: 20, color: '#333' }}>关闭</Text>
                </TouchableOpacity>
            </View>
        </Overlay.View>
    );
    overlaykey = Overlay.show(chooseView);
};
const hidePublishOption = () => {
    Overlay.hide(overlaykey);
};

export { showPublishOption, hidePublishOption };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fffffffb',
    },
    live_wrapper: {
        flexDirection: 'row',
        width: sw,
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    title1: {
        fontSize: 16,
        color: '#333',
        marginTop: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 4.2,
    },
    btn: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    close: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: sh * 0.06,
        marginTop: sh * 0.16,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
});
