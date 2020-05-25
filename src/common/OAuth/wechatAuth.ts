import * as WeChat from 'react-native-wechat-lib';

interface Props {
    callback?: Function;
    onFailed?: Function;
}

export const getWechatAuthCode = (props: Props) => {
    const { callback, onFailed } = props;
    const scope = 'snsapi_userinfo';
    const state = 'skit_wx_login';
    WeChat.isWXAppInstalled()
        .then((isSupported: any) => {
            if (isSupported) {
                WeChat.sendAuthRequest(scope, state)
                    .then((responseCode: any) => {
                        callback && callback(responseCode.code, props);
                    })
                    .catch(() => {
                        Toast.show({ content: '微信身份信息获取失败，请检查微信是否登录' });
                        onFailed && onFailed();
                    });
            } else {
                Toast.show({ content: '未安装微信或当前微信版本较低' });
                onFailed && onFailed();
            }
        })
        .catch(() => {
            Toast.show({ content: '获取微信安装状态失败' });
            onFailed && onFailed();
        });
};
