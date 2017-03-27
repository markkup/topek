import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { Header, AvatarImage, ToolbarTextButton, ToolbarButton } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"
import Styles, { Color, Dims } from "../styles"

import IonIcon from "react-native-vector-icons/Ionicons"

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
      <View style={Styles.screenFields}>
        <Header title="Alerts" subtitle=" ">
          {/*<TouchableOpacity onPress={() => navigate("TopicAddStack")} style={{marginRight: 10,marginBottom:0}}>
            <IonIcon name="ios-add" size={40} color={"#fff"} />
          </TouchableOpacity>*/}
          <ToolbarButton name="layers" tint={Color.tint} onPress={() => this.props.navigation.navigate("History")} />
        </Header>
        <ScrollView style={{flex:1,marginTop:-8}}>
          <FieldGroup>
            {this._renderActivity("Task: 'Return stage equipment' is due tomorrow", "2/8", "1:33p", true)}
            {this._renderActivity("Event: Golf outing on Saturday (rain or shine)", "3/1", "5:45a", false)}
          </FieldGroup>
        </ScrollView>
      </View>
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
      <Field>
        <View style={{flexDirection: "row"}}>
          <IonIcon name="md-alert" size={25} color={Color.tint} />
          <Text style={{flex:1, fontSize:18, marginLeft: 12}}>{text}</Text>
          {/*<View style={{flexDirection: "column", alignItems: "center", marginLeft: 20}}>
            <Text style={{fontSize: 11, color: "#555"}}>{date}</Text>
            <Text style={{fontSize: 11, color: "#555"}}>{time}</Text>
          </View>*/}
        </View>
      </Field>
    )
  }
}

let styles = StyleSheet.create({
})
