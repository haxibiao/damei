import React, { useCallback, useState, useRef, useMemo, useEffect, Fragment } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    ImageBackground,
    TouchableOpacity,
    Animated,
    Platform,
} from 'react-native';
import { Button, Iconfont, SubmitLoading, Row, SafeText, TouchFeedback } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, Tools, Config, ISIOS } from 'utils';
import { GQL, useMutation, useQuery } from 'apollo';
import { syncGetter } from 'common';
import { app, observer } from 'store';
import { useNavigation } from '@react-navigation/native';
import DongdezhuanIntro from './DongdezhuanIntro';
import DatizhuanqianIntro from './DatizhuanqianIntro';
import { AppUtil } from 'native';

const GOLD_IMAGE_BG = SCREEN_WIDTH - PxFit(Theme.itemSpace * 2);
const withdrawInfo = [];

const WithdrawalPlatforms =
    Platform.OS === 'android'
        ? [
              {
                  type: 'wechat',
                  name: '微信',
                  icon: require('@src/assets/images/wechat_radio.png'),
              },
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
          ]
        : [
              {
                  type: 'alipay',
                  name: '支付宝',
                  icon: require('@src/assets/images/alipay.png'),
              },
          ];

export default observer(() => {
    const { me } = app;
    const navigation = useNavigation();
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [withdrawType, setWithdrawType] = useState(ISIOS ? 'alipay' : 'wechat');
    const [installDDZ, setInstallDDZ] = useState(false);
    const [installDTZQ, setInstallDTZQ] = useState(false);
    const walletAdapterData = useRef({
        id: null,
        pay_account: '',
        real_name: '',
        balance: 0,
    }).current;
    const { data: UserMeans, error: UserWithdrawError } = useQuery(GQL.UserWalletQuery, {
        variables: {
            id: me.id,
        },
        client: app.newClient,
        fetchPolicy: 'network-only',
    });

    const user = useMemo(() => {
        const userData = syncGetter('user', UserMeans) || { withdrawInfo };
        return Object.assign({}, me, { withdrawInfo, ...userData });
    }, [me, UserMeans]);

    const myWallet = useMemo(() => user.wallet || walletAdapterData, [user, walletAdapterData]);

    const exchangeRate = useMemo(() => user.exchange_rate || 600, [user]);

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
                variables: { id: user.id },
            },
        ],
    });

    const selectionAmount = useCallback((option) => {
        setAmount(option.amount);
        setDescription(option.description);
    }, []);

    const handleWithdraws = (value) => {
        if (myWallet.balance < value) {
            Toast.show({ content: `您的提现余额不足` });
        } else {
            // DongdezhuanIntro.show();
            checkWithdrawType();
        }
    };

    const CheckApkExist = useCallback(() => {
        AppUtil.CheckApkExist('com.dongdezhuan', (data: any) => {
            if (data) {
                setInstallDDZ(true);
            }
        });
        AppUtil.CheckApkExist('com.datizhuanqian', (data: any) => {
            if (data) {
                setInstallDTZQ(true);
            }
        });
    }, []);

    const checkWithdrawType = () => {
        if (withdrawType === 'dongdezhuan' && !installDDZ) {
            DongdezhuanIntro.show();
        } else if (withdrawType === 'datizhuanqian' && !installDTZQ) {
            DatizhuanqianIntro.show();
        } else {
            withdrawRequest();
        }
    };

    useEffect(() => {
        if (Platform.OS == 'android') CheckApkExist();
    }, []);

    useEffect(() => {
        console.log('提现请求结果: ', withdrawData);
        if (withdrawData) {
            navigation.navigate('WithdrawApply', {
                amount,
            });
        }
    }, [withdrawData, amount, navigation]);

    useEffect(() => {
        console.log('提现请求错误: ', error);
        if (error) {
            Toast.show({ content: String(error).replace('Error: GraphQL error: ', '') || '提现失败' });
        }
    }, [error, navigation]);

    const renderBindTips = () => {
        console.log('renderBindTips  user :', user);

        if (withdrawType === 'alipay' && Tools.syncGetter('wallet.pay_account', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}
                    >{`已绑定`}</Text>
                </TouchableOpacity>
            );
        }
        if (withdrawType === 'wechat' && Tools.syncGetter('is_bind_wechat', user)) {
            return (
                <TouchableOpacity onPress={navigationAction}>
                    <Text
                        style={{
                            color: '#363636',
                            fontSize: PxFit(14),
                            textDecorationLine: 'underline',
                        }}
                    >{`已绑定`}</Text>
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
                        }}
                    >{`已绑定`}</Text>
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
                        }}
                    >{`已绑定`}</Text>
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
                    <Image source={require('@src/assets/images/broad_tips.png')} style={styles.broadTipsImage} />
                    <Text style={styles.bindPlatform}>{`去绑定${platformName}`}</Text>
                </Row>
            </TouchableOpacity>
        );
    };

    const navigationAction = () => {
        navigation.navigate('AccountSecurity', { user });
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.main}>
                    <View style={styles.statistics}>
                        <ImageBackground
                            source={require('../../../assets/images/yellow_bg.png')}
                            style={styles.goldImage}
                        >
                            <View style={styles.currentGold}>
                                <View style={styles.cardItem}>
                                    <View>
                                        <Text style={styles.blackText}>当前智慧点:</Text>
                                        <SafeText style={styles.boldBlackText}>
                                            {Tools.NumberFormat(user.gold) || 0}
                                        </SafeText>
                                    </View>
                                    <View>
                                        <SafeText style={styles.blackText}>余额(元)</SafeText>
                                        <SafeText style={styles.boldBlackText}>
                                            {myWallet.available_balance || 0}
                                        </SafeText>
                                    </View>
                                </View>
                                <View style={styles.cardItem}>
                                    <View style={styles.withdrawLimit}>
                                        <Iconfont name='tixian' size={PxFit(17)} color={Theme.defaultTextColor} />
                                        <SafeText style={styles.blackText2}>{` ${exchangeRate}智慧点/1元`}</SafeText>
                                    </View>
                                    <View style={styles.withdrawLimit}>
                                        <SafeText style={styles.blackText2}>总贡献值：</SafeText>
                                        <SafeText style={styles.boldBlackText2}>
                                            {user.profile.total_contributes || 0}
                                        </SafeText>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>
                    <View style={styles.withdrawTop}>
                        <Text style={styles.withdrawTitle}>提现到</Text>
                        {renderBindTips()}
                    </View>
                    <View style={{ paddingHorizontal: PxFit(Theme.itemSpace) }}>
                        <Row style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            {WithdrawalPlatforms.map((data, index) => {
                                return (
                                    <Fragment key={index}>
                                        <TouchFeedback
                                            style={[
                                                styles.withdrawType,
                                                withdrawType === data.type && { borderColor: Theme.primaryColor },
                                            ]}
                                            onPress={() => {
                                                setWithdrawType(data.type);
                                            }}
                                        >
                                            <Image source={data.icon} style={styles.withdrawTypeText} />
                                            <Text>{data.name}</Text>
                                        </TouchFeedback>
                                    </Fragment>
                                );
                            })}
                        </Row>
                    </View>
                    <View style={styles.withdrawTop}>
                        <Text style={styles.withdrawTitle}>提现金额</Text>
                        <Row>
                            <Iconfont
                                name='book'
                                size={PxFit(16)}
                                color={Theme.linkColor}
                                style={{ marginRight: PxFit(4), marginBottom: PxFit(1) }}
                            />
                            <Text style={styles.bindAiLiPay} onPress={() => navigation.navigate('BillingRecord')}>
                                账单记录
                            </Text>
                        </Row>
                    </View>

                    <View style={styles.withdrawOptionsWrap}>
                        <View style={styles.withdrawOptions}>
                            {user.withdrawInfo.map((option, index) => {
                                const selected = option.amount === amount;
                                return (
                                    <TouchableOpacity
                                        style={[
                                            styles.valueItem,
                                            selected && styles.selectedItem,
                                            (index + 1) % 2 === 0 && {
                                                marginLeft: PxFit(Theme.itemSpace),
                                            },
                                        ]}
                                        key={index}
                                        onPress={() => selectionAmount(option)}
                                    >
                                        <SafeText
                                            style={[
                                                styles.moneyText,
                                                selected && {
                                                    color: Theme.primaryColor,
                                                },
                                            ]}
                                        >
                                            ¥{option.amount} 元
                                        </SafeText>
                                        <View
                                            style={[
                                                styles.badge,
                                                {
                                                    backgroundColor: option.disable ? Theme.grey : Theme.theme,
                                                },
                                            ]}
                                        >
                                            <Text style={styles.badgeText}>{option.tips}</Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                        {!!description && (
                            <View style={styles.withdrawRule}>
                                <View style={styles.arrow} />
                                <Text style={styles.withdrawDescription}>{amount}元提现说明:</Text>
                                <Text style={styles.withdrawRuleText}>{description}</Text>
                            </View>
                        )}
                    </View>
                </View>
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
                    <Text style={styles.ruleText}>5.每档提现额度一个月只能用1次。</Text>

                    <Text style={styles.ruleText}>6.提现一般3~5天内到账(如遇提现高峰，提现到账时间会延长)。</Text>
                </View>
                <SubmitLoading isVisible={loading} content={'加载中...'} />
            </ScrollView>
            <View style={styles.fixWithdrawBtn}>
                <TouchableOpacity
                    disabled={amount <= 0}
                    onPress={handleWithdraws}
                    style={[styles.withdrawBtn, amount <= 0 && { backgroundColor: Theme.subTextColor }]}
                >
                    <Text style={styles.withdrawBtnText}>立即提现</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    arrow: {
        backgroundColor: Theme.groundColour,
        height: PxFit(16),
        left: '50%',
        position: 'absolute',
        right: 0,
        top: -PxFit(8),
        transform: [{ rotateZ: '45deg' }, { translateX: PxFit(8) }],
        width: PxFit(16),
    },
    bindAiLiPay: {
        color: Theme.linkColor,
        fontSize: PxFit(14),
        textDecorationLine: 'underline',
    },
    blackText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(14),
        fontWeight: 'bold',
    },
    blackText2: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(14),
    },
    boldBlackText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(30),
        fontWeight: 'bold',
    },
    boldBlackText2: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    broadTipsImage: {
        height: PxFit(16),
        marginRight: PxFit(5),
        width: PxFit(16),
    },
    cardItem: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        flex: 1,
        justifyContent: 'space-between',
        padding: PxFit(Theme.itemSpace),
    },
    diamond: {
        height: PxFit(22),
        marginRight: PxFit(2),
        width: PxFit(20),
    },
    fixWithdrawBtn: {
        backgroundColor: '#fff',
        paddingBottom: PxFit(Theme.itemSpace) + Theme.HOME_INDICATOR_HEIGHT,
        paddingHorizontal: PxFit(Theme.itemSpace * 2),
        paddingTop: PxFit(Theme.itemSpace),
    },
    goldImage: {
        borderRadius: PxFit(10),
        height: GOLD_IMAGE_BG * 0.4,
        overflow: 'hidden',
        resizeMode: 'contain',
        width: GOLD_IMAGE_BG,
    },
    main: {
        backgroundColor: '#fff',
    },
    moneyText: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    rule: {
        borderRadius: PxFit(15),
        margin: PxFit(Theme.itemSpace),
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
        backgroundColor: `rgba(${Theme.primaryColorRgb},0.1)`,
        borderColor: Theme.primaryColor,
    },
    statistics: {
        margin: PxFit(Theme.itemSpace),
    },
    valueItem: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: Theme.slateGray2,
        borderRadius: PxFit(5),
        borderWidth: PxFit(1),
        height: PxFit(56),
        justifyContent: 'center',
        marginBottom: PxFit(Theme.itemSpace),
        width: (SCREEN_WIDTH - PxFit(Theme.itemSpace) * 3) / 2,
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
        alignItems: 'center',
        borderRadius: PxFit(14),
        flexDirection: 'row',
        height: PxFit(28),
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
    withdrawTitle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(16),
        fontWeight: 'bold',
    },
    withdrawTop: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: PxFit(Theme.itemSpace),
    },
    withdrawType: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PxFit(10),
        width: (SCREEN_WIDTH - 40) / 2,
        height: PxFit(50),
        justifyContent: 'center',
        borderColor: Theme.borderColor,
        borderWidth: PxFit(0.5),
        borderRadius: PxFit(5),
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
    badge: {
        alignItems: 'center',
        borderBottomRightRadius: PxFit(9),
        borderTopLeftRadius: PxFit(4),
        borderTopRightRadius: PxFit(9),
        height: 18,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        top: 0,
        width: PxFit(50),
    },
    badgeText: {
        color: '#FFF',
        fontSize: PxFit(11),
        fontWeight: '500',
    },
});
