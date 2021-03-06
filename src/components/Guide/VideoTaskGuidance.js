/*
 * @flow
 * created by wyk made in 2019-09-09 11:10:28
 */
import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableWithoutFeedback } from 'react-native';
import { PxFit, Theme, SCREEN_WIDTH, NAVBAR_HEIGHT, SCREEN_HEIGHT, Tools } from 'utils';
import { app } from 'store';
import { ad } from 'native';
import { playVideo } from 'common';
// import { useNavigation } from '@react-navigation/native';

function VideoTaskGuidance({ onDismiss }) {
    const [step, setStep] = useState(0);
    const me = useMemo(() => app.me, [app]);
    // const navigation = useNavigation();
    const guidesView = useMemo(() => {
        return [
            <TouchableWithoutFeedback
                key={1}
                onPress={() => {
                    // if(navigation) navigation.navigate('任务');
                    setStep(1);
                }}>
                <Image style={styles.userReward} source={require('../../assets/images/new_user_reward.png')} />
            </TouchableWithoutFeedback>,

            <TouchableWithoutFeedback
                key={3}
                onPress={() => {
                    onDismiss();
                }}>
                <View style={styles.flexCenter}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            playVideo({ type: 'Task' });
                            onDismiss();
                        }}>
                        <Image
                            style={styles.stimulateVideo}
                            source={require('../../assets/images/stimulate_video.png')}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>,
        ];
    }, []);

    return guidesView[step];
}

const withdrawGuideTop = PxFit(30) + PxFit(Theme.itemSpace) * 2 + PxFit(NAVBAR_HEIGHT) + PxFit(Theme.statusBarHeight);
const withdrawGuideRight = (SCREEN_WIDTH / 2 - 120) / 2;
const withdrawGuideWidth = ((SCREEN_WIDTH - PxFit(Theme.itemSpace * 3)) / 2) * (746 / 450);

const videoTaskGuideWidth = PxFit(88) * (800 / 252);
const videoTaskGuideHeight = (videoTaskGuideWidth * 423) / 800;
const videoTaskGuideTop =
    PxFit(245) + PxFit(NAVBAR_HEIGHT) + PxFit(Theme.statusBarHeight) - (videoTaskGuideHeight * 326) / 423;

const styles = StyleSheet.create({
    flexCenter: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userReward: {
        width: (SCREEN_WIDTH * 4) / 5,
        height: (((SCREEN_WIDTH * 4) / 5) * 640) / 519,
        resizeMode: 'contain',
    },
    withdrawGuide: {
        position: 'absolute',
        top: withdrawGuideTop,
        right: withdrawGuideRight,
        width: withdrawGuideWidth,
        height: (withdrawGuideWidth * 659) / 746,
        resizeMode: 'contain',
    },
    stimulateVideo: {
        position: 'absolute',
        top: videoTaskGuideTop,
        right: PxFit(48),
        width: videoTaskGuideWidth,
        height: videoTaskGuideHeight,
        resizeMode: 'contain',
    },
});

export default VideoTaskGuidance;
