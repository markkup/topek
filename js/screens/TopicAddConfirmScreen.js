import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions, NavActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.dismissModal = this.bindEvent(NavActions.dismissModal);
    props.updateNewTopic = this.bindEvent(TopicActions.updateNewTopic);
    props.saveNewTopic = this.bindEvent(TopicActions.saveNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddConfirmScreen extends Component {

  static navigationOptions = {
    title: "Confirm",
    header: ({ state }, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarTextButton title="Save" active={true} onPress={() => state.params.rightClick()} />,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
    this.state = {
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      rightClick: () => this._save()
    });
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
            
          </FieldGroup>

        </Form>

      </View>
    )
  }

  async _save() {
    await this.props.saveNewTopic();
    this.props.dismissModal("TopicAddStack")
  }
}

let styles = StyleSheet.create({
})
