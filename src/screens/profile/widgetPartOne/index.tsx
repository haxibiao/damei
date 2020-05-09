import React, { useEffect } from 'react';
import { Page, StyleSheet, Image } from '../../../widgets';
import { Avatar } from 'hxf-react-native-uilib';
import { View, Text } from 'react-native-ui-lib';
import { sw, sh } from '../../../tools';
import { DataCenter, observer } from '../../../data';
import { app } from 'store';
import { TouchFeedback } from 'components';
import { PxFit } from 'utils';

const MemoName = observer((props: { navigation: any; name?: string }) => {
    const goToLogin = () => {
        props.navigation.navigate('Login');
    };
    console.log('props.name ', props.name);
    return (
        <View flex centerV>
            {app.login ? (
                <Text text60 style={{ fontWeight: '500' }}>
                    {props.name}
                </Text>
            ) : (
                <TouchFeedback onPress={goToLogin}>
                    <Text style={{ fontWeight: '500' }}>前往登录</Text>
                </TouchFeedback>
            )}
        </View>
    );
});

const MemoDesc = observer((props: { desc: string }) => {
    return (
        <View row style={{ flex: 1 }} centerV>
            {app.login ? (
                <>
                    <Image source={{ uri: 'driver_level' }} resizeMode='contain' style={{ height: 23, width: 23 }} />
                    <Text style={{ color: '#FCCF01', fontSize: 14, fontWeight: '500', marginTop: PxFit(15) }}>
                        当前头衔 {props?.desc ?? ''}
                    </Text>
                </>
            ) : (
                <Text style={{ color: '#333', fontSize: 14, fontWeight: '500' }}>欢迎来到答妹</Text>
            )}
        </View>
    );
});

const MemoLevel = observer((props: { navigation: any; userinfo: any }) => {
    return (
        <TouchFeedback
            style={{ flex: 1, justifyContent: 'center' }}
            onPress={() => {
                props.navigation.navigate('GradeDescription', { user: props.userinfo });
            }}
        >
            <Text text70 style={{ fontWeight: '600' }}>
                {props.userinfo?.level?.level ?? 1}
            </Text>
            <Text text80>等级</Text>
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
        >
            <Text text70 style={{ fontWeight: '600' }}>
                {props?.count ?? 0}
            </Text>
            <Text text80>关注</Text>
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
        >
            <Text text70 style={{ fontWeight: '600' }}>
                {props.count ?? 0}
            </Text>
            <Text text80>粉丝</Text>
        </TouchFeedback>
    );
});
const MemoAvatar = observer((props: { navigation: any; user?: any }) => {
    const onPressHandler = () => {
        props.navigation.navigate('User', { user: props?.user ?? {} });
    };

    return (
        <>
            {app.login ? (
                <TouchFeedback onPress={onPressHandler}>
                    <Avatar uri={props.user?.avatar ?? ''} size={sw * 0.23} />
                </TouchFeedback>
            ) : (
                <TouchFeedback onPress={onPressHandler}>
                    <Avatar uri={'default_avatar'} size={sw * 0.23} />
                </TouchFeedback>
            )}
        </>
    );
});

const WidgetPartOne = (props: { navigation: any; userinfo: any }) => {
    return (
        <View style={{ width: sw }} row spread paddingH-12 marginT-20>
            <View style={{ flex: 1 }}>
                <MemoName navigation={props.navigation} name={props?.userinfo?.name ?? ''} />

                <MemoDesc desc={props?.userinfo?.level?.name} />

                <View row style={{ flex: 1 }} marginL-3 marginT-10>
                    <MemoLevel navigation={props.navigation} userinfo={props?.userinfo} />

                    <MemoFollow navigation={props.navigation} count={props?.userinfo?.follow_users_count ?? 0} />

                    <MemoFollowers navigation={props.navigation} count={props?.userinfo?.followers_count ?? 0} />
                </View>
            </View>
            <View flex right centerV>
                <MemoAvatar navigation={props.navigation} user={props?.userinfo} />
            </View>
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
