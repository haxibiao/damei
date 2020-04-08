import React, { useEffect } from 'react';
import { Page } from '../../widgets';


/**
 *  子组件部分引入
 */
import WidgetPartOne from './widgetPartOne';
import WidgetPartTwo from './widgetPartTwo';
import WidgetPartThree from './widgetPartThree';
import WidgetPartFour from './widgetPartFour';
import {View} from "react-native";


const Profile = (props: any) => {

    useEffect(() => {

    }, [])


    return (
        <Page.PageCleared safe >
            <View style={{flex:1,alignItems:'center'}}>

                <WidgetPartOne navigation={props.navigation}/>

                <WidgetPartTwo navigation={props.navigation}/>

                <WidgetPartThree navigation={props.navigation} />

                <WidgetPartFour navigation={props.navigation} />

            </View>
        </Page.PageCleared>
    )
}

export default Profile;
