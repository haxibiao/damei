import React,{useState,useEffect} from 'react';
import { View,Text,Dimensions,TouchableOpacity,StyleSheet,Animated,Easing,FlatList,Image,ImageBackground } from 'react-native';
const {width:sw,height:sh} = Dimensions.get('window');
import {DataCenter,observer} from '../../data';
import LiveStore from './LiveStore';
import { GQL } from '../../network';
import { ApolloClient } from 'apollo-boost';

const LiveModalWidth = sw * 0.86;
const LiveModalHeight = sh;
const ItemGap = 5;
const ItemWidth = (LiveModalWidth - ItemGap*3)/2;

interface Item{
    id:string,
    cover: string,
    title: string,
    count_audience: number
}
let newclient: ApolloClient<unknown>;

const LiveRoomListModalContent = (props:any) => {

    function FetchLiveList(page?:number,fetchCallback?:any){
        newclient = DataCenter.App.newclient;
        if(newclient){
            newclient.query({
                query: GQL.RecommendLiveRoom,
                variables:{
                    page: page ?? 0
                }
            }).then((rs:any) => {
                console.log("直播列表返回数据: ",rs);
                let {paginatorInfo,data} = rs.data.recommendLiveRoom;
                LiveStore.setLiveRoomHasMore(paginatorInfo.hasMorePages);
                if(data.length > 0){
                    let templist = LiveStore.liverooms;
                    for(let i of data){
                        templist.push({
                            id: i.id,
                            title: i.title,
                            cover: i.cover,
                            count_audience: i.count_audience
                        });
                    }
                    LiveStore.setLiveRooms([...templist]);
                }else{
                    fetchCallback ? fetchCallback() : null;
                }
            }).catch((err:any) => {
                //TODO: 直播间列表查询错误
                console.log("直播间列表查询错误: ",err);
            })
        }
    }

    useEffect(() => {
        //只在挂载期间执行
        FetchLiveList(LiveStore.liveroompage,() => {
            console.log("livestore的liverooms长度",LiveStore.liverooms.length);
            if(LiveStore.liverooms.length == 0){
                console.log("无直播，添加弹幕通知当前无直播")
                //发送弹幕消息通知当前无直播
                LiveStore.pushDankamu({name:'',message:'Σ(oﾟдﾟoﾉ)当前暂无直播...'})
            }else{

            }
        });
    },[])

    const RenderItem = ({item,index}:{item:Item,index:number}) => {
        console.log("直播列表item ",item)
        return (
            <TouchableOpacity onPress={() => {}} activeOpacity={1.0} style={{marginStart:ItemGap,marginBottom:ItemGap}}>
                <ImageBackground source={{uri: item.cover}} style={styles.body} resizeMode='cover'>
                <View style={styles.bottomTitle}>
                    <Text style={{color:'#ffffffcc',maxWidth: ItemWidth * 0.62,}} numberOfLines={1} >{item.title}</Text>
                    <View style={{flexDirection:'row',}}>
                        <Image source={require('./res/fill_person.png')} resizeMode='contain' style={{height:15,width:15,opacity:0.8,marginTop:1.5}}/>
                        <Text style={{color:'#ffffffcc'}}>{item.count_audience}</Text>
                    </View>
                </View>
            </ImageBackground>
            </TouchableOpacity>
        )
    }
    return (
        <FlatList
        data={LiveStore.liverooms}
        contentContainerStyle={{paddingTop:ItemGap,backgroundColor:'#000'}}
        keyExtractor={(item:any,index:number) => index.toString() }
        renderItem={RenderItem}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        />
    )
}

export default observer(LiveRoomListModalContent);


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