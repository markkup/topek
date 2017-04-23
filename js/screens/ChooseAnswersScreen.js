import React, { Component } from "react"
import { StyleSheet, View, Text, TouchableHighlight, TouchableOpacity, TextInput } from "react-native"
import { NavbarButton, ToolbarTextButton } from "../components"
import { Field, FieldGroup, TouchableField } from "react-native-fields"
import Validate from "../lib/validate"
import Styles, { Color, Dims, TextSize } from "../styles"
import Ionicon from "react-native-vector-icons/Ionicons"
import SortableListView from "react-native-sortable-listview"

export default class ChooseAnswersScreen extends Component {

  static navigationOptions = {
    title: "Answers",
    header: (navigation, defaultHeader) => ({
      ...defaultHeader
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      question: props.navigation.state.params.question,
      answers: props.navigation.state.params.answers,
      text: ""
    }
  }

  componentDidMount() {
    setTimeout(() => this.refs.answerField.focus(), 800);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.answers != this.state.answers) {
      this.props.navigation.state.params.onChanged(this.state.answers);
    }
  }

  render() {
    return (
      <View style={Styles.screenFields}>
        <View style={styles.addView}>
          <TextInput 
            ref="answerField"
            placeholder="Type answer..." 
            onChangeText={(text) => this._handleTextChange(text)}
            value={this.state.text}
            enablesReturnKeyAutomatically={true}
            onSubmitEditing={() => this._addAnswer()}
            style={styles.answerField} />
          <ToolbarTextButton 
            title="Add" 
            onPress={() => this._addAnswer()} 
            disabled={Validate.isEmpty(this.state.text)} 
            style={styles.addButton} />
        </View>
        <SortableListView
          style={{flex: 1}}
          keyboardShouldPersistTaps={"always"}
          data={this.state.answers}
          onRowMoved={e => this._moveRow(e.from, e.to)}
          renderRow={row => this._renderRow(row)}
          sortRowStyle={styles.rowActive}
        />
      </View>
    )
  }

  _renderRow(row) {
    return (
      <TouchableHighlight
        underlayColor={"#eee"}
        delayLongPress={50}
        style={styles.row}
        {...this.props.sortHandlers}
      >
        <View style={{flexDirection:"row"}}>
          <Text style={styles.rowText}>{row}</Text>
          <TouchableOpacity onPress={() => this._removeAnswer(row)}>
            <Ionicon name="ios-close-circle-outline" size={28} color={Color.tint} />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    )
  }

  _addAnswer() {
    let arr = [...this.state.answers, this.state.text];
    this.setState({
      answers: arr,
      text: ""
    })
    setTimeout(() => this.refs.answerField.focus(), 100);
  }

  _removeAnswer(answer) {
    let arr = this.state.answers.filter(a => { return a != answer });
    this.setState({
      answers: arr
    })
  }

  _handleTextChange(text) {
    this.setState({
      text: text
    })
  }

  _moveRow(fromIndex, toIndex) {
    let arr = this.state.answers.slice(0);
    let element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    this.setState({
      answers: arr
    })
  }
}

let styles = StyleSheet.create({
  addView: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator
  },
  answerField: {
    flex: 1,
    fontSize: TextSize.normal,
    borderRadius: 6,
    backgroundColor: Color.lightGray,
    height: 30,
    paddingVertical: 4,
    paddingHorizontal: 10
  },
  addButton: {
    marginTop: 4
  },
  row: {
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    backgroundColor: Color.white, 
    borderBottomWidth: 1, 
    borderColor: '#eee'
  },
  rowText: {
    flex: 1,
    fontSize: TextSize.normal,
    marginTop: 4
  },
  rowActive: {
    borderColor: Color.tint,
    borderWidth: 2
  }
})
