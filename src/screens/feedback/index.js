/*
 * @flow
 * created by wangyukun made in 2019-03-18 11:44:07
 */
"use strict";

import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import { Theme, SCREEN_WIDTH, PxFit } from "utils";

import {
  TabBarHeader,
  PageContainer,
  ScrollTabBar,
  TouchFeedback,
  Iconfont,
} from "components";
import { config } from "store";

import Feedback from "./components/Feedback";
import FeedbackList from "./components/FeedbackList";

import ScrollableTabView from "react-native-scrollable-tab-view";

import { Page } from "../../widgets";

class index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { navigation } = this.props;
    return (
      <Page.PageCleared safe>
        <ScrollableTabView
          renderTabBar={(props) => (
            <ScrollTabBar
              {...props}
              tabUnderlineWidth={PxFit(50)}
              underLineColor={Theme.primaryColor}
            />
          )}
        >
          <Feedback navigation={navigation} tabLabel="反馈建议" />
          {!config.disableAd && (
            <FeedbackList navigation={navigation} tabLabel="问题中心" />
          )}
        </ScrollableTabView>
        <View
          style={[
            styles.backButton,
            { top: Page.CONSTANTS.StatusBarHeight + 2 },
          ]}
        >
          <TouchFeedback activeOpacity={1} onPress={() => navigation.goBack()}>
            <Iconfont
              name="left"
              color={Theme.defaultTextColor}
              size={PxFit(21)}
            />
          </TouchFeedback>
        </View>
      </Page.PageCleared>
    );
  }
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",

    left: 0,
    width: Theme.navBarContentHeight,
    height: Theme.navBarContentHeight,
    justifyContent: "center",
    paddingLeft: PxFit(Theme.itemSpace),
  },
});

export default index;
