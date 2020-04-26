import React, { Component, useState, useMemo, useCallback, useRef } from 'react';
import { Platform, StyleSheet, View, Text, ImageBackground, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import { PageContainer, TouchFeedback, } from 'components';

import { Theme, PxFit, ISAndroid, Tools, Config, ISIOS } from 'utils';

import NotLogin from './components/NotLogin';
import RuleDescription from './components/RuleDescription';

import { Overlay } from 'teaset';
import { app, observer } from 'store';
import { ad, config } from 'native';
import { syncGetter } from 'common';
import { GQL, useMutation, useQuery } from 'apollo';

import { Page } from "../../widgets";
import { Center, SafeText } from '../../components';
import Row from '../../components/Container/Row';
import { LoneAnonymousOperation } from 'graphql/validation/rules/LoneAnonymousOperation';
import LinearGradient from 'react-native-linear-gradient';

import { DataCenter } from "../../data";

const WithdrawalPlatforms = Platform.OS === 'android' ? [
    {
        type: 'alipay',
        name: '支付宝',
        icon: require('@src/assets/images/alipay.png'),
    },
    {
        type: 'datizhuanqian',
        name: '答题赚钱',
        icon: require('@src/assets/images/datizhuanqian.png'),
    },
    {
        type: 'dongdezhuan',
        name: '懂得赚',
        icon: require('@src/assets/images/dongdezhuan.png'),
    },
    {
        type: 'wechat',
        name: '微信',
        icon: require('@src/assets/images/wechat_radio.png')
    }
] : [
        {
            type: 'alipay',
            name: '支付宝',
            icon: require('@src/assets/images/alipay.png'),
        },
    ];


const { height, width } = Dimensions.get('window');


const index = (props: any) => {
    const { navigation } = props;
    const me = DataCenter.User.me;

    const [amount, setAmount] = useState(0);
    const [withdrawType, setWithdrawType] = useState('alipay');
    const [description, setDescription] = useState('');

    const withdrawInfo = [];
    const [withdrawRequest, { error, data: withdrawData, loading }] = useMutation(GQL.CreateWithdrawMutation, {
        variables: {
            amount: amount,
            platform: withdrawType,
        },
        errorPolicy: 'all',
        refetchQueries: (): any[] => [
            {
                query: GQL.WithdrawsQuery,
            },
            {
                query: GQL.UserMeansQuery,
                variables: { id: me.id },
            },
        ],
    });

    const walletAdapterData = useRef({
        id: null,
        pay_account: '',
        real_name: '',
        balance: 0,
    }).current;

    const { data: UserMeans } = useQuery(GQL.UserMeansQuery, {
        fetchPolicy: 'network-only',
        variables: {
            id: me.id,
        },
        skip: !me.id,
    });

    const user = useMemo(() => {
        const userData = syncGetter('user', UserMeans) || { withdrawInfo };
        return Object.assign({}, me, { withdrawInfo, ...userData });
    }, [me, UserMeans]);

    const myWallet = useMemo(() => user.wallet || walletAdapterData, [user, walletAdapterData]);

    const selectionAmount = useCallback(option => {
        setAmount(option.amount);
        setDescription(option.description);
    }, []);


    const renderBindTips = () => {
        // console.log('renderBindTips  user :', user);

        if (withdrawType === 'alipay' && Tools.syncGetter('wallet.pay_account', me)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'wechat' && Tools.syncGetter('is_bind_wechat', me)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'dongdezhuan') {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'datizhuanqian') {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}>{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }


        let platformName = withdrawType == 'wechat' ? '微信' : '支付宝';
        let bindPlatform = () => {
            navigation.navigate('ModifyAliPay');
        };

        return (
            <TouchableOpacity onPress={navigationAction}>
                <Row>
                    <Text style={styles.bindPlatform}>{`去绑定${platformName}`}</Text>
                </Row>
            </TouchableOpacity>
        );
    };

    const navigationAction = () => {
        navigation.navigate('AccountSecurity', { me });
    };


    const WisdomValue = observer(() =>
        <Text style={styles.cardItemBoldNum}>{me.gold}</Text>);
    const Balance = observer(() =>
        <Text style={styles.cardItemBoldNum}>{me.wallet?.available_balance || 0}</Text>);
    const Contribution = observer(() =>
        <Text style={{ fontWeight: "bold" }}>{me.profile?.total_contributes}</Text>);

    return (
        <Page.PageCleared
            fixed
            centerTitle={"提现"}
            enableBack
            rightWidget={
                <TouchableOpacity style={{ paddingRight: 10 }}>
                    <Text > 规则说明 </Text>
                </TouchableOpacity>
            }>
            <ScrollView >
                <View style={styles.statistics}>
                    <LinearGradient
                        start={{ x: 0.0, y: 0.5 }}
                        end={{ x: 1.0, y: 0.5 }}
                        locations={[0.1, 1]}
                        style={[styles.linearGradient, {
                            borderBottomLeftRadius: 40,
                            borderBottomRightRadius: 40,
                        }]}
                        colors={['#FDE9D0', '#FCB69F']}
                    />
                    <View style={styles.main}>
                        <LinearGradient
                            start={{ x: 0.0, y: 0.5 }}
                            end={{ x: 1.0, y: 0.5 }}
                            locations={[0.1, 1]}
                            style={styles.linearGradient}
                            colors={['#F0C068', '#F6A87B']}
                        />

                        <View style={styles.currentGold}>
                            <View style={styles.cardItem}>
                                <View>
                                    <Text style={styles.cardItemBoldText}>当前智慧点:</Text>
                                    <WisdomValue />
                                </View>
                                <View style={{ alignItems: "flex-end" }} >
                                    <Text style={styles.cardItemBoldText}>余额(元)</Text>
                                    <Balance />
                                </View>

                            </View>
                            <View style={styles.cardItem}>
                                <View style={styles.withdrawLimit}>
                                    <Image source={require("../../assets/images/wisdom.png")}
                                        style={styles.withdrawLimitImg} />
                                    <Text>600智慧点/1元</Text>
                                </View>
                                <Text>总贡献值：
                                < Contribution />
                                </Text>

                            </View>
                        </View>
                    </View>
                </View>

                <View style={styles.withdrawTop}>
                    <View style={styles.withdrawTitle}>
                        <Text>提现到</Text>
                        {renderBindTips()}
                    </View>
                    <View>
                        <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {
                                WithdrawalPlatforms.map((data, index) => {
                                    return (
                                        <TouchFeedback key={index} style={[styles.withdrawType, withdrawType === data.type && { borderColor: Theme.primaryColor },]}
                                            onPress={() => {
                                                setWithdrawType(data.type);
                                            }}>
                                            <Image source={data.icon} style={styles.withdrawTypeText} />
                                            <Text>{data.name}</Text>
                                        </TouchFeedback>
                                    );
                                })
                            }
                        </Row>
                    </View>
                </View>

                <View style={{ paddingTop: 20, paddingHorizontal: 20 }}>
                    <View style={styles.withdrawTitle}>
                        <Text>提现金额</Text>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Image source={require("../../assets/images/bill.png")} style={{ width: 16, height: 16, marginRight: 5 }} />
                            <Text style={{ color: "#3E9AF8" }} >账单记录</Text>
                        </View>
                    </View>
                    <View style={{ flexWrap: 'wrap', justifyContent: 'space-between', flexDirection: "row" }}>
                        {
                            user.withdrawInfo.map((option, index) => {
                                const selected = option.amount === amount;
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.valueItem,
                                            selected && styles.selectedItem,

                                        ]}
                                        onPress={() => selectionAmount(option)}>
                                        <Text>
                                            ¥{option.amount}.00元
                                    </Text>
                                    </TouchableOpacity>
                                );
                            })
                        }

                    </View>
                </View>

                {
                    <View style={{
                        backgroundColor: "#F6F6F6", borderRadius: 10,
                        paddingHorizontal: 10, paddingVertical: 10,
                        marginHorizontal: 30,
                        marginVertical: 20
                    }}>
                        <Text>
                            一元提现说明：

                        </Text>
                        <Text style={styles.ruleText}>一元提现是新人专享福利，每个账户仅线索一次</Text>
                    </View>
                }
                <View style={styles.rule}>
                    <Text style={[styles.ruleText, styles.ruleTitle]}>提现说明</Text>
                    <Text style={styles.ruleText}>1.只有当您绑定支付宝账号之后，才能开始提现。</Text>
                    <Text style={styles.ruleText}>
                        2.一个人名下只能绑定一个支付宝提现，同一人使用多个账号提现系统将判定涉嫌恶意刷取智慧点，
                        {Config.AppName}官方有权限制提现功能。
                    </Text>
                    <Text style={styles.ruleText}>
                        3.每天凌晨00:00-08：00期间，系统会将您账户中所有智慧点自动转换为余额。
                    </Text>
                    <Text style={styles.ruleText}>
                        4.提现金额分为1元、3元、5元、10元四档，每次提现时会扣除余额，剩余余额可以在下次满足最低提现额度时申请提现。
                    </Text>
                    <Text style={styles.ruleText}>5.提现一般3~5天内到账(如遇提现高峰，提现到账时间会延长)。</Text>
                </View>

            </ScrollView>

            <View style={styles.fixWithdrawBtn}>
                <TouchableOpacity style={{
                    backgroundColor: "#B8B4B4", paddingVertical: 10,
                    paddingHorizontal: 80, borderRadius: 25,
                }}>
                    <Text style={[styles.withdrawBtnText, amount <= 0 && { backgroundColor: Theme.subTextColor }]}>立即提现</Text>
                </TouchableOpacity>

            </View>
        </Page.PageCleared >
    );
};

const styles = StyleSheet.create({

    cardItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    cardItemBoldText: {
        fontWeight: "bold",
        fontSize: 20
    },
    cardItemBoldNum: {
        fontWeight: "bold",
        fontSize: 24
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        backgroundColor: Theme.groundColour,
        flexGrow: 1,
        paddingBottom: PxFit(Theme.itemSpace),
    },
    currentGold: {
        paddingHorizontal: 20,
        paddingVertical: 25,
        height: '100%',
        width: '100%',
        justifyContent: 'space-between'
    },
    diamond: {
        height: PxFit(22),
        marginRight: PxFit(2),
        width: PxFit(20),
    },
    fixWithdrawBtn: {
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        marginTop: height * 0.9,
        width: width,
    },
    moneyText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    rule: {
        borderRadius: PxFit(15),
        marginHorizontal: 20,
        padding: 10,
        backgroundColor: "#f6f6f6",
    },
    ruleText: {
        color: Theme.subTextColor,
        fontSize: PxFit(14),
        lineHeight: PxFit(18),
        paddingVertical: PxFit(5),
    },
    ruleTitle: {
        color: Theme.defaultTextColor,
        fontWeight: 'bold',
    },
    selectedItem: {
        backgroundColor: "#FDF392",
        // borderColor: Theme.primaryColor,
    },
    statistics: {
        width: width,
        height: 180,
        alignItems: 'center',
    },
    linearGradient: {
        flex: 1,
        height: '100%',
        width: '100%',
        position: 'absolute',
        zIndex: -1
    },
    main: {
        width: width * 0.8,
        height: width * 0.45,
        justifyContent: "space-between",
        borderRadius: 25,
        overflow: 'hidden',
        marginTop: 100,
        elevation: 10
    },
    valueItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: Theme.slateGray2,
        borderRadius: 15,
        borderWidth: PxFit(1),
        height: PxFit(56),
        justifyContent: 'center',
        marginBottom: PxFit(Theme.itemSpace),
        width: (width - PxFit(Theme.itemSpace + 14) * 3) / 2,
    },
    withdrawBtn: {
        alignItems: 'center',
        backgroundColor: Theme.primaryColor,
        borderRadius: PxFit(5),
        height: PxFit(44),
        justifyContent: 'center',
    },
    withdrawBtnText: {
        color: '#fff',
        fontSize: PxFit(15),
    },
    withdrawDescription: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(14),
        fontWeight: 'bold',
        marginBottom: PxFit(5),
    },
    withdrawLimit: {
        flexDirection: "row",
        alignItems: "center"
    },
    withdrawLimitImg: {
        width: 16,
        height: 16,
        marginRight: 5
    },

    withdrawOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    withdrawOptionsWrap: {
        marginBottom: PxFit(Theme.itemSpace),
        marginHorizontal: PxFit(Theme.itemSpace),
    },
    withdrawRule: {
        backgroundColor: Theme.groundColour,
        borderRadius: PxFit(5),
        padding: PxFit(Theme.itemSpace),
    },
    withdrawRuleText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(13),
    },
    withdrawTop: {
        paddingTop: 110,
        paddingHorizontal: 20
    },
    withdrawTitle: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 10
    },
    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PxFit(10),
        width: (width - 80) / 2,
        height: PxFit(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: PxFit(0.5),
        borderRadius: PxFit(15),

    },
    withdrawNum: {

    },
    withdrawTypeText: {
        width: PxFit(24),
        height: PxFit(24),
        marginRight: PxFit(5),
    },
    bindPlatform: {
        color: Theme.link,
        fontSize: PxFit(14),
        textDecorationLine: 'underline',
    },


});

export default index;