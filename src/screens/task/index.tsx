import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { PageContainer } from 'components';
import { Theme, PxFit } from 'utils';
import { observer, app, config } from 'store';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import TaskCenter from './components/TaskCenter';
import Participation from './components/Participation';
import ScrollTabBar from './components/ScrollTabBar';

export default observer(props => {
    const { me } = app;
    const [page, setPage] = useState(0);
    const onChangeTab = useCallback(() => {
        props.navigation.navigate('任务');
        setPage(1);
    }, [setPage]);

    useEffect(() => {
        setPage(0);
    }, [me.id]);

    const renderTabItem = useCallback(
        ({ name, isActive, page }) => {
            const changeTextStyle = isActive ? styles.activeTextStyle : styles.inactivityTextStyle;
            return (
                <View style={styles.tabItem}>
                    <Text style={changeTextStyle}>{name}</Text>
                    {me.is_first_stock && page === 1 && <View style={styles.badge} />}
                </View>
            );
        },
        [me],
    );

    return (
        <PageContainer hiddenNavBar contentViewStyle={styles.contentViewStyle} white>
            <ScrollableTabView
                prerenderingSiblingsNumber={Infinity}
                page={page}
                onChangeTab={e => setPage(e.i)}
                renderTabBar={props => (
                    <ScrollTabBar
                        {...props}
                        hiddenUnderLine={true}
                        tabWidth={PxFit(80)}
                        style={styles.tabBarStyle}
                        activeTextStyle={styles.activeTextStyle}
                        inactivityTextStyle={styles.inactivityTextStyle}
                        renderTabItem={renderTabItem}
                    />
                )}>
                <TaskCenter tabLabel="任务" />
                {!config.disableAd && (
                    <Participation tabLabel="分红" onChangeTab={onChangeTab} inCurrentPage={page === 1} />
                )}
            </ScrollableTabView>
        </PageContainer>
    );
});

const styles = StyleSheet.create({
    activeTextStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(20),
        fontWeight: 'bold',
    },
    badge: {
        width: PxFit(8),
        height: PxFit(8),
        borderRadius: PxFit(4),
        backgroundColor: Theme.secondaryColor,
        margin: PxFit(4),
    },
    contentViewStyle: { marginTop: Theme.statusBarHeight },
    inactivityTextStyle: {
        color: Theme.defaultTextColor,
        fontSize: PxFit(17),
    },
    tabBarStyle: {
        justifyContent: 'flex-start',
    },
    tabItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
});
