import React, { Component } from 'react';

import { StyleSheet, View, ViewStyle } from 'react-native';

function Center(props: {
    style?: ViewStyle,
}) {
    let style = props.style;

    return <View style={[styles.button, style]} />;
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Center;