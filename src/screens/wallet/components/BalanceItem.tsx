import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Row } from 'components';
import { Theme, PxFit } from 'utils';
const BalanceItem = props => {
    const { item } = props;

    return (
        <View style={styles.item}>
            <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ fontSize: PxFit(15), color: Theme.defaultTextColor }}>{item.remark}</Text>
                <Text
                    style={{
                        fontSize: PxFit(20),
                        color: item.amount > 0 ? Theme.primaryColor : Theme.secondaryColor,
                    }}>
                    {item.amount > 0 ? '+' + item.amount : item.amount}
                </Text>
            </Row>
            <Row style={{ justifyContent: 'space-between', marginTop: PxFit(10) }}>
                <Text style={{ fontSize: PxFit(12), color: Theme.subTextColor }}>{item.created_at}</Text>
                <Text style={{ fontSize: PxFit(12), color: Theme.subTextColor }}>剩余余额: {item.balance}</Text>
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        padding: PxFit(Theme.itemSpace),
        borderBottomColor: Theme.borderColor,
        borderBottomWidth: PxFit(1),
    },
});

export default BalanceItem;
