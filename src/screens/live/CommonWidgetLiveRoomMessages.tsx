import React, { useEffect,useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList,TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react';
import LiveStore from './LiveStore';
const { width: sw, height: sh } = Dimensions.get("window");
const Store = LiveStore; //直播 store
import * as CommonWidgetSlideUpReportModal from './CommonWidgetSlideUpReportModal';

const RenderDanmu = ({ item, index }: { item: any, index: number }) => {

    const ClickHandler = () => {
        CommonWidgetSlideUpReportModal.show();
    };
    const isDisable = () => {
        if(item.message == '') return true;
        return false;
    }

    return (
        <TouchableOpacity 
        onPress={ClickHandler}
        disabled={isDisable()}
        style={styles.dankamuWrapper}>
            <Text style={styles.dankamuText}>
                <Text style={styles.dankamuName}>{item.name + (item.message != '' ? '：' : '')}</Text>
                {item.message}
            </Text>
        </TouchableOpacity>
    )
}
const CommonWidgetLiveRoomMessages = (props) => {
    const ListRef = useRef<FlatList>(null);

    const ContentChangeHandler = () => {
        if(ListRef != null){
            ListRef.current?.scrollToEnd();
        }
    }

    return (
        <View style={styles.body}>
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

const styles = StyleSheet.create({
    body:{
        height:sh *0.3,
        width:sw *0.6,
        marginStart: 12,
        marginBottom:20,
    },
    dankamuWrapper:{
        paddingHorizontal: 9,
        paddingVertical: 6,
        backgroundColor: '#00000033',
        borderRadius: 18,
        marginBottom: 6,
    },
    dankamuText:{
        fontSize: 14,
        color: 'white',
        fontWeight: '500',
        lineHeight: 17
    },
    dankamuName:{
        fontSize: 14,
        color: '#FE5F5F',
        fontWeight: '500'
    }
})