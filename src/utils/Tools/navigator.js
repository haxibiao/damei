/*
 * @flow
 * created by wyk made in 2019-02-02 09:25:09
 */
import { NavigationActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';

let rootNavigation = null;

export function setRootNavigation(navigation: any) {
    console.log('setRootNavigation navigation', navigation);
    rootNavigation = navigation;
}

export const navigate = (name: string, params?: object, action?: any) => {
    const navigateAction = CommonActions.navigate({
        name,
        params,
        action,
    });
    rootNavigation.dispatch(navigateAction);
};

export const replace = (name: string, params?: object, action?: any) => {
    const navigateAction = CommonActions.reset({
        index: 1,
        routes: [
            {
                name: 'Main',
            },
            {
                name: 'Withdraws',
            },
        ],
    });
    rootNavigation.dispatch(navigateAction);
};
