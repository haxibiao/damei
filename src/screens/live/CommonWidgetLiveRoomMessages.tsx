import React, { useEffect, useState,useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
const { width: sw, height: sh } = Dimensions.get("window");
const Store = LiveStore; //直播 store

const CommonWidgetLiveRoomMessages = (props) => {
    const ListRef = useRef<FlatList>(null);

    const ContentChangeHandler = () => {
        if(ListRef != null){
            ListRef.current?.scrollToEnd();
        }
    }

    const RenderDanmu = ({ item, index }: { item: any, index: number }) => {

        return (
            <View style={{
                paddingHorizontal: 9,
                paddingVertical: 6,
                backgroundColor: '#00000033',
                borderRadius: 18,
                marginBottom: 6,
            }}>
                <Text style={{
                    fontSize: 14,
                    color: 'white',
                    fontWeight: '500',
                    lineHeight: 17
                }}>
                    <Text style={{
                        fontSize: 14,
                        color: '#FE5F5F',
                        fontWeight: '500'
                    }}>{item.name + "："}</Text>
                    {item.message}
                </Text>
            </View>
        )
    }

    return (
        <View style={{height:sh *0.3,width:sw *0.6,marginStart: 12,marginBottom:20}}>
            <FlatList
            ref={ListRef}
            data={Store.dankamu}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ width: sw * 0.6 }}
            keyExtractor={(item, index) => { return index.toString() }}
            renderItem={RenderDanmu}
            onContentSizeChange={ContentChangeHandler}
        />
        </View>
        
    )
}

export default observer(CommonWidgetLiveRoomMessages);