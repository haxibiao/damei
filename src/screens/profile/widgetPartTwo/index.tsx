import React, { useEffect } from 'react';
import { Page, StyleSheet, TouchableOpacity, Image} from '../../../widgets';
import { sw, sh } from '../../../tools';
import {View, Text,} from 'react-native-ui-lib';
import {observer,DataCenter} from '../../../data';
import {Config} from '../../../utils';

const Item = (props: { name: string, icon: string, value: number, marginR?: number,callback?:any }) => {

    return (
        <TouchableOpacity activeOpacity={1.0} onPress={props?.callback ?? null} style={[{ marginRight: props.marginR ?? 0 }, styles.itemContainer]} >
            <Text>{props.name}</Text>
            <View row marginT-6>
                <Image source={{ uri: props.icon }} resizeMode='contain' style={{ width: 20, height: 20 }} />
                <Text marginL-10>{props.value}</Text>
            </View>
        </TouchableOpacity>
    )
}

const WidgetPartTwo = (props:{navigation:any}) => {

    const GoldHandler = () => {
        if(props.navigation){
            props.navigation.navigate('BillingRecord');
        }
    }

    return (
        <View row style={{ width: sw, height: 96 }} centerH centerV marginT-10>
            <Item name='智慧点' icon='diamond' callback={GoldHandler} value={DataCenter.User?.me?.gold ?? 0} marginR={10} />
            <Item name='精力点' icon='heart' value={DataCenter.User?.me?.ticket ?? 0} />
        </View>
    )
}

export default observer(WidgetPartTwo);

const styles = StyleSheet.create({
    itemContainer: {
        width: sw * 0.45,
        height: 82,
        borderRadius: 10,
        backgroundColor: '#FEF4E9',
        justifyContent:'center',
        paddingStart:10
    }
})
