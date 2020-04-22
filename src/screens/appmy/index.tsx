import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Page, Avatar } from '../../widgets';
import { sh, sw } from '../../tools';

import { DataCenter } from '../../data';

import HeadBG from './WidgetHeadBG';
import HeadUserInfo from './WidgetHeadUserInfo';
import ListItem from './WidgetListItem';
import HeadBottomBar from './WidgetHeadBottomBar';
import WalletEntry from './WidgetWalletEntry';
import RankPart from './WidgetRankPart';
import { config } from 'store';



const OverflowHeight = 30;
const TopHeadHeight = sh * 0.29 + OverflowHeight;

const HGap = sw * 0.05; //页面水平内边距


const AppMy = (props: any) => {
    const { navigation } = props;
    const { colors } = useTheme();
    const me = DataCenter.User.me;

    return (

        <Page.PageCleared>
            <ScrollView bounces={false}>
                <View style={{ width: sw, minHeight: TopHeadHeight, justifyContent: 'flex-end', paddingHorizontal: 18, paddingBottom: OverflowHeight }}>
                    <HeadBG />

                    <HeadUserInfo navigation={navigation} />

                    <HeadBottomBar navigation={navigation} />

                </View>
                <View style={{ minHeight: sh * 0.5, width: sw, backgroundColor: colors.background, marginTop: -OverflowHeight, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'visible', paddingTop: HGap }}>

                    <RankPart navigation={navigation} />

                    <WalletEntry />

                    {
                        !config.disableAd && (<ListItem icon='p_wallet' title='我的钱包' target={() => navigation.navigate('Withdraws')} />)
                    }
                    <ListItem icon='p_edit' title='反馈' target={() => navigation.navigate('Feedback')} />
                    <ListItem icon='p_wenti' title='常见问题' target={() => navigation.navigate('CommonIssue')} />
                    {
                        !config.disableAd && (<ListItem icon='p_gonglve' title='赚钱攻略' target={() => navigation.navigate('MakeMoenyManual')} />)
                    }
                    <ListItem icon='p_setting' title='设置' target={() => navigation.navigate('Setting', { user: me })} />

                </View>
            </ScrollView>
        </Page.PageCleared>

    )
}

export default AppMy;