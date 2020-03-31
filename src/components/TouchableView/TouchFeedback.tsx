import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import NetInfo from "@react-native-community/netinfo";

function TouchFeedback(props: {
    authenticated?: boolean,
    style?: any,
    activeOpacity?: number,
    navigation?: any,
    onPress?: any,
    disabled?: any,
    checkNetwork?: any,
    key?: any,
    children:any
}) {
    const authenticated = props?.authenticated ?? false;
    const activeOpacity = props?.activeOpacity ?? 0.6;

    const middleware = (callback: any, navigation: any) => {
        return () => {
            if (TOKEN) {
                callback && callback();
            } else {
                navigation.navigate("Login");
            }
        };
    };

    const checkNetwork = (submit: any) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected) {
                submit && submit();
            } else {
                Toast.show({ content: "网络错误,请检查是否连接网络" });
            }
        });
    };

    const buildProps = () => {
        let onPress = props?.onPress ?? null;
        let navigation = props?.navigation ?? null;
        let style = props.style;
        let disabled = props.disabled;

        if (authenticated && navigation) {
            onPress = middleware(onPress, navigation);
        }

        if (props.checkNetwork) {
            onPress = checkNetwork(onPress);
        }

        if (disabled) {
            if (style instanceof Array) {
                style = [
                    {
                        opacity: 0.6
                    },
                    ...style
                ];
            } else {
                style = [
                    {
                        opacity: 0.6
                    },
                    style
                ];
            }
        }
        return { onPress, disabled, style };
    };
    let p = buildProps();

    return <TouchableOpacity onPress={p.onPress} disabled={p.disabled} style={p.style}  >{props.children}</TouchableOpacity>;
}

export default TouchFeedback;
