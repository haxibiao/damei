import React, { useEffect } from 'react';
import { Page, StyleSheet, Image } from '../../../widgets';
import { sw, sh } from '../../../tools';
import { View, Text } from 'react-native-ui-lib';
import { observer, DataCenter } from '../../../data';
import { Config } from '../../../utils';
import { app } from 'store';
import { TouchFeedback } from 'components';

const Item = (props: { name: string; icon: string; value: number; marginR?: number; callback?: any }) => {
    return (
        <TouchFeedback
            activeOpacity={1.0}
            onPress={props?.callback ?? null}
            style={[{ marginRight: props.marginR ?? 0 }, styles.itemContainer]}
        >
            <Text>{props.name}</Text>
            <View row marginT-6>
                <Image source={{ uri: props.icon }} resizeMode='contain' style={{ width: 20, height: 20 }} />
                <Text marginL-10>{props.value}</Text>
            </View>
        </TouchFeedback>
    );
};

const WidgetPartTwo = (props: { navigation: any; userinfo: any }) => {
    const GoldHandler = () => {
        if (props.navigation) {
            if (app.login) {
                props.navigation.navigate('BillingRecord');
            } else {
                props.navigation.navigate('Login');
            }
        }
    };

    return (
        <View row style={{ width: sw }} centerH centerV marginV-15>
            <Item name='智慧点' icon='diamond' callback={GoldHandler} value={props?.userinfo?.gold ?? 0} marginR={10} />
            <Item name='精力点' icon='heart' value={props?.userinfo?.ticket ?? 0} />
        </View>
    );
};

export default observer(WidgetPartTwo);

const styles = StyleSheet.create({
    itemContainer: {
        width: sw * 0.45,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#FEF4E9',
        justifyContent: 'center',
        paddingStart: 10,
    },
});
