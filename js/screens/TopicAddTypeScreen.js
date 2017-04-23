import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, ScrollView, Keyboard } from "react-native"
import { ToolbarTextButton, ErrorHeader, ToolbarButton } from "../components"
import { Form, SelectField, Field, FieldGroup } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.updateNewTopic = this.bindEvent(TopicActions.updateNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddScreen extends Component {

  static navigationOptions = {
    title: "Choose Type",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      backTitle: " ",
      //left: <ToolbarButton name="close" onPress={() => state.params.leftClick()} />,
    })
  }

  constructor(props){
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setParams({
      leftClick: () => this._cancel()
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <ScrollView style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form">
        
          <FieldGroup>
            <SelectField text="Announcement" icon="volume-2" accessory={true} onPress={() => this._saveType("announcement")} />
            <SelectField text="Event" icon="calendar" accessory={true} onPress={() => this._saveType("event")} />
            <SelectField text="Poll" icon="like" accessory={true} onPress={() => this._saveType("poll")} />
          </FieldGroup>

        </Form>

      </ScrollView>
    )
  }

  _cancel() {
    Keyboard.dismiss()
    this.props.navigation.goBack(null)
  }

  async _saveType(type) {
    await this.props.updateNewTopic("type", type);
    if (type == "announcement") {
      this.props.navigation.navigate("TopicAddMembers")
    }
    else if (type == "event") {
      this.props.navigation.navigate("TopicAddEventDetails")
    }
    else if (type == "poll") {
      this.props.navigation.navigate("TopicAddPollDetails")
    }
  }
}

let styles = StyleSheet.create({
})
