import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Image } from 'react-native';
import { TouchFeedback, Avatar, Iconfont } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools } from 'utils';
import { app } from 'store';

const Invite = props => {
    const { resolveInvitation } = props;
    return (
        <View style={styles.container}>
            <TouchFeedback
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}
                onPress={() => props.hide()}>
                <Iconfont name={'close'} size={16} color={Theme.grey} />
            </TouchFeedback>
            <View style={{ alignItems: 'center' }}>
                <View style={{ marginBottom: PxFit(20), alignItems: 'center' }}>
                    {/*  <Avatar source={app.me.avatar} size={PxFit(68)} />
                    <Text style={{ marginTop: PxFit(10) }}>璇</Text> */}
                    <Image
                        source={require('@src/assets/images/invitation_icon.png')}
                        style={{ width: SCREEN_WIDTH / 2, height: ((SCREEN_WIDTH / 2) * 323) / 412 }}
                    />
                </View>
                <Text style={{ color: Theme.black, lineHeight: PxFit(22), textAlign: 'center' }}>
                    恭喜您成功领取
                    <Text
                        style={{ color: Theme.themeRed }}
                        onPress={() => {
                            Tools.navigate('User', {
                                user: resolveInvitation.user,
                            });
                            props.hide();
                        }}>
                        *{resolveInvitation.user.name}*
                    </Text>
                    的新人邀请奖励
                </Text>
                <View style={{ flexDirection: 'row', marginBottom: PxFit(10) }}>
                    <Text style={{ fontSize: PxFit(50), color: Theme.secondaryColor }}>
                        {resolveInvitation.be_inviter_reward}
                    </Text>
                    <Text
                        style={{
                            fontSize: PxFit(12),
                            color: Theme.black,
                            paddingTop: PxFit(35),
                        }}>
                        {`  ${resolveInvitation.be_inviter_reward_unit}`}
                    </Text>
                </View>
                <Text style={{ color: Theme.grey, fontSize: PxFit(12), textAlign: 'center' }}>
                    邀请好友可领更多现金大礼包哦！
                </Text>
            </View>
            <TouchFeedback
                style={styles.buttonImage}
                onPress={() => {
                    props.hide();
                    Tools.navigate('Share');
                }}>
                <ImageBackground source={require('@src/assets/images/share_guide_button.png')} style={styles.button}>
                    <Text style={styles.buttonText}>立即邀请</Text>
                </ImageBackground>
            </TouchFeedback>
            {/*    <TouchFeedback style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: PxFit(12), color: Theme.grey }}>去提现</Text>
            </TouchFeedback> */}
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
    buttonImage: {
        marginTop: PxFit(20),
        marginBottom: PxFit(5),
        alignItems: 'center',
    },
    button: {
        width: SCREEN_WIDTH - PxFit(120),
        height: ((SCREEN_WIDTH - PxFit(120)) * 131) / 722,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: Theme.white,
        fontSize: PxFit(15),
    },
});

export default Invite;
