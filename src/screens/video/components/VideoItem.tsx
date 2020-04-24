import React, { useState } from 'react';
import { StyleSheet, View, Text, Image,TouchableOpacity,Dimensions } from 'react-native';
import { PxFit, Theme, ISIOS, Tools } from 'utils';
import { TouchFeedback, Row, SafeText } from 'components';
import { ad } from 'native';

import { observer, app, config } from 'store';
import Player from './Player';
import SideBar from './SideBar';
import VideoStore from '../VideoStore';
import { GQL, useMutation } from 'apollo';
import { exceptionCapture } from 'common';
import { NavigationActions } from 'react-navigation';

const {width:sw,height:sh} = Dimensions.get('window');

export default observer(props => {
    const { media, index, navigation } = props;
    const [adShow, setAdShow] = useState(true);
    const isAskQuestion =
        Tools.syncGetter('question.form', media) === 2 && !Tools.syncGetter('question.is_resolved', media);

    const [onClickReward] = useMutation(GQL.UserRewardMutation, {
        variables: {
            reward: 'DRAW_FEED_ADVIDEO_REWARD',
        },
        refetchQueries: () => [
            {
                query: GQL.UserMetaQuery,
                variables: { id: app.me.id },
            },
        ],
    });

    const getReward = async (media: any) => {
        const drawFeedAdId = media.id.toString();

        if (VideoStore.getReward.indexOf(drawFeedAdId) === -1) {
            VideoStore.addGetRewardId(drawFeedAdId);
            //发放给精力奖励
            const [error, res] = await exceptionCapture(onClickReward);
            if (error) {
                Toast.show({
                    content: '遇到未知错误，领取失败',
                });
            } else {
                const contribute = Tools.syncGetter('data.userReward.contribute', res);
                Toast.show({
                    content: `恭喜你获得+${contribute}贡献值`,
                    duration: 2000,
                });
            }
        }
    };

    if (media.is_ad_video && adShow && !config.disableAd)
        return (
            <View style={{ height: VideoStore.viewportHeight }}>
                <ad.DrawFeedAd
                    onError={(error: any) => {
                        console.log('error', error);
                        setAdShow(false);
                    }}
                    onAdClick={() => getReward(media)}
                />
                {VideoStore.getReward.length < 1 && (
                    <View
                        style={{
                            bottom: Theme.HOME_INDICATOR_HEIGHT -4,
                            position: 'absolute',
                            right: PxFit(Theme.itemSpace),
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Image
                            source={require('../../../assets/images/click_tips.png')}
                            style={{ width: (20 * 208) / 118, height: 20 }}
                        />
                        <Text
                            style={{
                                color: '#C0CBD4',
                                fontSize: PxFit(12),
                                marginHorizontal: PxFit(10),
                            }}>
                            戳一戳，获取更多奖励
                        </Text>
                    </View>
                )}
            </View>
        );

    const JumpLiveRoomHandler = () => {
        props.navigation.navigate('liveroom');
        // showLiveList();
    }

    return (
        <View style={{ height: VideoStore.viewportHeight }}>
            {media.cover && (
                <View style={styles.cover}>
                    <Image style={styles.curtain} source={{ uri: media.cover }} resizeMode="cover" blurRadius={4} />
                    <View style={styles.mask} />
                </View>
            )}
            <Player media={media} index={index} />
            <View style={styles.videoContent}>
                <Row>
                    <SafeText shadowText={true} style={styles.name}>
                        @{media.question.user.name}
                    </SafeText>
                    {isAskQuestion && (
                        <View style={styles.rewardWrap}>
                            <Text style={styles.rewardTitle}>{'悬赏问答'}</Text>
                            <Text style={styles.rewardCount}>{Tools.syncGetter('question.gold', media)}智慧点</Text>
                        </View>
                    )}
                </Row>
                <View>
                    <SafeText shadowText={true} style={styles.body}>
                        {media.question.description}
                        <Text
                            onPress={() =>
                                navigation.navigate('Answer', {
                                    category: Tools.syncGetter('question.category', media),
                                    question_id: null,
                                })
                            }
                            style={{ fontWeight: 'bold', color: Theme.white }}>
                            #{Tools.syncGetter('question.category.name', media)}
                        </Text>
                    </SafeText>
                </View>
            </View>
            <View style={styles.videoSideBar}>
                <SideBar media={media} />
            </View>
            {isAskQuestion && (
                <View
                    style={{
                        position: 'absolute',
                        right: PxFit(5),
                        bottom: PxFit(355 + Theme.HOME_INDICATOR_HEIGHT),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Image
                        source={require('../../../assets/images/tips_bg.png')}
                        style={{ width: 86, height: (86 * 125) / 210 }}
                    />
                    <Text
                        style={{
                            color: '#C0CBD4',
                            position: 'absolute',
                            top: 5,
                            left: PxFit(3),
                            fontSize: PxFit(12),
                            marginHorizontal: PxFit(10),
                        }}>
                        参与评论回答有奖~
                    </Text>
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    body: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: PxFit(14),
        paddingTop: PxFit(10),
    },
    cover: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    curtain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: null,
        height: null,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    name: { color: 'rgba(255,255,255,0.9)', fontSize: PxFit(15), fontWeight: 'bold' },
    videoContent: {
        bottom: PxFit(30),
        left: PxFit(Theme.itemSpace),
        position: 'absolute',
        right: PxFit(90),
    },
    videoSideBar: {
        bottom: PxFit(30),
        position: 'absolute',
        right: PxFit(Theme.itemSpace),
    },
    rewardWrap: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: PxFit(11),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: PxFit(12),
        height: PxFit(22),
        marginLeft: PxFit(10),
    },
    rewardTitle: {
        fontSize: PxFit(11),
        color: 'rgba(255,255,255,0.9)',
    },
    rewardCount: {
        marginLeft: PxFit(5),
        color: Theme.themeRed,
        fontSize: PxFit(11),
    },
});
