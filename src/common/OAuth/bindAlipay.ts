import { AlipayAuth } from 'react-native-alipay-auth';
import { AlipayAppID, Scheme } from '@app/app.json';

// import { bindAlipayFailedTrack, bindAlipaySucceedTrack, bindAlipayTrack } from '../track';
import { Loading } from 'components';
import { GQL } from 'apollo';
import { app } from 'store';
import { Tools } from 'utils';

export const getAlipayAuthCode = (props: { callback: Function }) => {
    const { callback } = props;
    //    bindAlipayTrack();
    AlipayAuth({
        AppId: AlipayAppID,
        Scheme: Scheme,
    })
        .then((code: any) => {
            console.log('code', code);
            callback && callback(code);
        })
        .catch((error) => {
            Toast.show({
                content: '请登录或尝试更新支付宝再授权',
            });
            // bindAlipayFailedTrack(error);
        });
};

export const bindAlipay = (props: { authCode: any; onFaild: Function }) => {
    const { authCode, onFaild } = props;
    app.newClient
        .mutate({
            mutation: GQL.OAuthBindMutation,
            variables: {
                code: authCode,
                oauth_type: 'alipay',
            },
            errorPolicy: 'all',
            refetchQueries: () => [
                {
                    query: GQL.UserAccountSecurityQuery,
                    variables: { id: app.me.id },
                },
                {
                    query: GQL.UserWalletQuery,
                    variables: { id: app.me.id },
                },
            ],
        })
        .then((data: any) => {
            // Loading.hide();
            console.log('data', data);
            Toast.show({
                content: '绑定成功',
            });
            // bindAlipaySucceedTrack();
            Tools.replace('Withdraws');
        })
        .catch((error: { toString?: any; error?: any }) => {
            console.log('error', error);
            // Loading.hide();
            onFaild && onFaild();
            Toast.show({
                content: error.toString().replace(/Error: GraphQL error: /, ''),
            });
            // bindAlipayFailedTrack(error.toString());
        });
};
