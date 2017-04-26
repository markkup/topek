import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions, NavActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.newTopic = this.state.topics.newTopic;
    props.updateError = this.state.topics.updateError;
    props.dismissModal = this.bindEvent(NavActions.dismissModal);
    props.saveNewTopic = this.bindEvent(TopicActions.saveNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddConfirmScreen extends Component {

  static navigationOptions = {
    title: "Confirm",
    header: ({ state }, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarTextButton title="Save" active={true} working={state.params && state.params.working} onPress={() => state.params.rightClick()} />,
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
      working: false,
      rightClick: () => this._save()
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    const { newTopic } = this.props;

    let text = "";
    if (newTopic) {
      text = "Adding a new " + newTopic.type.toUpperCase() + " topic titled '" + newTopic.name + "'. ";
      text += "The new topic is assigned to " + newTopic.memberIds.length + " member(s).";
    }

    return (
      <View style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form">
        
          <FieldGroup>
            
            <Field text={text} />

          </FieldGroup>

        </Form>

      </View>
    )
  }

  async _save() {
    this.props.navigation.setParams({working: true});
    await this.props.saveNewTopic();
    this.props.navigation.dismiss()
  }
}

let styles = StyleSheet.create({
})
