'use strict';
import React, { Component, useState } from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';
import { Theme, PxFit } from '../../utils';

function PlaceholderImage(props: {
    style?: ImageStyle,
    resizeMode?: 'cover' | 'contain',
    source?: any,
    onLoad: any,
    onLayout: any,
    onError: any,
}) {

    let style: ImageStyle = props?.style ?? {};
    let resizeMode = props?.resizeMode ?? "cover";
    const source = props.source;

    const [error, setError] = useState(false);

    const _onLoad = () => {
        const { onLoad } = props;
        onLoad && onLoad();
    };

    const _onError = () => {
        setError(true);
        const { onError } = props;
        onError && onError();
    };

    const _onLayout = () => {
        const { onLayout } = props;
        onLayout && onLayout();

    };

    console.log("error: " + error);
    console.log("source: " + source);
    console.log("source.uri: " + source.uri);
    // if (error || !source || source.uri || !source.uri.includes('http')) {

    //     console.log("难道我改崩了");

    //     return <View style={[styles.container, style]} />;
    // }
    // console.log("error: " + error);


    return (
        <View style={[styles.container, style]}>
            {
                (error || !source || !source.uri || !source.uri.includes('http')) ? <View style={[styles.container, style]} /> : (
                    <Image
                        source={source}
                        resizeMode={resizeMode}
                        style={styles.content}
                        onLoad={_onLoad}
                        onError={_onError}
                        onLayout={_onLayout}
                    />
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Theme.groundColour,
        overflow: 'hidden'
    },
    content: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    }
});

export default PlaceholderImage;