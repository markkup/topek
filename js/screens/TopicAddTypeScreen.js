import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.saveClick = this.bindEvent(TopicActions.add);
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
            <TouchableField text="Announcement" icon="flag" accessory={true} onPress={() => this._saveType()} />
            <TouchableField text="Event" icon="calendar" accessory={true} onPress={() => this._saveType()} />
          </FieldGroup>

        </Form>

      </View>
    )
  }

  async _saveType() {
    const { navigate } = this.props.navigation;
    //if (await this.props.saveClick(this.state.title))
    //  this.props.navigation.goBack(null);
    navigate("TopicAddTypeDetails")
  }
}

let styles = StyleSheet.create({
})
