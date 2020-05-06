import React, { useEffect ,useState } from 'react';
import { Page } from '../../widgets';
import {app,config} from 'store';
import {GQL} from '@src/apollo';
import {observer} from 'mobx-react';


/**
 *  子组件部分引入
 */
import WidgetPartOne from './widgetPartOne';
import WidgetPartTwo from './widgetPartTwo';
import WidgetPartThree from './widgetPartThree';
import WidgetPartFour from './widgetPartFour';
import { View } from "react-native";
import { ApolloClient } from 'apollo-boost';

let client:ApolloClient<unknown>; //旧后端client

const Profile = (props: any) => {

    const [userinfo,setuserinfo] = useState({...app.me});

    useEffect(() => {
        client = app.client;
        getData();
        let focus = props.navigation.addListener('focus',() => {
            getData();
        });
        return () => focus()
    }, [app.client]);

    function getData(){
        if(client && app.me.id){
            client.query({
                query: GQL.UserQuery,
                variables: app.me.id
            }).then(rs => {
                let user = rs.data.user ?? {};
                setuserinfo({...user})
            }).catch(err => {

            })
        }
    }


    return (
        <Page.PageCleared safe >
            <View style={{ flex: 1, alignItems: 'center' }}>

                <WidgetPartOne navigation={props.navigation} userinfo={userinfo}/>

                <WidgetPartTwo navigation={props.navigation} userinfo={userinfo}/>

                <WidgetPartThree navigation={props.navigation} />

                <WidgetPartFour navigation={props.navigation} userinfo={userinfo}/>

            </View>
        </Page.PageCleared>
    );
};

export default observer(Profile);
