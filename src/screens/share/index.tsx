import React, { Component, useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, FlatList, Image, Dimensions, Animated, Linking } from 'react-native';
import { PageContainer, TouchFeedback, PullChooser, Iconfont } from 'components';
import { Theme, SCREEN_WIDTH, PxFit, Tools, SCREEN_HEIGHT, Config, ISIOS } from 'utils';

import { compose, useQuery, GQL } from 'apollo';
import { app } from 'store';
import { WebView } from 'react-native-webview';
import { Overlay } from 'teaset';
import ShareRule from './components/ShareRule';
import ShareTypeOverlay from './components/ShareTypeOverlay';
import ShareGuide from './components/ShareGuide';

const index = (props) => {
    const [progress, setProgress] = useState(0.1);
    const { navigation } = props;
    const webview = useRef(null);

    const { data, loading, error } = useQuery(GQL.userInvitationInfoQuery, { variables: { user_id: app.me.id } });
    const user = Tools.syncGetter('user', data);
    const injectedJavascript = `(function() {
        window.postMessage = function(data) {
            window.ReactNativeWebView.postMessage(data);
        };
    })()`;

    const showRule = () => {
        let overlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <ShareRule hide={() => Overlay.hide(OverlayKey)} />
                </View>
            </Overlay.View>
        );
        const OverlayKey = Overlay.show(overlayView);
    };

    const showShareType = () => {
        const shareTypeOverlayView = (
            <Overlay.PullView style={{ flexDirection: 'column', justifyContent: 'flex-end' }} animated>
                <ShareTypeOverlay hide={() => Overlay.hide(ShareTypeOverlayKey)} user={user} />
            </Overlay.PullView>
        );
        const ShareTypeOverlayKey = Overlay.show(shareTypeOverlayView);
    };

    const showShareGuide = () => {
        const shareGuideOverlayView = (
            <Overlay.View animated>
                <View style={styles.overlayInner}>
                    <ShareGuide hide={() => Overlay.hide(ShareGuideOverlayKey)} user={user} />
                </View>
            </Overlay.View>
        );
        const ShareGuideOverlayKey = Overlay.show(shareGuideOverlayView);
    };

    const onMessageAction = (event) => {
        // console.log('触发:', event);
        console.log('event :', event.nativeEvent.data);
        console.log('data :', data, error);

        switch (event.nativeEvent.data) {
            case 'showInviteRule':
                showRule();
                // navigation.navigate('InviteeList', { shareInfo: data.user });
                break;
            case 'showInvitetype':
                // showShareType();
                showShareGuide();
                break;
            case 'openShareDetail':
                navigation.navigate('InviteeList', { shareInfo: data.user });
                break;
            default:
                break;
        }
    };

    if (loading || !data.user) {
        return null;
    }

    return (
        <PageContainer
            white
            title='邀请好友'
            navBarStyle={{
                borderBottomWidth: 0,
            }}
        >
            <View
                style={{
                    height: 2,
                    width: SCREEN_WIDTH * progress,
                    backgroundColor: Theme.theme,
                }}
            />
            <WebView
                ref={webview}
                source={{ uri: `${Config.ServerRoot}/share?invite_code=${data.user.invite_code}` }}
                style={{ width: '100%', height: '100%' }}
                onMessage={onMessageAction}
                injectedJavaScript={injectedJavascript}
                startInLoadingState={true}
                onLoad={() => {
                    const user = Tools.syncGetter('user', data);
                    const InjectJavaScript = `receiveMessage('${JSON.stringify(user)}');true;`;
                    webview.current.injectJavaScript(InjectJavaScript);
                }}
                onLoadStart={() => {
                    setProgress(0.2);
                    setTimeout(() => {
                        setProgress(0.4);
                    }, 100);
                    setTimeout(() => {
                        setProgress(0.8);
                    }, 200);
                }}
                onLoadEnd={() => {
                    setProgress(0);
                    // Toast.show({ content: '阅读完成,奖励已送达', layout: 'bottom' });
                }}
            />
            {!ISIOS && (
                <View style={{ position: 'absolute', left: 0, bottom: 0, width: SCREEN_WIDTH }}>
                    <ShareTypeOverlay user={user} />
                </View>
            )}
        </PageContainer>
    );
};

const styles = StyleSheet.create({
    optionsButton: {
        flex: 1,
        width: PxFit(40),
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    overlayInner: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default index;
