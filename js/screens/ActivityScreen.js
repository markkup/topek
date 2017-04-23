import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { Header, AvatarImage, ToolbarTextButton, ToolbarButton } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"
import Styles, { Color, Dims } from "../styles"

import AlertsPage from "./AlertsPage"
import HistoryPage from "./HistoryPage"
import ScrollableTabView, { DefaultTabBar } from "react-native-scrollable-tab-view"

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
  }
}

@connectprops(Props)
export default class ActivityScreen extends Component {

  static navigationOptions = {
    header: (navigation, defaultHeader) => ({
      visible: false
    })
  }

  render() {
    return (
      <View style={Styles.screen}>
        <ScrollableTabView
          renderTabBar={() => <DefaultTabBar tabStyle={{paddingBottom:0}} style={{borderWidth:StyleSheet.hairlineWidth}} />}
          tabBarBackgroundColor={Color.white}
          tabBarActiveTextColor={Color.tint}
          tabBarInactiveTextColor={Color.subtle}
          tabBarUnderlineStyle={{backgroundColor:Color.tint,height:2}}
          style={{paddingTop: 16}}>
          <AlertsPage tabLabel="Alerts" />
          <HistoryPage tabLabel="History" />
        </ScrollableTabView>
      </View>
    )
  }
}

let styles = StyleSheet.create({
})
