import React, { Component } from 'react';
import {
    StyleSheet,
    Platform,
    StatusBar,
    View,
    Text,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Iconfont from '../Iconfont';
import {observer} from 'mobx-react';
import { PxFit, Theme, NAVBAR_HEIGHT } from '../../utils';


const TouchButton = (props) => {

    const navigation = useNavigation();

    function backButtonPress(){
        const backButtonPress  = props.backButtonPress;
        if (backButtonPress) {
            backButtonPress();
        } else {
            if (navigation) navigation.goBack();
        }
    };
    return (
        <TouchableOpacity
            activeOpacity={1}
            onPress={backButtonPress}
            style={{
                flex: 1,
                width: Theme.navBarContentHeight,
                justifyContent: 'center',
            }}>
            <Iconfont name="zuojiantou" color={'#333'} size={PxDp(22)} />
        </TouchableOpacity>
    )
}

@observer
class NavigatorBar extends Component {

    static defaultProps = {
        ...View.defaultProps,
        isTopNavigator: false,
        hidden: false,
        animated: true,
        statusBarStyle: 'dark-content',
        statusBarColor: 'rgba(0,0,0,0)',
    };

    constructor(props) {
        super(props);
        this.screenWidth = Dimensions.get('window').width;
        this.state = {
            barOpacity: new Animated.Value(props.hidden ? 0 : 1),
        };
    }

    buildProps() {
        let { isTopNavigator, navBarStyle, title, titleStyle, titleViewStyle, sideViewStyle, ...others } = this.props;

        // build style
        navBarStyle = {
            backgroundColor: Theme.navBarBackground,
            position: 'absolute',
            left: 0,
            right: 0,
            height: PxDp(Theme.NAVBAR_HEIGHT + Theme.statusBarHeight),
            paddingTop: PxDp(Theme.statusBarHeight),
            paddingLeft: PxDp(Theme.itemSpace),
            paddingRight: PxDp(Theme.itemSpace),
            borderBottomWidth: Theme.minimumPixel,
            borderBottomColor: Theme.navBarSeparatorColor,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            ...navBarStyle,
        };

        // build titleViewStyle
        titleViewStyle = {
            position: 'absolute',
            top: PxDp(Theme.statusBarHeight),
            left: PxDp(Theme.itemSpace),
            right: PxDp(Theme.itemSpace),
            bottom: 0,
            opacity: this.state.barOpacity,
            flexDirection: 'row',
            alignItems: 'center',
            ...titleViewStyle,
        };

        // build leftView and rightView style
        sideViewStyle = {
            opacity: this.state.barOpacity,
            alignSelf: 'stretch',
            justifyContent: 'center',
            ...sideViewStyle,
        };

        if (isTopNavigator) {
            titleStyle = {
                fontWeight: 'bold',
                textAlign: 'left',
                ...titleStyle,
            };
        }

        // convert string title to NavigatorBar.Title
        if (typeof title === 'string') {
            title = (
                <Text style={[styles.titleText, titleStyle]} numberOfLines={1}>
                    {title}
                </Text>
            );
        }

        return {
            isTopNavigator,
            navBarStyle,
            title,
            titleViewStyle,
            sideViewStyle,
            ...others,
        };
    }

    renderLeftView = () => {
        const { isTopNavigator, leftView, backButtonColor } = this.props;
        let left;
        if (isTopNavigator || leftView) {
            left = leftView;
        } else {
            left = <TouchButton backButtonPress={this.props.backButtonPress}/>;
        }
        return left;
    };

    onLayout(e) {
        if (e.nativeEvent.layout.height != this.barHeight) {
            this.barHeight = e.nativeEvent.layout.height;
        }
        const { width } = Dimensions.get('window');
        if (width != this.screenWidth) {
            this.screenWidth = width;
            this.forceUpdate();
        }
        this.props.onLayout && this.props.onLayout(e);
    }

    render() {
        const {
            navBarStyle,
            animated,
            statusBarStyle,
            statusBarColor,
            statusBarHidden,
            title,
            titleViewStyle,
            sideViewStyle,
            rightView,
            showShadow,
            ...others
        } = this.buildProps();
        return (
            <Animated.View
                style={[navBarStyle, showShadow && styles.shadow]}
                {...others}
                onLayout={e => this.onLayout(e)}
                elevation={showShadow ? 10 : 0}>
                <StatusBar
                    translucent={true}
                    backgroundColor={statusBarColor}
                    barStyle={statusBarStyle}
                    animated={animated}
                    hidden={statusBarHidden}
                />
                <Animated.View style={titleViewStyle}>{title}</Animated.View>
                <Animated.View style={sideViewStyle}>{this.renderLeftView()}</Animated.View>
                <Animated.View style={sideViewStyle}>{rightView}</Animated.View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#b4b4b4',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 1,
    },
    titleText: {
        color: '#666',
        flex: 1,
        fontSize: PxDp(19),
        textAlign: 'center',
    },
});

export default NavigatorBar;
