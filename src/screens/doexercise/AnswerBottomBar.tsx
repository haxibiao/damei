import React,{useState,useEffect} from 'react';
import {View,Text,TouchableOpacity,Animated,Easing,Image} from 'react-native';
import { observer,DataCenter } from '../../data';
import {useTheme} from '@react-navigation/native';

const ICONSIZE = 21;
const GAP = 30;
const TOP = 16;



const CollectWidget = () => {
    const [on,seton] = useState(false);
    const {colors} = useTheme();

    return (
        <TouchableOpacity style={{alignItems:'center'}}>
            {
                on ? (
                    <Image source={{uri: 'q_collected'}} resizeMode='contain' style={{height:ICONSIZE,width:ICONSIZE}}/>
                ):(
                    <Image source={{uri: 'q_collect'}} resizeMode='contain' style={{height:ICONSIZE,width:ICONSIZE}}/>
                )
            }
            <Text style={{fontSize:14,color:colors.primaryText,marginTop:5}}>收藏</Text>
        </TouchableOpacity>
    )
}

const CommentWidget = (props:{
    count?:number
}) => {
    const {colors} = useTheme();
    return (
        <TouchableOpacity style={{alignItems:'center',marginHorizontal: GAP}}>
            <Image source={{uri: 'q_comment'}} resizeMode='contain' style={{height:ICONSIZE,width:ICONSIZE}}/>
            <Text style={{fontSize:14,color:colors.primaryText,marginTop:5}}>评论{props?.count ?? ''}</Text>
        </TouchableOpacity>
    )
}

const LikeWidget = (props:{
    count?:number
}) => {
    const [on,seton] = useState(false);
    const {colors} = useTheme();
    return (
        <TouchableOpacity style={{alignItems:'center'}}>
            {
                on ? (
                    <Image source={{uri: 'q_greate'}} resizeMode='contain' style={{height:ICONSIZE,width:ICONSIZE}}/>
                ):(
                    <Image source={{uri: 'q_greated'}} resizeMode='contain' style={{height:ICONSIZE,width:ICONSIZE}}/>
                )
            }
            <Text style={{fontSize:14,color:colors.primaryText,marginTop:5}}>点赞{props?.count ?? '12'}</Text>
        </TouchableOpacity>
    )
}

/**
 *  底部条 主体部分
 */
const AnswerBottomBar = () => {

    return (
        <View style={{flexDirection:'row',alignItems:'center',alignSelf:'center',marginTop:TOP}}>
            <CollectWidget />
            <CommentWidget />
            <LikeWidget />
        </View>
    )
}

export default AnswerBottomBar;