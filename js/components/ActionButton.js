import React, { Component } from "react"
import { StyleSheet, View, TouchableOpacity, Text } from "react-native"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class ActionButton extends Component {
  render() {
    let { width, disabled, onPress, style, tint, color, title } = this.props; 
    let bg = disabled ? Color.gray : tint;
    return (
      <TouchableOpacity style={[style, {width:width}]} disabled={disabled} onPress={() => onPress()}>
        <View style={[styles.container, {backgroundColor: bg}]}>
          <Text style={[styles.text,{color:color}]}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

ActionButton.propTypes = {
  onPress: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  tint: React.PropTypes.string,
  color: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  working: React.PropTypes.bool,
  width: React.PropTypes.number
}

ActionButton.defaultProps = {
  tint: Color.tint,
  color: Color.white,
  disabled: false,
  working: false,
  width: 100
}

let styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 10
  },
  text: {
    fontWeight: "600", 
    fontSize: TextSize.normal,
    textAlign: "center"
  }
})
