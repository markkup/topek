import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, DescriptionField, FieldGroup, TouchableField, SwitchField, DatePickerField, SelectField, KeyboardAwareScrollView } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Validate from "../lib/validate"
import Datetime from "../lib/datetime"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.saveClick = this.bindEvent(TopicActions.add);
    props.updateNewTopic = this.bindEvent(TopicActions.updateNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddPollDetailsScreen extends Component {

  static navigationOptions = {
    title: "Poll Details",
    header: ({ state }, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarTextButton title="Next" active={true} disabled={!state.params || !state.params.valid} onPress={() => state.params.rightClick()} />,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
    this.state = {
      type: "poll",
      question: "",
      answers: [],
      publicResults: false,
      required: false,
      expires: Datetime().startOf("hour").add(7, "days").toDate(),
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
        rightClick: () => this._save(),
        valid: false
    });

    setTimeout(() => this.refs.form.refs.questions.refs.question.focus(), 800);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.question != this.state.question || prevState.answers != this.state.answers) {
      let valid = Validate.isNotEmpty(this.state.question) && this.state.answers.length > 0;
      this.props.navigation.setParams({valid: valid});
    }
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <KeyboardAwareScrollView keyboardShouldPersistTaps="always" style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form"
          onChange={this._handleFormChange.bind(this)}>
        
          <FieldGroup ref="questions" title="QUESTION">
            <InputField 
              ref="question"
              value={this.state.question}
              multiline={true}
              height={60}
            />
          </FieldGroup>

          {this.state.answers.length > 0 ?
          <FieldGroup ref="answers" title="ANSWERS" link="Edit >" onPressLink={() => this._editAnswers()}>
            {this.state.answers.map((ans, i) => {
              return <Field key={i} text={(i + 1) + ". " + ans} />
            })}
          </FieldGroup> :
          <FieldGroup ref="answers" title="ANSWERS">
            <TouchableField text="Add..." accessory={"arrow"} onPress={() => this._editAnswers()} />
          </FieldGroup>
          }
        
          <FieldGroup ref="options" title="OPTIONS">
            <SwitchField label="Users can see results" ref="publicResults" />
            <SwitchField label="Require users to complete" ref="required" />
            <DatePickerField ref="expires"
              label="Ends"
              value={this.state.expires}
              dateTimeFormat={(value, mode) => this._formatPicker("startDate", value, mode)}
              mode={"datetime"} />
          </FieldGroup>

        </Form>

      </KeyboardAwareScrollView>
    )
  }

  _handleFormChange(data) {
    this.setState({
      question: data.question,
      expires: data.expires,
      publicResults: data.publicResults,
      required: data.required
    })
  }

  _editAnswers() {
    this.props.navigation.navigate("ChooseAnswers", {
      ...this.state,
      onChanged: (val) => {
        this.setState({answers: val});
      }
    })
  }

  _formatPicker(which, value, mode) {
    return Datetime(value).format("LLL")
  }

  async _save() {
    const { navigate } = this.props.navigation;
    await this.props.updateNewTopic("details", this.state);
    navigate("TopicAddMembers")
  }
}

let styles = StyleSheet.create({
})
