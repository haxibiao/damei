import React from 'react';
import { View,StyleSheet,Dimensions,Text, TextStyle, ViewStyle } from 'react-native';
import HeaderBackButton from './HeaderBackButton';
const sw = Dimensions.get('window').width;

interface Props{
    centerTitle?:string;
    leftTitle?:string;
    centerTitleStyle?:TextStyle;
    leftTitleStyle?:TextStyle;
    backgroundColor?: string;
    rightWidget?: JSX.Element;
    paddingTop?: number;
    absolute?:boolean;
    zIndex?:number;
    hasNotch?:boolean;
    arrow?:boolean;
}
export default function Header(props:Props){
    let absolute = props?.absolute ?? false;
    let position: ViewStyle = absolute ? {position: "absolute",top:0,left:0,right:0,zIndex:props?.zIndex ?? 10} : {};
    let backgroundColor = props?.backgroundColor ?? "#ffffff";
    let PT = 0;
    let MT = 0;
    let HeaderHeight = 45;
    if((props?.paddingTop ?? 0) > 0){
        // 设置了padding , 忽略hasNotch
        PT = props.paddingTop ?? 0;
    }else{
        //判断 hasNotch
        if(props?.hasNotch != undefined){ //存在 hasNotch 属性
            if(props?.hasNotch) {
                PT = 34;
                HeaderHeight = 88;
            }
        }
    }
    MT = PT == 34 ? -34 : 0;
    const minHeight = 45;

    return (
        <View style={[styles.body,{minHeight:HeaderHeight,backgroundColor: 'transparent',paddingTop:PT,marginTop: MT},position]}>
            <View style={{opacity: 1 ?? 1,position:'absolute',zIndex: -1,minHeight:HeaderHeight,backgroundColor:backgroundColor}}/>

            <View style={[styles.left,{flex:3,minHeight}]}>
                <HeaderBackButton arrow={props?.arrow ?? false}/>
                <Text style={props?.leftTitleStyle ?? {marginStart:5,fontSize:18}}>{props?.leftTitle ?? ''}</Text>
            </View>
            <View style={[styles.center,{flex:1,minHeight}]}>
                <Text style={props?.centerTitleStyle ?? {fontSize:20,color:'#222'}}>
                    {props?.centerTitle ?? ''}
                </Text>
            </View>
            <View style={[styles.right,{flex:3,minHeight}]}>
                {
                    props?.rightWidget ?? <View/>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        width:sw,
        flexDirection:'row',
        alignItems:'flex-end'
    },
    left:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    center:{
        justifyContent:'center',
        alignItems:'center'
    },
    right:{
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
    }
})