/*
 * @flow
 * wyk created it in 2018-12-04 15:46:29
 * tip: default statusBar is transparent
 */

import { Platform, Dimensions, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Mixes from './Mixes';
const { width, height } = Dimensions.get('window');

let HAS_NOTCH = DeviceInfo.hasNotch();
let HAS_HOME_INDICATOR = false;
let HOME_INDICATOR_HEIGHT = 0;

/*
 *  适配iPhone 11系列产品 刘海屏  临时做法.  等react-native-device-info 更新.
 */
const deviceID = DeviceInfo.getDeviceId();
if (['iPhone12,1', 'iPhone12,3', 'iPhone12,5'].includes(deviceID)) {
    HAS_NOTCH = true;
    HOME_INDICATOR_HEIGHT = 26;
}

if (Platform.OS === 'ios' && HAS_NOTCH) {
    HAS_HOME_INDICATOR = true;
    HOME_INDICATOR_HEIGHT = 26;
}

const Theme = {
    ...Mixes,
    navBarContentHeight: 44,
    HAS_NOTCH,
    HAS_HOME_INDICATOR,
    HOME_INDICATOR_HEIGHT,
    // statusBarHeight: statusBarHeight,

    get isLandscape() {
        return Dimensions.get('window').width > Dimensions.get('window').height;
    },

    get statusBarHeight() {
        if (Platform.OS === 'ios') {
            return this.isLandscape ? 0 : HAS_NOTCH ? 34 : 20;
        } else if (Platform.OS === 'android') {
            return StatusBar.currentHeight || 48;
        }
        return this.isLandscape ? 0 : 20;
    },
};

export default Theme;
