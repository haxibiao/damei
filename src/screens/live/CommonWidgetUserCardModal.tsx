import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Animated, Easing, Image } from 'react-native';
import LiveStore from './LiveStore';
import { observer } from 'mobx-react';
import { when } from 'mobx';
import { Overlay } from 'teaset';
import { Avatar } from 'hxf-react-native-uilib';
import { GQL } from 'apollo';
import { GQL as NewGQL } from '../../network';
import { app } from 'store';

const { width: sw, height: sh } = Dimensions.get('window');
const FollowWidth = sw * 0.6;
const FollowHeight = 38;
const AvatarSize = 75;

let key: any = null;
let client: any = null;
let newclient: any = null;
const ContentView = observer((props: any) => {
    const navigation = props.navigation;
    const [userinfo, setuserinfo] = useState();
    const [followed, setfollowed] = useState(false);
    const [reported,setreported] = useState(false);
    useEffect(() => {
        client = app.client;
        newclient = app.newClient;
    }, []);

    useEffect(() => {
        if (props.userid) {
            newclient.query({
                query: NewGQL.GetUserInfo,
                variables: { id: props.userid }
            }).then(rs => {
                console.log('用户信息结果,', rs);
                setuserinfo(rs.data.user);
            }).catch(err => {
                console.log('用户信息接口错误,', err);
            })
        }
    }, []);

    function followMutate() {
        if (client) {
            client.mutate({
                mutation: GQL.FollowToggbleMutation,
                variables: { followed_type: 'users', followed_id: userinfo.id }
            }).then((rs: any) => {
                if (rs.data.followToggle == null) {
                    setfollowed(false);
                } else {
                    setfollowed(true);
                }
            }).catch((err: any) => {
                Toast({ content: '网络错误，请稍后重试' });
            });
        }
    }
    const AvatarClickHandler = () => {
        // //跳转到用户详情页
        if (navigation) {
            //navigation.navigate('User', { user: { id: LiveStore.streamer.id, name: LiveStore.streamer.name } });
            hide();
        }
    }
    const reportHandler = () => {
        setreported(true);
    }

    return (
        <View style={{
            borderRadius: 20,
            alignItems: 'center',
            paddingBottom: 30,
            backgroundColor: 'white',
            marginTop: sh / 3,
            maxWidth: sw * 0.8,
            marginStart: sw * 0.1
        }}>
            <TouchableOpacity
                activeOpacity={1.0}
                disabled={!userinfo}
                onPress={AvatarClickHandler}>
                <Avatar uri={userinfo?.avatar ?? ''} size={AvatarSize} borderWidth={1} borderColor={'white'} frameStyle={{ marginTop: -25, marginBottom: 10, backgroundColor: 'white' }} />
            </TouchableOpacity>

            {
                userinfo && (
                    <>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center" }}>
                            <Text style={{ color: "#222", marginEnd: 12, fontSize: 16 }}>{userinfo?.name ?? ''}</Text>
                            <Image source={require('./res/level_badge.png')} resizeMode={'contain'} style={{ height: 20, width: 20, marginEnd: 6 }} />
                            {userinfo?.level && <Text style={{ fontSize: 16, color: '#888' }}>{userinfo?.level?.level ?? 1}级</Text>}
                        </View>
                        <Text style={{ color: '#888', marginTop: 20, marginBottom: 8 }}>{userinfo?.level?.name ?? ''}</Text>
                        <TouchableOpacity
                            onPress={followMutate}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: FollowWidth,
                                height: FollowHeight,
                                backgroundColor: followed ? '#ddd' : '#FDF187',
                                borderRadius: FollowHeight / 2,
                                marginTop: 30
                            }}>
                            <Text style={{ color: '#555', fontSize: 15 }}>{followed ? "取消关注" : "关注"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={reportHandler}
                            disabled={reported}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: FollowWidth*0.88,
                                height: FollowHeight*0.88,
                                backgroundColor: reported ? '#ddd' : '#DD021B',
                                borderRadius: FollowHeight / 2,
                                marginTop: 15
                            }}>
                            <Text style={{ color: reported ? '#555' : 'white', fontSize: 15 }}>{reported ? "已举报" : "举报"}</Text>
                        </TouchableOpacity>
                    </>
                )
            }
        </View>
    );
});
const show = (navigation: any, userid: number) => {
    let v = (
        <Overlay.View
            side={'bottom'}
            containerStyle={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' }}
            overlayOpacity={0.3}>
            <ContentView navigation={navigation} userid={userid} />
        </Overlay.View>
    );
    key = Overlay.show(v);
};
const hide = () => {
    Overlay.hide(key);
};

export { show, hide }

const styles = StyleSheet.create({
    button: {
        width: 120,
        height: 32,
        borderRadius: 16,
    },
})