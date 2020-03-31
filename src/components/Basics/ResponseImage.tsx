'use strict';
import React, { Component, useState, useEffect } from 'react';
import { Image, View, StyleSheet, ImageStyle } from 'react-native';


function ResponseImage(props: {
    uri: string,
    width?: number,
    height?: number,
    max?: { width: number, height: number },
    resizeMode?: 'cover' | 'contain',
    style?: ImageStyle,
}) {

    const uri = props.uri;
    let style: ImageStyle = props?.style ?? {};
    let resizeMode = props?.resizeMode ?? "cover";

    const [calc_width, set_calc_width] = useState();
    const [calc_height, set_calc_height] = useState();

    // style = {
    //     width: calc_width,
    //     height: calc_height,
    //     ...style
    // };

    useEffect(() => {
        let { max, width: image_width, height: image_height } = props;
        Image.getSize(uri, (width, height) => {
            if (image_width && !image_height) {
                set_calc_width(image_width);
                set_calc_height(height * (image_width / width));
            } else if (!image_width && image_height) {
                set_calc_width(width * (image_height / height));
                set_calc_height(image_height);
            } else if (max) {
                if (width >= height) {
                    set_calc_width(max.width);
                    set_calc_height(height * (max.width / width));
                } else {
                    set_calc_width(width * (max.height / height));
                    set_calc_height(max.height);
                }
            } else {
                set_calc_width(width);
                set_calc_height(height);
            }
        }, (error) => {
            console.log(error);

        })

    })


    return (
        <View style={style}>
            <Image source={{ uri }} style={style} resizeMode={resizeMode} />
        </View>
    )
}


export default ResponseImage;