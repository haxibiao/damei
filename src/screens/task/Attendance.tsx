import React, { useMemo, useCallback, useRef, useState } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { PageContainer, NavigatorBar } from 'components';
import { Theme, PxFit, SCREEN_WIDTH, NAVBAR_HEIGHT, Tools } from 'utils';
import { GQL, useMutation, useQuery, useApolloClient } from 'apollo';
import { exceptionCapture } from '@src/common';
import { app } from 'store';
import { Overlay } from 'teaset';
import SignedReturn from './components/SignedReturn';
import { useNavigation } from 'react-navigation-hooks';
import { BoxShadow } from 'react-native-shadow';

interface Sign {
    id: any;
    created_at: string;
    day: string | number;
    month: string | number;
    year: string | number;
    gold_reward: number;
    withdraw_lines: number;
    signed: boolean;
}

interface SignInReturns {
    id: any;
    gold_reward: string | number;
    contribute_reward: string | number;
}

export default (props): JSX.Element => {
    const navigation = useNavigation();
    const client = useApolloClient();
    const overlayRef = useRef();
    const [boxShadowHeight, setBoxShadowHeight] = useState(150);

    const onLayoutEffect = useCallback(event => {
        setBoxShadowHeight(event.nativeEvent.layout.height);
    }, []);

    const { data } = useQuery(GQL.SignInsQuery, {
        variables: { days: app.config.max_signs_day },
    });

    const [createSignIn] = useMutation(GQL.CreateSignInMutation, {
        refetchQueries: (): array => [
            {
                query: GQL.SignInsQuery,
                variables: { days: app.config.max_signs_day },
            },
            {
                query: GQL.SignInsQuery,
            },
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    const signInData = useMemo(() => {
        return (
            Tools.syncGetter('signIns', data) || {
                today_signed: 0,
                keep_signin_days: 0,
                signs: Array(30).fill({
                    signed: false,
                    gold_reward: 10,
                }),
            }
        );
    }, [data]);

    const keep_signin_days = Tools.syncGetter('keep_signin_days', signInData);
    const today_signed = Tools.syncGetter('today_signed', signInData);
    const signIns = Tools.syncGetter('signs', signInData);

    const toDaySignIn = useCallback(
        Tools.throttle(async () => {
            if (!today_signed) {
                const [err, res] = await exceptionCapture(() => createSignIn());
                if (err) {
                    Toast.show({ content: err.replace('GraphQL error: ', '') || '签到失败' });
                    return;
                }
                const todayReturns = Tools.syncGetter('data.createSignIn', res);
                onSignInSuccess(todayReturns);
            } else {
                Toast.show({ content: '今天已经签到过了哦' });
            }
        }),
        [signIns, today_signed],
    );

    const onSignInSuccess = useCallback((returns: SignInReturns) => {
        Overlay.show(
            <Overlay.PopView
                style={{ alignItems: 'center', justifyContent: 'center' }}
                animated={true}
                ref={overlayRef}>
                <SignedReturn
                    gold={returns.gold_reward}
                    reward={returns.contribute_reward}
                    close={() => overlayRef.current.close()}
                    client={client}
                />
            </Overlay.PopView>,
        );
    }, []);

    return (
        <PageContainer hiddenNavBar contentViewStyle={styles.contentViewStyle} white>
            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                <Image style={styles.attendanceBg} source={require('@src/assets/images/attendance_bg.png')} />
                <View style={styles.header}>
                    <View style={styles.keepSignIn}>
                        <Text style={styles.signInText}>已坚持</Text>
                        <ImageBackground style={styles.calendar} source={require('@src/assets/images/calendar.png')}>
                            <Text style={styles.calendarText}>{Math.floor(keep_signin_days / 10)}</Text>
                        </ImageBackground>
                        <ImageBackground style={styles.calendar} source={require('@src/assets/images/calendar.png')}>
                            <Text style={styles.calendarText}>{keep_signin_days % 10}</Text>
                        </ImageBackground>
                        <Text style={styles.signInText}>天签到</Text>
                    </View>
                    <Text style={styles.miniText}>连续签到领取惊喜大礼</Text>
                </View>
                <BoxShadow
                    setting={Object.assign({}, shadowOpt, {
                        height: boxShadowHeight,
                    })}>
                    <View style={styles.attendanceBook} onLayout={onLayoutEffect}>
                        <TouchableWithoutFeedback onPress={toDaySignIn}>
                            <View style={styles.attendance}>
                                <View style={[styles.signItem, { width: signItemWidth }]} />
                                <View style={[styles.signItem, { width: signItemWidth }]} />
                                {signIns.map((elem, index) => {
                                    if (elem.is_gift) {
                                        return (
                                            <View style={styles.signItem} key={index}>
                                                {!elem.signed && (
                                                    <Image
                                                        style={styles.mysticGift}
                                                        source={require('@src/assets/images/mystic_gift.png')}
                                                    />
                                                )}
                                                <Image
                                                    style={styles.giftImage}
                                                    source={
                                                        elem.signed
                                                            ? require('@src/assets/images/open_gift.png')
                                                            : require('@src/assets/images/gift.png')
                                                    }
                                                />
                                                <Text style={styles.recordDayText}>
                                                    {elem.signed ? '已签' : `${index + 1}天`}
                                                </Text>
                                            </View>
                                        );
                                    }
                                    return (
                                        <View style={styles.signItem} key={index}>
                                            <ImageBackground
                                                style={styles.coinImage}
                                                source={
                                                    elem.signed
                                                        ? require('@src/assets/images/coin_grey.png')
                                                        : require('@src/assets/images/coin_yellow.png')
                                                }>
                                                <Text
                                                    style={[
                                                        styles.rewardGoldText,
                                                        elem.signed && { color: '#a0a0a0' },
                                                    ]}>
                                                    {elem.gold_reward || 0}
                                                </Text>
                                            </ImageBackground>
                                            <Text style={styles.recordDayText}>
                                                {elem.signed ? '已签' : `${index + 1}天`}
                                            </Text>
                                        </View>
                                    );
                                })}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </BoxShadow>

                <View style={styles.footer}>
                    <Text style={styles.ruleText}>签到规则</Text>
                    <Text style={styles.footerText}>1. 连续签到天数越多，可得奖励越高。</Text>
                    <Text style={styles.footerText}>2. 断签将回到第一天重新计算。</Text>
                    <Text style={styles.footerText}>3. 提现后，签到天数将重置。</Text>
                    <Text style={styles.footerText}>4. 签到超过{app.config.max_signs_day}天，签到数将自动清0。</Text>
                </View>
            </ScrollView>
            <View style={styles.navigatorWrap}>
                <NavigatorBar
                    navigation={navigation}
                    style={styles.navigatorBar}
                    titleStyle={styles.titleStyle}
                    title="签到详情"
                />
            </View>
        </PageContainer>
    );
};

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(Theme.itemSpace * 2),
    height: PxFit(200),
    color: '#FFB61D',
    border: PxFit(10),
    radius: PxFit(5),
    opacity: 0.1,
    x: 0,
    y: 0,
    style: {
        margin: PxFit(Theme.itemSpace),
    },
};

const signItemWidth = (SCREEN_WIDTH - PxFit(Theme.itemSpace * 2) - PxFit(10)) / 7;
const coinImageWidth = signItemWidth * 0.9;
const mysticGiftHeight = (coinImageWidth * 0.9 * 86) / 164;

const styles = StyleSheet.create({
    attendance: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: -1,
    },
    attendanceBg: {
        height: (SCREEN_WIDTH * 714) / 750,
        left: 0,
        position: 'absolute',
        top: 0,
        width: SCREEN_WIDTH,
    },
    attendanceBook: {
        backgroundColor: '#fff',
        borderRadius: PxFit(10),
        paddingBottom: mysticGiftHeight,
        paddingHorizontal: PxFit(5),
    },
    calendar: {
        alignItems: 'center',
        flexDirection: 'row',
        height: (PxFit(50) * 161) / 135,
        justifyContent: 'center',
        width: PxFit(50),
    },
    calendarText: {
        color: '#FFB92A',
        fontSize: PxFit(22),
        fontWeight: 'bold',
    },
    coinImage: {
        alignItems: 'center',
        height: coinImageWidth,
        justifyContent: 'center',
        width: coinImageWidth,
    },
    container: {
        flexGrow: 1,
        paddingBottom: Theme.HOME_INDICATOR_HEIGHT + PxFit(Theme.itemSpace) * 2,
    },
    contentViewStyle: { marginTop: 0 },
    footer: {
        marginHorizontal: PxFit(Theme.itemSpace),
        marginTop: PxFit(5),
    },
    footerText: {
        color: '#9E6124',
        fontSize: PxFit(15),
        marginVertical: PxFit(5),
    },
    giftImage: {
        height: coinImageWidth,
        width: coinImageWidth,
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: PxFit(NAVBAR_HEIGHT),
    },
    keepSignIn: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: PxFit(20),
    },
    miniText: {
        color: '#A16217',
        fontSize: PxFit(14),
        marginBottom: PxFit(10),
        marginTop: PxFit(15),
    },
    mysticGift: {
        alignItems: 'center',
        height: mysticGiftHeight,
        justifyContent: 'center',
        left: signItemWidth * 0.09,
        position: 'absolute',
        top: signItemWidth * 0.1,
        width: coinImageWidth * 0.9,
    },
    navigatorBar: {
        backgroundColor: 'transparent',
    },
    navigatorWrap: {
        ...StyleSheet.absoluteFill,
    },
    recordDayText: {
        color: Theme.secondaryTextColor,
        fontSize: PxFit(12),
    },
    rewardGoldText: {
        color: '#9F641A',
        fontSize: PxFit(11),
        fontWeight: 'bold',
        marginBottom: coinImageWidth * 0.07,
    },
    ruleText: {
        color: '#9E6124',
        fontSize: PxFit(15),
        fontWeight: 'bold',
    },
    signInText: {
        color: '#fff',
        fontSize: PxFit(17),
        marginHorizontal: PxFit(5),
    },
    signItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: PxFit(5),
        paddingHorizontal: signItemWidth * 0.05,
        paddingTop: mysticGiftHeight,
    },
    titleStyle: {
        fontWeight: 'bold',
    },
});
