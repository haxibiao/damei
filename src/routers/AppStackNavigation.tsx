import React from 'react';
import { Animated, Easing } from 'react-native';
import { createStackNavigator, TransitionPresets, CardStyleInterpolators } from '@react-navigation/stack';
import AppBottomTabNavigation from './AppBottomTabNavigation';
import { Routers } from './RoutersCenter';
import { Config, Tools } from 'utils';
const Stack = createStackNavigator();

import { DataCenter, observer } from '../data';
// import SplashPage from './SplashPage';
// import LoginPage from '../screen/login/LoginPage';

function AppStackNavigation() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
        >
            <>
                <Stack.Screen options={{ headerShown: false }} name={'Main'} component={AppBottomTabNavigation} />
                {Routers.map((router: any) => {
                    return (
                        <Stack.Screen
                            key={router.name}
                            options={router.options}
                            name={router.name}
                            component={router.widget}
                        />
                    );
                })}
            </>
        </Stack.Navigator>
    );
}
export default observer(AppStackNavigation);
