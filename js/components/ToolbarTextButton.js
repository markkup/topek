import React, { Component } from "react"
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator } from "react-native"
import Styles, { Color, Dims } from "../styles"

export default class ToolbarTextButton extends Component {
  render() {
    if (this.props.disabled)
      return this._renderText();
    else if (this.props.working)
      return this._renderSpinner();
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        {this._renderText()}
      </TouchableOpacity>)
  }

  _renderSpinner() {
    return (
      <ActivityIndicator style={styles.spinner} />
    )
  }

  _renderText() {
    const weight = this.props.active ? "600" : "400";
    const color = this.props.disabled ? "#ccc" : this.props.tint;
    return (
      <Text style={[this.props.style, styles.text, {color: color, fontWeight: weight}]}>{this.props.title}</Text>
    )
  }
}

ToolbarTextButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  tint: React.PropTypes.string,
  active: React.PropTypes.bool,
  disabled: React.PropTypes.bool,
  working: React.PropTypes.bool
}

ToolbarTextButton.defaultProps = {
  tint: Color.tint,
  active: false,
  disabled: false,
  working: false
}

let styles = StyleSheet.create({
  text: {
    fontSize: 18,
    marginLeft: 8,
    marginRight: 8
  },
  spinner: {
    marginLeft: 12,
    marginRight: 12,
    marginTop: 2
  }
})
