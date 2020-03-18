import React,{useState,useEffect} from 'react';
import { View,Text,Dimensions,TouchableOpacity,StyleSheet,Animated,Easing,FlatList,Image,ImageBackground } from 'react-native';

const {width:sw,height:sh} = Dimensions.get('window');
const LiveModalWidth = sw * 0.86;
const LiveModalHeight = sh;
const ItemGap = 5;
const ItemWidth = (LiveModalWidth - ItemGap*3)/2;

interface Item{
    cover: any,
    title: string,
    numberofaudience: number
}

const LiveRoomListModalContent = (props:any) => {

    const RenderItem = ({item,index}:{item:Item,index:number}) => {
        return (
            <TouchableOpacity onPress={() => {}} activeOpacity={1.0} style={{marginStart:ItemGap,marginBottom:ItemGap}}>
                <ImageBackground source={item.cover} style={styles.body} resizeMode='cover'>
                <View style={styles.bottomTitle}>
                    <Text style={{color:'#ffffffcc',maxWidth: ItemWidth * 0.62,}} numberOfLines={1} >{item.title}</Text>
                    <View style={{flexDirection:'row',}}>
                        <Image source={require('../res/fill_person.png')} resizeMode='contain' style={{height:15,width:15,opacity:0.8,marginTop:1.5}}/>
                        <Text style={{color:'#ffffffcc'}}>{item.numberofaudience}</Text>
                    </View>
                </View>
            </ImageBackground>
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
        data={FakeData}
        contentContainerStyle={{paddingTop:ItemGap,backgroundColor:'#000'}}
        keyExtractor={(item:any,index:number) => index.toString() }
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        />
    )
}

export default LiveRoomListModalContent;

const FakeData:Item[] = [
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    },
    {
        cover: require('../res/avatar.png'),
        title: '这个标题有点厉害',
        numberofaudience: 120
    }
]

const styles = StyleSheet.create({
    body:{
        height:ItemWidth,
        width:ItemWidth,
        borderRadius:ItemGap,
        overflow:'hidden',
        justifyContent:'flex-end',
    },
    bottomTitle:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        paddingHorizontal:8,
        backgroundColor:'#00000033'
    }
})