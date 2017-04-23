
import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { NavbarButton } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { AuthActions } from "../state/actions"
import { Field, FieldGroup, TouchableField } from "react-native-fields"
import Styles, { Color, Dims, TextSize } from "../styles"

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
  }
}

@connectprops(Props)
export default class TestScreen extends Component {

  static navigationOptions = {
    title: "Test Screen",
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      right: <NavbarButton title="Done" onPress={() => navigation.goBack(null)} />
    })
  }

  render() {
    return (
      <View style={Styles.screen}>
        <FieldGroup>
          <TouchableField text="Test Something" onPress={() => {}} />
        </FieldGroup>
      </View>
    )
  }
}

let styles = StyleSheet.create({
})
