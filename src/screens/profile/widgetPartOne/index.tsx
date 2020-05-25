import React, { useEffect } from 'react';
import { Page, StyleSheet, Image } from '../../../widgets';
import { Avatar } from 'hxf-react-native-uilib';
import { View, Text } from "react-native";
import { sw, sh } from '../../../tools';
import { DataCenter, observer } from '../../../data';
import { app } from 'store';
import { TouchFeedback ,Row} from 'components';
import { PxFit,Theme } from 'utils';

const MemoName = observer((props: { navigation: any; name?: string }) => {
    const goToLogin = () => {
        props.navigation.navigate('Login');
    };
    console.log('props.name ', props.name);
    return (
        <Row >
            {app.login ? (
                <Text  style={{ fontWeight: '500',fontSize:24 }}>
                    {props.name}
                </Text>
            ) : (
                <TouchFeedback onPress={goToLogin}>
                        <Text style={{
                            fontWeight: 'bold',
                            fontSize: PxFit(20),
                            color: Theme.defaultTextColor
                        }}>{'登录/注册'}</Text>
                </TouchFeedback>
            )}
        </Row>
    );
});

const MemoDesc = observer((props: { desc: string }) => {
    return (
        <Row style={{ flex: 1 ,marginTop:5}}  >
            {app.login ? (
                <>
                    <Image source={{ uri: 'driver_level' }} resizeMode='contain' style={{ height: 23, width: 23 }} />
                    <Text style={{ color: '#FCCF01', fontSize: 14, fontWeight: '500', marginTop: PxFit(2) }}>
                        当前头衔 {props?.desc ?? ''}
                    </Text>
                </>
            ) : (
                <Text style={{ marginTop: PxFit(10),fontSize: PxFit(14),}}>欢迎来到答妹</Text>
            )}
        </Row>
    );
});

const MemoLevel = observer((props: { navigation: any; userinfo: any }) => {
    return (
        <TouchFeedback
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => {
                props.navigation.navigate('GradeDescription', { user: props.userinfo });
            }}
            navigation={props.navigation}
            authenticated
        >
            <Text  style={{ fontWeight: '600' }}>
                {props.userinfo?.level?.level ?? 1}
            </Text>
            <Text style={{ paddingVertical:10}}>等级</Text>
        </TouchFeedback>
    );
});
const MemoFollow = observer((props: { navigation: any; count?: number }) => {
    return (
        <TouchFeedback
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => {
                props.navigation.navigate('Society', { follower: false });
            }}
            navigation={props.navigation}
            authenticated
        >
            <Text  style={{ fontWeight: '600' }}>
                {props?.count ?? 0}
            </Text>
            <Text style={{ paddingVertical:10}}>关注</Text>
        </TouchFeedback>
    );
});
const MemoFollowers = observer((props: { navigation: any; count?: number }) => {
    return (
        <TouchFeedback
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => {
                props.navigation.navigate('Society', { follower: true });
            }}
            navigation={props.navigation}
            authenticated
        >
            <Text  style={{ fontWeight: '600' }}>
                {props.count ?? 0}
            </Text>
            <Text style={{ paddingVertical:10}}>粉丝</Text>
        </TouchFeedback>
    );
});
const MemoAvatar = observer((props: { navigation: any; user?: any }) => {
    const onPressHandler = () => {
        props.navigation.navigate('User', { user: props?.user ?? {} });
    };
    const avatar  = props.user?.avatar ?? '';
    return (
        <>
            {app.login ? (
                <TouchFeedback onPress={onPressHandler} navigation={props.navigation} authenticated>
                    <Avatar uri={avatar + "?t=" + Date.now()} size={sw * 0.23} />
                </TouchFeedback>
            ) : (
                <TouchFeedback onPress={onPressHandler} navigation={props.navigation} authenticated>
                    <Avatar uri={'default_avatar'} size={sw * 0.23} />
                </TouchFeedback>
            )}
        </>
    );
});

const WidgetPartOne = (props: { navigation: any; userinfo: any }) => {
    return (
        <View style={{ width: sw ,flexDirection:"row",paddingHorizontal:12,marginTop:20}} >
            <View style={{ flex: 1 }}>
                <MemoName navigation={props.navigation} name={props?.userinfo?.name ?? ''} />

                <MemoDesc desc={props?.userinfo?.level?.name} />

                <Row  style={{ flex: 1,marginLeft:3,marginTop:10 }} >
                    <MemoLevel navigation={props.navigation} userinfo={props?.userinfo} />

                    <MemoFollow navigation={props.navigation} count={props?.userinfo?.follow_users_count ?? 0} />

                    <MemoFollowers navigation={props.navigation} count={props?.userinfo?.followers_count ?? 0} />
                </Row>
            </View>
            <Row style={{ justifyContent:"flex-end"}}>
                <MemoAvatar navigation={props.navigation} user={props?.userinfo} />
            </Row>
        </View>
    );
};

export default WidgetPartOne;

const styles = StyleSheet.create({
    itemContainer: {
        width: sw * 0.45,
        height: 82,
        borderRadius: 10,
        backgroundColor: '#FEF4E9',
    },
});
