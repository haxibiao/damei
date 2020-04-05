import React, { useEffect } from 'react';
import { Page, StyleSheet, TouchableOpacity, Image } from '../../../widgets';
import {Avatar} from 'hxf-react-native-uilib';
import { View, Text } from 'react-native-ui-lib';
import { sw, sh } from '../../../tools';
import {DataCenter,observer} from '../../../data';

const MemoName = observer((props:{navigation:any}) => {
    const goToLogin = () => {
        props.navigation.navigate('Login');
    }
    return (
        <View flex centerV>
        {
            DataCenter.User.loggined ? <Text text60 style={{ fontWeight: '500' }}>{DataCenter.User.me.name}</Text> : (
                <TouchableOpacity onPress={goToLogin}><Text style={{ fontWeight: '500' }}>前往登录</Text></TouchableOpacity>
            )
        }
        </View>
    )
});

const MemoDesc = observer((props:any) => {
    return (
        <View row style={{ flex: 1 }} centerV>
        {
            DataCenter.User.loggined ? (
                <>
                <Image source={{ uri: 'driver_level' }} resizeMode='contain' style={{ height: 23, width: 23 }} />
                <Text style={{ color: '#FCCF01', fontSize: 14, fontWeight: '500' }}>当前头衔 初来乍到</Text>
                </>
            ):(
                <Text style={{ color: '#333', fontSize: 14, fontWeight: '500' }}>欢迎来到答妹</Text>
            )
        }
        </View>
    )
})

const MemoLevel = observer((props:{navigation:any}) => {
    return (
        <TouchableOpacity 
        style={{flex:1,justifyContent:'center'}}
        onPress={() => {
            if(!DataCenter.User.loggined) props.navigation.navigate('Login');
            props.navigation.navigate('GradeDescription', { user: DataCenter.User.me })
            }}>

                <Text text70 style={{ fontWeight: '600' }}>{DataCenter.User?.me?.level?.level ?? 0}</Text>
                <Text text80>等级</Text>

        </TouchableOpacity>
    )
})
const MemoFollow = observer((props:{navigation:any}) => {
    return (
        <TouchableOpacity 
        style={{flex:1,justifyContent:'center'}}
        onPress={() => {
            if(!DataCenter.User.loggined) props.navigation.navigate('Login');
            props.navigation.navigate('Society')
            }}>
            <Text text70 style={{ fontWeight: '600' }}>{DataCenter.User?.me?.follow_users_count ?? 0}</Text>
            <Text text80>关注</Text>
        </TouchableOpacity>
    )
})
const MemoFollowers = observer((props:{navigation:any}) => {
    return (
        <TouchableOpacity 
        style={{flex:1,justifyContent:'center'}}
        onPress={() => {
            if(!DataCenter.User.loggined) props.navigation.navigate('Login');
            props.navigation.navigate('Society', { follower: true })
            }}>
            <Text text70 style={{ fontWeight: '600' }}>{DataCenter.User?.me?.followers_count ?? 0}</Text>
            <Text text80>粉丝</Text>
        </TouchableOpacity>
    )
})
const MemoAvatar = observer((props:{navigation:any}) => {

    const onPressHandler = () => {
        if(props.navigation){
            if(DataCenter.User.loggined){
                props.navigation.navigate('User',{user: DataCenter.User.me})
            }else{
                props.navigation.navigate('Login')
            }
        }
    }

    return (
        <>
        {
            DataCenter.User.loggined ? (
                <TouchableOpacity onPress={onPressHandler}>
                    <Avatar uri={DataCenter.User?.me?.avatar} size={sw * 0.23} />
                </TouchableOpacity>
            ):(
                <TouchableOpacity onPress={onPressHandler}>
                    <Avatar uri={'default_avatar'} size={sw * 0.23} />
                </TouchableOpacity>
            )
        }
        </>
    )
})

const WidgetPartOne = (props:{navigation:any}) => {
    return (
        <View style={{ width: sw, height: 120 }} row spread paddingH-12 marginT-20>

            <View style={{ flex: 1 }}>

                <MemoName navigation={props.navigation}/>

                
                <MemoDesc />

                <View row style={{ flex: 1.4 }} marginL-3>

                    <MemoLevel navigation={props.navigation}/>

                    <MemoFollow navigation={props.navigation}/>
                        
                    <MemoFollowers navigation={props.navigation}/>
                </View>
            </View>
            <View flex right centerV>
                <MemoAvatar navigation={props.navigation}/>
            </View>
        </View>
    )
}

export default WidgetPartOne;

const styles = StyleSheet.create({
    itemContainer: {
        width: sw * 0.45,
        height: 82,
        borderRadius: 10,
        backgroundColor: '#FEF4E9',
    }
})
