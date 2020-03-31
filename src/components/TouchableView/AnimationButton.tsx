/*
 * @flow
 * created by wyk made in 2019-01-29 20:42:52
 */
'use strict';

import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, ViewStyle } from 'react-native';
import { Mutation } from 'react-apollo';
import { PxFit, Theme, ISAndroid } from '../../utils';

function AnimationButton(props: {
    mutation: any,
    variables: any,
    onCompleted: Function,
    onError: Function,
    waitingSpinnerSize?: number | 'small' | 'large',
    waitingSpinnerColor?: string | null | undefined,
    // ...TouchableWithoutFeedback.propTypes,
    loading: boolean,
    mutate: any,
    style: ViewStyle,
    others: any,
    disabled: any,
    children: any
}) {

    const variables = {};
    // const onCompleted = result => result;
    // const onError = () => null;
    const waitingSpinnerSize = 'small';
    const waitingSpinnerColor = '#fff';
    const activeOpacity = 0.6;

    const [loading, setloading] = useState(false);

    const onCompleted = (result: any) => {
        if (props.onCompleted instanceof Function) {
            props.onCompleted(result);
        }
        setloading(false);
    };

    const onError = (error: any) => {
        if (props.onError instanceof Function) {
            props.onError();
        } else {
            Toast.show({ content: '哎呀，出问题啦' });
        }
        setloading(false);
    };

    const onPress = (mutate: Function) => {
        setloading(true);
        mutate();
    };

    return (
        <Mutation mutation={props.mutation} variables={variables} onCompleted={onCompleted} onError={onError}>
            {props.mutate = () => {
                return (
                    <View style={props.style}>
                        <TouchableOpacity
                            {...props.others}
                            onPress={() => onPress(props.mutate)}
                            style={[styles.button, props.disabled && { opacity: 0.6 }]}
                            disabled={loading || props.disabled}
                        >
                            {loading ? (
                                <View style={styles.indicator}>
                                    <ActivityIndicator color={waitingSpinnerColor} size={waitingSpinnerSize} />
                                </View>
                            ) : (
                                    props.children
                                )}
                        </TouchableOpacity>
                    </View>
                );
            }}
        </Mutation>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default AnimationButton;