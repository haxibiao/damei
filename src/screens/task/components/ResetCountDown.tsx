import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Theme, SCREEN_WIDTH, Tools, PxFit } from 'utils';
import { useCountDown, GetSpecifyDate } from 'common';
import { BoxShadow } from 'react-native-shadow';

const ResetCountDown = props => {
    // const expirationTime = useMemo(() => GetSpecifyDate(1).toLocaleDateString() + ' 12:00:00', []);
    const countDown = useCountDown({ expirationTime: props.expirationTime });

    return (
        <BoxShadow setting={shadowOpt}>
            <View style={styles.countDownContainer}>
                <Image style={styles.countDownImage} source={require('@src/assets/images/count_down.png')} />
                <View style={styles.tips}>
                    <Text style={styles.tipsText}>每日零点重置</Text>
                    <Text style={styles.tipsText}>请您及时领取</Text>
                </View>
                <View style={styles.countDown}>
                    <Text style={styles.time}>{`${countDown.hours}:${countDown.minutes}:${countDown.seconds}`}</Text>
                </View>
            </View>
        </BoxShadow>
    );
};

export default ResetCountDown;

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(Theme.itemSpace * 2),
    height: PxFit(60),
    color: '#eee',
    border: PxFit(6),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginHorizontal: PxFit(Theme.itemSpace),
    },
};

const styles = StyleSheet.create({
    countDownContainer: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: PxFit(6),
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    countDownImage: {
        height: PxFit(40),
        justifyContent: 'center',
        width: PxFit(40),
    },
    time: {
        color: '#200706',
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
    tips: {
        marginLeft: PxFit(10),
        marginRight: PxFit(20),
    },
    tipsText: {
        color: Theme.secondaryColor,
        fontSize: PxFit(12),
        lineHeight: PxFit(18),
    },
});
