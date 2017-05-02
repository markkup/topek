import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { NavbarButton } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import Styles, { Color, Dims, TextSize } from "../styles"

import IonIcon from "react-native-vector-icons/Ionicons"

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
  }
}

@connectprops(Props)
export default class AlertsPage extends Component {

  render() {
    return (
      <ScrollView style={Styles.screenFields}>
        {this._renderActivity("Task: 'Return stage equipment' is due tomorrow", "2/8", "1:33p", true)}
        {this._renderActivity("Event: Golf outing on Saturday (rain or shine)", "3/1", "5:45a", false)}
      </ScrollView>
    )
  }

  _renderActivity(text, date, time, isDave) {

    const { avatar } = this.props.user;

    let avatarSource = require("../assets/images/circle-user-man-512.png")
    if (avatar.valid && isDave) {
      avatarSource = {
        uri: avatar.url
      }
    }

    return (
      <View style={styles.row}>
        <IonIcon name="ios-alert" size={21} color={Color.tint} />
        <Text style={{flex:1, fontSize:TextSize.small, marginLeft: 12}}>{text}</Text>
        {/*<View style={{flexDirection: "column", alignItems: "center", marginLeft: 20}}>
          <Text style={{fontSize: 11, color: "#555"}}>{date}</Text>
          <Text style={{fontSize: 11, color: "#555"}}>{time}</Text>
        </View>*/}
      </View>
    )
  }
}

let styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    paddingLeft: Dims.horzPadding,
    paddingRight: Dims.horzPadding,
    backgroundColor: Color.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator,
  },
})
