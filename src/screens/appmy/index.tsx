import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Page, Avatar } from '../../widgets';
import { sh, sw } from '../../tools';


import HeadBG from './WidgetHeadBG';
import HeadUserInfo from './WidgetHeadUserInfo';
import ListItem from './WidgetListItem';
import HeadBottomBar from './WidgetHeadBottomBar';
import WalletEntry from './WidgetWalletEntry';
import RankPart from './WidgetRankPart';

const OverflowHeight = 30;
const TopHeadHeight = sh * 0.29 + OverflowHeight;

const HGap = sw * 0.05; //页面水平内边距



const AppMy = () => {
    const { colors } = useTheme();

    return (
        <Page.PageCleared>
            <ScrollView bounces={false}>
                <View style={{ width: sw, minHeight: TopHeadHeight, justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: OverflowHeight }}>
                    <HeadBG />

                    <HeadUserInfo />

                    <HeadBottomBar />

                </View>
                <View style={{ minHeight: sh * 0.5, width: sw, backgroundColor: colors.background, marginTop: -OverflowHeight, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'visible', paddingTop: HGap }}>

                    <RankPart/>

                    <WalletEntry />
                    
                    <ListItem icon='p_wallet' title='我的钱包'/>
                    <ListItem icon='p_edit' title='反馈'/>
                    <ListItem icon='p_wenti' title='常见问题'/>
                    <ListItem icon='p_gonglve' title='赚钱攻略'/>
                    <ListItem icon='p_setting' title='设置'/>
                    
                </View>
            </ScrollView>
        </Page.PageCleared>
    )
}

export default AppMy;