import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Overlay } from 'teaset';

import { app, storage, keys } from 'store';
import TouchFeedback from '../TouchableView/TouchFeedback';
import { PxFit, Theme, Tools, Config } from 'utils';

interface Props {
    callback?: Function;
}

let OverlayKey: any = null;

const UserAgreementOverlay = (props) => {
    console.log('props :>> ', props);
    const { callback } = props;

    const [tick, setTick] = useState(true);

    return (
        <View style={styles.overlayView}>
            <View style={styles.row}>
                <Text style={styles.title}>用户协议与隐私政策</Text>
            </View>

            <View>
                <Text style={styles.head}>欢迎使用{Config.AppName}APP！</Text>
                <Text style={styles.text}>
                    我们非常重视您的个人信息和隐私保护。 为了更好地保障您的个人权益，在您使用{Config.AppName}
                    产品与服务前，请您认真阅读并充分理解
                    <Text style={{ fontSize: PxFit(13) }}>《用户协议》</Text>和
                    <Text style={{ fontSize: PxFit(13) }}>《隐私政策》</Text>
                    。当您点击同意，并开始使用产品服务时，即表示您已经理解并同意该条款内容，该条款将对您产品法律的约束力。
                </Text>
            </View>

            <View style={{ marginTop: PxFit(10) }}>
                <TouchableOpacity
                    style={styles.row}
                    activeOpacity={1}
                    onPress={() => {
                        // hide();
                        setTick(!tick);
                    }}
                >
                    <Image
                        source={
                            tick ? require('@src/assets/images/tick.png') : require('@src/assets/images/istick.png')
                        }
                        style={styles.tick}
                    />
                    <Text style={{ fontSize: PxFit(12), color: '#797979', marginLeft: PxFit(5) }}>
                        我已阅读并同意
                        <Text
                            style={{ fontSize: PxFit(12), color: Theme.primaryColor }}
                            onPress={() => {
                                hide();
                                Tools.navigate('UserProtocol');
                            }}
                        >
                            《用户协议》
                        </Text>
                        和
                        <Text
                            style={{ fontSize: PxFit(12), color: Theme.primaryColor }}
                            onPress={() => {
                                hide();
                                Tools.navigate('PrivacyPolicy');
                            }}
                        >
                            《隐私政策》
                        </Text>
                    </Text>
                </TouchableOpacity>
                <TouchFeedback
                    style={styles.bottom}
                    activeOpacity={1}
                    disabled={!tick}
                    onPress={() => {
                        hide();
                        callback && callback();
                    }}
                >
                    <Text style={{ fontWeight: 'bold', fontSize: PxFit(16), color: '#623605' }}>知道了</Text>
                </TouchFeedback>
            </View>
        </View>
    );
};

export const show = (props: Props) => {
    const overlayView = (
        <Overlay.View animated style={{ justifyContent: 'center' }}>
            <UserAgreementOverlay {...props} />
        </Overlay.View>
    );
    OverlayKey = Overlay.show(overlayView);
};
export const hide = () => {
    Overlay.hide(OverlayKey);
};

const styles = StyleSheet.create({
    overlay: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayView: {
        marginHorizontal: '8%',
        // minHeight: '50%',
        paddingHorizontal: PxFit(20),
        paddingVertical: PxFit(15),
        borderRadius: 15,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: PxFit(10),
    },
    head: {
        fontSize: PxFit(15),
        color: '#797979',
        marginBottom: PxFit(25),
        marginTop: PxFit(20),
    },
    text: {
        fontSize: PxFit(13),
        color: '#797979',
        lineHeight: PxFit(20),
    },
    tick: {
        width: PxFit(18),
        height: PxFit(18),
        // marginRight: 5,
    },
    bottom: {
        paddingVertical: PxFit(10),
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 50,
        marginTop: 20,
        backgroundColor: '#FCE13D',
    },
});

export default { show, hide };
