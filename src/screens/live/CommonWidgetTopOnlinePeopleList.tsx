import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions,TouchableOpacity, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
import { Avatar } from 'hxf-react-native-uilib';
import * as CommonWidgetTopOnlinePeopleModal from './CommonWidgetTopOnlinePeopleModal';
import * as CommonWidgetUserCardModal from './CommonWidgetUserCardModal';
const { width: sw, height: sh } = Dimensions.get("window");
import { GQL } from '../../network';

const TOP_WIDGET_AVATAR_SIZE = 28; // 2
const TOP_WIDGET_CLOSE_SIZE = 12;
const TOP_WIDGET_ONLINE_WRAPPER_HEIGHT = 28;


const OnlinePeople = observer((props: any) => {

    const getCount = () => {
        let c = LiveStore.count_audience;
        if(c >= 1000 && c < 10000){
            return (c/1000).toFixed(1) + 'k';
        }else if(c >= 10000){
            return (c/10000).toFixed(1)+'w';
        }
        return c;
    }
    useEffect(() => {
        console.log('onlinepeople: ',LiveStore.onlinePeople);
    });

    return (
        <View style={styles.AudienceContainer}>
            <View style={{minWidth:35,maxWidth:sw * 0.34,height:36}}>
            <FlatList
            keyExtractor={(item,index) => index.toString()}
            data={LiveStore.onlinePeople}
            horizontal
            contentContainerStyle={{alignItems:'center'}}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index}) => {
                console.log('头像列表中头像地址： ',item.user_avatar)
                return (
                    <TouchableOpacity 
                    style={{ marginEnd:2}}
                    activeOpacity={1.0} 
                    onPress={() => {
                        CommonWidgetUserCardModal.show(props.navigation,item.user_id);
                    }}>
                        <Avatar size={TOP_WIDGET_AVATAR_SIZE} uri={item.user_avatar} />
                    </TouchableOpacity>
                )
            }}
            />
            </View>
            
        <TouchableOpacity  onPress={() => { CommonWidgetTopOnlinePeopleModal.showOnlinePeopleModal() }} style={styles.AudienceCountWrapper}>
            <Text style={{
                fontSize: 12,
                color: 'white'
            }}>{getCount()}</Text>
        </TouchableOpacity>
        </View>
    )
});

export default OnlinePeople;

const styles = StyleSheet.create({
    AudienceContainer: {
        flexDirection:'row',
        alignItems:'center',
        position:'absolute',
        right: TOP_WIDGET_CLOSE_SIZE,
    },
    AudienceCountWrapper: {
        paddingHorizontal: 5,
        height: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        minWidth: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT,
        backgroundColor: '#00000033',
        borderRadius: TOP_WIDGET_ONLINE_WRAPPER_HEIGHT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginEnd: 3
    },
})