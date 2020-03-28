import React,{useEffect} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Overlay} from 'teaset';
import {sh,sw} from '../../tools';

let key:any = null;
const Content = (props:{mirror:boolean}) => {

    useEffect(() => {
        setTimeout(() => {
            Overlay.hide(key);
        }, 500);
    },[])

    return (
        <View style={styles.container}>
            <View style={styles.toastbody}>
                <Text style={styles.text}>{props.mirror ? '镜像开启' : '镜像关闭'}</Text>
            </View>
        </View>
    )
}

const show = (mirror:boolean) => {
    key = Overlay.show(
        <Overlay.View >
            <Content mirror={mirror}/>
        </Overlay.View>
    )
}

export {show}

const styles = StyleSheet.create({
    container:{
        height:sh,
        width:sw,
        justifyContent:'center',
        alignItems:'center'
    },
    toastbody:{
        paddingHorizontal:14,
        paddingVertical:10,
        borderRadius:6,
        backgroundColor:'#00000077'
    },
    text:{
        fontSize:15,
        color:'#fff'
    }
})