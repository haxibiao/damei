/*
 * @Author: Gaoxuan
 * @Date:   2019-07-18 11:20:13
 */
'use strict';
import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, Iconfont, Row, Button } from 'components';
import { Theme, PxFit, Config, SCREEN_WIDTH } from 'utils';

class ShareRule extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Text
                    style={{
                        color: Theme.theme,
                        fontSize: PxFit(20),
                        textAlign: 'center',
                        marginVertical: PxFit(5),
                    }}>
                    活动规则
                </Text>

                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: PxFit(5) }}>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>1</Text>
                        </View>
                        <Text style={styles.text}>
                            如何邀请收徒：您可以通过点击活动页面的邀请按钮，复制答口令分享给好友，邀请的好友复制答口令并成功下载注册APP，您将获得1元现金奖励（首次邀请再额外得1元奖励），同时您的好友登录后也将获得额外师徒福利0.2元。
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>2</Text>
                        </View>
                        <Text style={styles.text}>
                            如何获得徒弟提现分红：您邀请的好友成功提现，您还可再得20%提现分红，邀请越多奖励越多，上不封顶。
                            （举例：您邀请了10个好友，10个好友每个人提现了10元，那么平台至少会奖励您10X1+10X10X20%=30元现金奖励。）
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>3</Text>
                        </View>
                        <Text style={styles.text}>
                            唤醒老用户也可得奖励：邀请超过30天未登录的老用户同样也可获取奖励。
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>4</Text>
                        </View>
                        <Text style={styles.text}>
                            邀请规则：您邀请的好友必须是答题赚钱新用户才能邀请成功，即手机号/支付宝/QQ邮箱均未注册登录使用过答题赚钱APP，同一个手机号、同一个设备或同一个提现账号都视为一个用户，每个新用户（注册24小时内）只能被邀请一次，已经被他人邀请过的好友不能重复邀请。
                        </Text>
                    </View>
                    <View style={styles.item}>
                        <View style={styles.badge}>
                            <Text style={{ color: Theme.white }}>5</Text>
                        </View>
                        <Text style={styles.text}>
                            为了保证广大用户的收益不被影响，对于非正常邀请行为的用户（如刷机等违规手段），答题赚钱官方有权取消其参与分享活动的资格，并扣除奖励不予结算。
                        </Text>
                    </View>
                </ScrollView>
                <Button title={'知道了'} onPress={() => this.props.hide()} style={styles.buttonText} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH - PxFit(70),
        height: ((SCREEN_WIDTH - PxFit(110)) * 1000) / 618,
        paddingHorizontal: PxFit(25),
        paddingVertical: PxFit(20),
        borderRadius: PxFit(15),
        backgroundColor: '#fff',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    badge: {
        height: 18,
        width: 18,
        borderRadius: 9,
        backgroundColor: Theme.theme,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
    },
    text: {
        width: SCREEN_WIDTH - PxFit(146),
        marginLeft: 8,
        paddingVertical: PxFit(2),
        lineHeight: PxFit(18),
        fontSize: PxFit(13),
        color: Theme.subTextColor,
    },
    buttonText: {
        height: PxFit(38),
        borderRadius: PxFit(19),
        marginTop: PxFit(10),
        backgroundColor: Theme.primaryColor,
    },
});

export default ShareRule;
