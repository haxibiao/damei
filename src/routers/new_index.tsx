import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStackNavigation from './AppStackNavigation';
import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { Config, Tools } from 'utils';
//白天,黑夜模式 主题(颜色)
import { DayTheme, NightTheme } from './Theme';

export default function Nav() {
    const schema = useColorScheme();

    return (
        <AppearanceProvider>
            <NavigationContainer theme={schema === 'dark' ? NightTheme : DayTheme} ref={Tools.setRootNavigation}>
                <AppStackNavigation />
            </NavigationContainer>
        </AppearanceProvider>
    );
}
