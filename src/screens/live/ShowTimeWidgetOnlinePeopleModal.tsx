import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('window');
import { Overlay } from 'teaset';
import { Avatar } from 'hxf-react-native-uilib';

const radius = 12;

const ContentView = () => {

    const RenderItem = ({item,index}:{item:{name:string,avatar:any},index:number}) => {
        return (
            <View style={{width:sw,paddingVertical:8,flexDirection:'row',alignItems:'center'}}>
                <Avatar size={32} file={item.avatar} frameStyle={{marginHorizontal:10}}/>
                <Text style={{fontSize:15,color:'#333'}}>{item.name}</Text>
            </View>
        )
    }

    return (
        <View style={styles.body}>
                <FlatList
                data={FakeData}
                keyExtractor={ (item,index) => index.toString() }
                renderItem={RenderItem}
                />
        </View>
    )
}


let overlaykey:any = null;
const showOnlinePeopleModal = () => {
    const view = (
        <Overlay.PullView side='bottom' containerStyle={{backgroundColor:'transparent'}}>
            <ContentView/>
        </Overlay.PullView>
    );
    overlaykey = Overlay.show(view);
}

const hideOnlinePeopleModal = () => {
    Overlay.hide(overlaykey);
}

export { showOnlinePeopleModal,hideOnlinePeopleModal }

const styles = StyleSheet.create({
    body: {
        height:sh*0.45,
        width:sw,
        borderTopLeftRadius:radius,
        borderTopRightRadius:radius,
        backgroundColor:'white',
        paddingTop:10
    }
});

const FakeData = [
    {
        name: 'test name',
        avatar: require('./res/avatar.png')
    },
    {
        name: 'test name',
        avatar: require('./res/avatar.png')
    },
    {
        name: 'test name',
        avatar: require('./res/avatar.png')
    },
    {
        name: 'test name',
        avatar: require('./res/avatar.png')
    },
    {
        name: 'test name',
        avatar: require('./res/avatar.png')
    },
]