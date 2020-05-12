import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Overlay } from 'teaset';
import Theme from '../../utils/Theme';
import { storage } from 'store';

import UserProtocol from '../../screens/setting/components/UserProtocolView';
import PrivacyPolicy from '../../screens/setting/components/PrivacyPolicyView';

let OverlayKey: any = null;
let recordable: boolean = true;

const hide = () => {
    Overlay.hide(OverlayKey);
};

function ContentView() {
    const [tick, setTick] = useState(true);
    const [introduction, setIntroduction] = useState(true);
    const [protocol, setProtocol] = useState(false);
    const [policy, setPolicy] = useState(false);
    return (
        <View style={styles.overlayView}>
            <View style={styles.row}>
                <Text style={styles.title}>用户协议与隐私政策</Text>
            </View>
            <View style={{ height: '53%' }}>
                {introduction &&
                    <ScrollView>
                        <Text style={styles.head}>欢迎使用答妹APP！</Text>
                        <Text style={styles.text}>
                            我们非常重视您的个人信息和隐私保护。
                            为了更好地保障您的个人权益，在您使用答妹产品与服务前，请您认真阅读并充分理解
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>《用户协议》</Text>
                                和
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>《隐私政策》</Text>
                                。当您点击同意，并开始使用产品服务时，即表示您已经理解并同意该条款内容，该条款将对您产品法律的约束力。
                            </Text>
                    </ScrollView>
                }
                {protocol && <UserProtocol />}
                {policy && <PrivacyPolicy />}
            </View>
            <TouchableOpacity
                style={styles.row}
                activeOpacity={1}
                onPress={() => {
                    setTick(!tick);
                    setIntroduction(true)
                    setProtocol(false);
                    setPolicy(false);
                }}
            >
                <Image
                    source={tick ? require('../../assets/images/tick.png') : require('../../assets/images/istick.png')}
                    resizeMode='contain'
                    style={styles.tick}
                />
                <Text style={{ fontSize: 14, color: '#797979' }}>
                    我已阅读并同意
                            <Text
                        style={{ color: Theme.primaryColor }}
                        onPress={() => {
                            setIntroduction(false)
                            setProtocol(true);
                            setPolicy(false);
                        }}
                    >
                        《用户协议》
                            </Text>
                            和
                            <Text
                        style={{ color: Theme.primaryColor }}
                        onPress={() => {
                            setIntroduction(false)
                            setProtocol(false);
                            setPolicy(true);
                        }}
                    >
                        《隐私政策》
                            </Text>
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.bottom, { backgroundColor: tick ? Theme.primaryColor : '#FFBB0477' }]}
                activeOpacity={1}
                onPress={() => {
                    if (tick) {
                        recordable && storage.setItem('createUserAgreement', JSON.stringify({}));
                        hide();
                    }
                }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 17, color: '#643a07' }}>知道了</Text>
            </TouchableOpacity>
        </View>
    )
}

const UserAgreementOverlay = () => {

    const overlayView = (
        <Overlay.View
            style={styles.overlay}
            animated
            modal
        >
            <ContentView />
        </Overlay.View>
    );

    (async function () {
        const result = await storage.getItem('createUserAgreement');
        if (!result) {
            OverlayKey = Overlay.show(overlayView);
        }
    })();

}

const styles = StyleSheet.create({
    overlay: { alignItems: 'center', justifyContent: 'center' },
    overlayView: {
        marginHorizontal: '8%',
        padding: 15,
        borderRadius: 15,
        backgroundColor: '#FFF',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    head: {
        fontSize: 15,
        color: '#797979',
        marginBottom: 20
    },
    text: {
        fontSize: 15,
        color: '#797979',
        lineHeight: 26
    },
    tick: {
        width: 20,
        height: 20,
    },
    bottom: {
        paddingVertical: 12,
        flexDirection: "row",
        justifyContent: 'center',
        borderRadius: 50,
    }
});

export default UserAgreementOverlay;
