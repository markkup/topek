import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight, Keyboard } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Validate from "../lib/validate"
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
    title: "New Topic",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      left: <ToolbarTextButton title="Cancel" onPress={() => state.params.leftClick()} />,
      right: <ToolbarTextButton title="Next" active={true} disabled={!state.params || !state.params.valid} onPress={() => state.params.rightClick()} />,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
    this.state = {
      title: "",
      description: ""
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      leftClick: () => this._cancel(),
      rightClick: () => this._next(),
      valid: false
    });

    setTimeout(() => this.refs.form.refs.subject.refs.title.focus(), 800);
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form"
          onChange={this._handleFormChange.bind(this)}>
        
          <FieldGroup title="Subject" ref="subject">

            <InputField 
              ref="title"
              multiline={true}
              height={80}
            />

          </FieldGroup>

          <FieldGroup title="Description">

            <InputField 
              ref="description"
              multiline={true}
              height={160}
              placeholder="Optional" 
            />

          </FieldGroup>

        </Form>

      </View>
    )
  }

  _handleFormChange(data) {
    this.setState({
      title: data.title,
      description: data.description
    })
    this.props.navigation.setParams({valid: Validate.isNotEmpty(data.title)});
  }

  async _next() {
    await this.props.updateNewTopic("name", this.state.title);
    await this.props.updateNewTopic("description", this.state.description);

    Keyboard.dismiss()
    this.props.navigation.navigate("TopicAddType")
  }

  _cancel() {
    Keyboard.dismiss()
    this.props.navigation.goBack(null)
  }
}

let styles = StyleSheet.create({
})
