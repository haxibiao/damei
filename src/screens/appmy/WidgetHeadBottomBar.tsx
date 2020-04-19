import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image,StyleSheet } from 'react-native';
import { sh, sw } from '../../tools';
const ItemSize = 34;
const IconSize = 26;
const HeadBottomBar = () => {

    return (
        <View style={s.wrapper}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={s.img_wrapper}>
                    <Image source={{ uri: 'ic_mine_speak' }} resizeMode='contain' style={s.icon} />
                </View>
                <Text style={s.text}>我的消息</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={s.img_wrapper}>
                    <Image source={{ uri: 'ic_mine_collection' }} resizeMode='contain' style={{ height: IconSize, width: IconSize }} />
                </View>
                <Text style={s.text}>我的收藏</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={s.img_wrapper}>
                    <Image source={{ uri: 'ic_mine_order' }} resizeMode='contain' style={{ height: IconSize, width: IconSize }} />
                </View>
                <Text style={s.text}>我的发布</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
                <View style={s.img_wrapper}>
                    <Image source={{ uri: 'ic_mine_medal' }} resizeMode='contain' style={{ height: IconSize, width: IconSize }} />
                </View>
                <Text style={s.text}>答题记录</Text>
            </TouchableOpacity>
        </View>
    )
}

export default HeadBottomBar;

const s = StyleSheet.create({
    wrapper:{ 
        flexDirection: 'row', 
        width: sw, 
        justifyContent: "space-around", 
        alignItems: 'center', 
        marginBottom: 13, 
        marginTop: 17, 
        marginStart: -18 
    },
    img_wrapper:{ 
        height: ItemSize, 
        width: ItemSize, 
        backgroundColor: '#ffffff46', 
        borderRadius: 23, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    icon:{ 
        height: IconSize, 
        width: IconSize 
    },
    text:{ 
        color: 'white', 
        fontSize: 12, 
        marginTop: 8 
    }
})
