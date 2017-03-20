import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { NavbarButton } from "../components"
import { Field, FieldGroup, TouchableField } from "react-native-fields"
import Styles, { Color, Dims } from "../styles"

export default class ChooseReminderScreen extends Component {

  static navigationOptions = {
    title: "Reminder",
    header: (navigation, defaultHeader) => ({
      ...defaultHeader
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      amount: props.navigation.state.params.amount,
      period: props.navigation.state.params.period
    }
  }

  render() {
    return (
      <View style={Styles.screenFields}>
        <FieldGroup>
          <TouchableField text="None" tint={"black"} onPress={() => this._choose()} accessory={this._getAccessory()} />
        </FieldGroup>
        <FieldGroup>
          <TouchableField text="5 minutes before" tint={"black"} onPress={() => this._choose(5, "minutes", "5 minutes before")} accessory={this._getAccessory(5, "minutes")} />
          <TouchableField text="15 minutes before" tint={"black"} onPress={() => this._choose(15, "minutes", "15 minutes before")} accessory={this._getAccessory(15, "minutes")} />
          <TouchableField text="30 minutes before" tint={"black"} onPress={() => this._choose(30, "minutes", "30 minutes before")} accessory={this._getAccessory(30, "minutes")} />
          <TouchableField text="1 hour before" tint={"black"} onPress={() => this._choose(1, "hours", "1 hour before")} accessory={this._getAccessory(1, "hours")} />
          <TouchableField text="2 hours before" tint={"black"} onPress={() => this._choose(2, "hours", "2 hours before")} accessory={this._getAccessory(2, "hours")} />
          <TouchableField text="1 day before" tint={"black"} onPress={() => this._choose(1, "days", "1 day before")} accessory={this._getAccessory(1, "days")} />
          <TouchableField text="2 days before" tint={"black"} onPress={() => this._choose(2, "days", "2 days before")} accessory={this._getAccessory(2, "days")} />
          <TouchableField text="1 week before" tint={"black"} onPress={() => this._choose(1, "weeks", "1 week before")} accessory={this._getAccessory(1, "weeks")} />
        </FieldGroup>
      </View>
    )
  }

  _getAccessory(amount, period) {
    return (amount == this.state.amount && period == this.state.period) ? "check" : "";
  }

  _choose(amount, period, text) {
    let details = null;
    if (amount !== undefined) {
      details = {
        amount: amount,
        period: period,
        text: text
      }
    }
    this.props.navigation.state.params.onComplete(details);
  }
}

let styles = StyleSheet.create({
})
