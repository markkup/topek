import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, SelectField, Field, FieldGroup, TouchableField } from "../react-native-fieldsX"
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
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form">
        
          <FieldGroup>
            {/*<TouchableField text="Announcement" icon="flag" accessory={true} onPress={() => this._saveType()} />*/}
            <SelectField text="Announcement" icon="volume-2" accessory={true} onPress={() => this._saveType("announcement")} />
            <SelectField text="Event" icon="calendar" accessory={true} onPress={() => this._saveType("event")} />
          </FieldGroup>

        </Form>

      </View>
    )
  }

  async _saveType(type) {
    await this.props.updateNewTopic("type", type);
    if (type == "announcement") {
      this.props.navigation.navigate("TopicAddMembers")
    }
    else {
      this.props.navigation.navigate("TopicAddTypeDetails")
    }
  }
}

let styles = StyleSheet.create({
})
