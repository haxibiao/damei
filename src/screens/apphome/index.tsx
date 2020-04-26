import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Page } from '../../widgets';
import { sw, sh, useStatusHeight } from '../../tools';

import FindPal from './WidgetFindPal';
import RecommendPart from './WidgetRecommendPart';
import DayInspiration from './WidgetDayInspiration';
import InterestPart from './WidgetInterestPart';
import SearchBox from './WidgetSearchBox';



/**
 *  新答题首页
 */
const AppHome = React.memo((props: any) => {

    let statusHeight = useStatusHeight();

    return (
        <Page.PageCleared>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: statusHeight }}
            >
                <SearchBox />
                <FindPal />
                <RecommendPart navigation={props.navigation} />
                <DayInspiration />
                <InterestPart />
            </ScrollView>
        </Page.PageCleared>
    );
});
export default AppHome;