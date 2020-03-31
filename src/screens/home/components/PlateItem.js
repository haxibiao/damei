/* eslint-disable react-native/sort-styles */
/*
 * @flow
 * created by wyk made in 2019-03-19 12:59:55
 */

import React, { Component } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, FlatList } from 'react-native';
import { Iconfont, TouchFeedback } from 'components';
import { Theme, PxFit, SCREEN_WIDTH } from 'utils';

import { BoxShadow } from 'react-native-shadow';

const shadowOpt = {
    width: SCREEN_WIDTH - PxFit(Theme.itemSpace * 2),
    color: '#eee',
    border: PxFit(10),
    radius: PxFit(10),
    opacity: 0.5,
    x: 0,
    y: 0,
    style: {
        marginTop: PxFit(Theme.itemSpace),
        marginHorizontal: PxFit(Theme.itemSpace),
    },
};

class PlateItem extends Component {
    constructor(props) {
        super(props);
    }

    onPress = () => {
        const { category, navigation } = this.props;
        navigation.navigate('Answer', { category, question_id: null });
    };

    render() {
        const { category, navigation } = this.props;
        const { icon, name, description, children } = category;
        return (
            <BoxShadow setting={Object.assign({}, shadowOpt, { height: children.length ? PxFit(110) : PxFit(80) })}>
                <View style={styles.container}>
                    <TouchFeedback authenticated navigation={navigation} style={styles.mainItem} onPress={this.onPress}>
                        <Image source={{ uri: icon }} style={styles.cover} />
                        <View style={{ flex: 1, marginLeft: PxFit(10) }}>
                            <Text style={styles.name}>{name}</Text>
                            <Text style={styles.description} numberOfLines={1}>
                                {description}
                            </Text>
                        </View>
                    </TouchFeedback>
                    {children.length > 0 && (
                        <FlatList
                            data={children}
                            keyExtractor={(item, index) =>
                                item.id ? item.id.toString() + Date.now() : index.toString()
                            }
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ marginTop: PxFit(10) }}
                            renderItem={({ item, index }) => (
                                <TouchFeedback
                                    authenticated
                                    navigation={navigation}
                                    style={styles.subItem}
                                    onPress={() => navigation.navigate('Answer', { category: item, question_id: null })}
                                    >
                                    <Text style={styles.subItemText}>{item.name}</Text>
                                </TouchFeedback>
                            )}
                        />
                    )}
                </View>
            </BoxShadow>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: PxFit(Theme.itemSpace),
        borderRadius: PxFit(5),
        justifyContent: 'center',
        overflow: 'hidden',
    },
    mainItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cover: {
        width: PxFit(46),
        height: PxFit(46),
        borderRadius: PxFit(5),
        backgroundColor: '#fff',
    },
    name: {
        fontSize: PxFit(17),
        fontWeight: 'bold',
        color: Theme.defaultTextColor,
    },
    description: {
        fontSize: PxFit(13),
        color: Theme.secondaryTextColor,
        paddingTop: PxFit(5),
    },
    subItem: {
        justifyContent: 'center',
        alignItems: 'center',
        height: PxFit(24),
        minWidth: PxFit(80),
        paddingHorizontal: PxFit(10),
        marginRight: PxFit(10),
        borderRadius: PxFit(11),
        borderWidth: PxFit(0.5),
        borderColor: '#FFDFB3',
        backgroundColor: '#FFF3E0',
    },
    subItemText: {
        fontSize: PxFit(12),
        color: '#FFB74D',
    },
});

export default PlateItem;
