import React, { useEffect } from 'react';
import { Page, StyleSheet, TouchableOpacity, Image } from '../../../widgets';
import { View, Text, } from 'react-native-ui-lib';
import { sw, sh } from '../../../tools';
import { observer,app } from 'store';

import { TouchFeedback } from "components"
import { PxFit } from "utils";

const generalSub = [
    {
        icon: 'p_wallet',
        name: '我的钱包',
        targetRoute: 'Withdraws'
    },
    {
        icon: 'p_edit',
        name: '意见反馈',
        targetRoute: 'Feedback'
    },
    {
        icon: 'p_setting',
        name: '设置',
        targetRoute: 'Setting'
    },
];

const WidgetPartFour = observer((props: {
    navigation: any;
    userinfo:any;
}) => {
    console.log('app.login', app.login)
    return (
        <View style={{ width: sw, height: 'auto' }} paddingH-10 marginT-20>
            {
                generalSub.map((item: { name: string, icon: string, targetRoute: string; }, index: number) => {
                    return (
                        <TouchFeedback
                            activeOpacity={0.9}
                            style={styles.itemContainer}
                            key={index}
                            navigation={props.navigation}
                            authenticated
                            onPress={() => {
                                if(item.name == '设置'){
                                    props.navigation.navigate(item.targetRoute,{'user': props?.userinfo ?? {}});
                                }else{
                                    props.navigation.navigate(item.targetRoute);
                                }
                            }}
                        >
                            <View style={{ width: sw * 0.5 }} row centerV>
                                <Image source={{ uri: item.icon }} style={{ height: 25, width: 25 }} resizeMode='contain' />
                                <Text marginL-16 style={{  fontSize: PxFit(16)}}> {item.name}</Text>
                            </View>
                            <Image source={{ uri: 'right_arrow' }} resizeMode='contain' style={{ height: 18, width: 18 }} />
                        </TouchFeedback>
                    );
                })
            }
        </View>
    );
});

export default WidgetPartFour;

const styles = StyleSheet.create({
    itemContainer: {
        height: PxFit(62),
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 8
    }
});
