import React, { Component } from 'react';

import { StyleSheet, View, Text, TextStyle } from 'react-native';

function SafeText(props: {
    shadowText?: boolean,
    children: string,
    style?: TextStyle,
}) {
    const { children, style, shadowText, ...other } = props;

    return (
        <Text {...other} style={[style, shadowText && styles.textShadow]}>
            {children}
        </Text>
    );

}

const styles = StyleSheet.create({
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
});

export default SafeText;