import React, { useEffect, useState } from 'react';
import { Page } from '../../widgets';
import { app, config,observer} from 'store';
import { GQL } from '@src/apollo';

/**
 *  子组件部分引入
 */
import WidgetPartOne from './widgetPartOne';
import WidgetPartTwo from './widgetPartTwo';
import WidgetPartThree from './widgetPartThree';
import WidgetPartFour from './widgetPartFour';
import { ScrollView } from 'react-native';
import { ApolloClient } from 'apollo-boost';

let client: ApolloClient<unknown>; //旧后端client

const Profile = observer((props: any) => {
  
    const [userinfo, setuserinfo] = useState({ ...app.me });

    useEffect(() => {
        client = app.client;
        getData();
        let focus = props.navigation.addListener('focus', () => {
            getData();
        });
        return () => focus();
    }, [app.client]);

    function getData() {
        if (client && app.me.id) {
            client
                .query({
                    query: GQL.UserQuery,
                    variables: app.me.id,
                    fetchPolicy:"network-only"
                })
                .then((rs) => {
                    console.log('rs', rs)
                    let user = rs.data.user ?? {};
                    setuserinfo({ ...user });
                    app.updateUserCache(user);
                })
                .catch((err) => {});
        } else {
            setuserinfo({})
        }
    }
    console.log('Profile app.login', userinfo)
    return (
        <Page.PageCleared safe>
            <ScrollView>
                <WidgetPartOne navigation={props.navigation} userinfo={userinfo} />
                {
                    !config.disableAd&& <WidgetPartTwo navigation={props.navigation} userinfo={userinfo} />
                }       
                <WidgetPartThree navigation={props.navigation} />

                <WidgetPartFour navigation={props.navigation} userinfo={userinfo} />
            </ScrollView>
        </Page.PageCleared>
    );
});

export default Profile;
