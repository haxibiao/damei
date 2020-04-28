import React, { Fragment } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';

import Button from '../TouchableView/Button';

import Theme from '../../utils/Theme';
import { PxFit } from '../../utils/Scale';
import Tools from '../../utils/Tools';

import { Overlay } from 'teaset';
import { ad } from 'native';
import { playVideo } from '../../common/ttad/playVideo';
import { Iconfont, TouchFeedback } from '..';

import { DataCenter, observer } from '../../data';

const { height, width } = Dimensions.get('window');
const SCREEN_WIDTH = width;
const SCREEN_HEIGHT = height;

//FIXME: 重构1 import 需要全部走package,不走path，全部补充types.d.ts

interface Reward {
    gold: Number;
    ticket?: Number;
    contribute?: Number;
    rmb?: Number;
}

interface Props {
    reward: Reward;
    title: string;
    rewardVideo: boolean;
    type: 'Any';
}
let key:any = null;
const Content = observer((props:any) => {
    const { reward, title, rewardVideo, type } = props.props;
    const body = reward.gold && (reward.ticket || reward.contribute) ? '同时奖励' : '领取奖励成功';
    return (
        <View style={styles.container}>
                    <View style={styles.content}>
                        <TouchFeedback
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                paddingRight: PxFit(10),
                                paddingTop: PxFit(10),
                            }}
                            onPress={() => props.hide()}>
                            <Iconfont name={'close'} size={16} color={Theme.grey} />
                        </TouchFeedback>
                        <View style={styles.header}>
                            <Image source={require('../../assets/images/money_old.png')} style={styles.headerImage} />

                            <View style={{ marginLeft: PxFit(15) }}>
                                {reward.gold && (
                                    <Text style={styles.title}>
                                        恭喜获得<Text style={{ color: Theme.themeRed }}>{reward.gold}智慧点</Text>
                                    </Text>
                                )}
                                {!reward.gold && reward.ticket && (
                                    <Text style={styles.title}>
                                        恭喜获得<Text style={{ color: Theme.themeRed }}>{reward.ticket}精力点</Text>
                                    </Text>
                                )}
                                {reward.rmb && (
                                    <Text style={styles.title}>
                                        恭喜获得<Text style={{ color: Theme.themeRed }}>{reward.rmb}元</Text>
                                    </Text>
                                )}

                                <View style={styles.rewardContainer}>
                                    <Text style={{ color: Theme.grey }}>{title ? title : body}</Text>
                                    {reward.ticket && reward.gold ? (
                                        <Fragment>
                                            <Image
                                                source={require('../../assets/images/heart.png')}
                                                style={styles.ticketImage}
                                            />
                                            <Text>+{reward.ticket}</Text>
                                        </Fragment>
                                    ) : null}
                                    {reward.contribute ? (
                                        <Fragment>
                                            <Image
                                                source={require('../../assets/images/gongxian.png')}
                                                style={styles.contributeImage}
                                            />
                                            <Text>+{reward.contribute}</Text>
                                        </Fragment>
                                    ) : null}
                                </View>
                            </View>
                        </View>

                        <View>
                            <ad.FeedAd adWidth={SCREEN_WIDTH - PxFit(40)} />
                        </View>
                        <Button
                            title={'立即查看'}
                            onPress={() => {
                                props.hide();
                                if (rewardVideo) {
                                    if (DataCenter.navigation) DataCenter.navigation.navigate('BillingRecord', { initialPage: 1 });
                                    // Tools.navigate('BillingRecord', { initialPage: 1 });
                                } else {
                                    playVideo({ type });
                                }
                            }}
                            FontSize={14}
                            textColor={Theme.themeRed}
                            style={styles.buttonStyle}
                        />
                    </View>
                </View>
    )
});

const show = (props:any) => {
    const view = (
        <Overlay.View animated>
            <Content props={props} hide={hide}/>
        </Overlay.View>
    );
    key = Overlay.show(view);
}

const hide = () => {
    Overlay.hide(key);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: 'rgba(255,255,255,0)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerImage: {
        width: 62,
        height: 62,
    },
    rewardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    content: {
        width: SCREEN_WIDTH - PxFit(40),
        borderRadius: PxFit(10),
        backgroundColor: Theme.white,
        padding: 0,
        // alignItems: 'center',
    },
    ticketImage: {
        width: 19,
        height: 19,
        marginLeft: 3,
        marginRight: 2,
    },
    contributeImage: {
        width: 15,
        height: 15,
        marginLeft: 3,
        paddingTop: 2,
        marginRight: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: PxFit(20),
        marginBottom: PxFit(5),
    },
    headerText: {
        color: Theme.grey,
        fontSize: PxFit(13),
        textAlign: 'center',
        paddingTop: PxFit(3),
    },
    center: {
        paddingTop: PxFit(15),
        paddingBottom: PxFit(20),
        paddingHorizontal: PxFit(20),
    },
    centerTitle: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        paddingTop: PxFit(10),
        lineHeight: PxFit(22),
    },
    centerInfo: {
        fontSize: PxFit(14),
        color: Theme.primaryFont,
        lineHeight: PxFit(22),
    },
    title: {
        fontSize: PxFit(18),
        color: Theme.black,
        fontWeight: '600',
    },
    buttonStyle: {
        height: PxFit(42),
        borderRadius: PxFit(21),
        marginTop: PxFit(10),
        marginBottom: PxFit(20),
        marginHorizontal: PxFit(60),
        backgroundColor: Theme.white,
        borderColor: 'rgba(239,81,74,0.4)',
        borderWidth: 1,
        // backgroundColor: Theme.primaryColor,
    },
    modalFooter: {
        borderTopWidth: PxFit(0.5),
        borderTopColor: Theme.tintGray,
        flexDirection: 'row',
        marginTop: PxFit(15),
    },
    operation: {
        paddingVertical: PxFit(15),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    operationText: {
        fontSize: PxFit(15),
        fontWeight: '400',
        color: Theme.grey,
    },
});

export {show,hide};
