import React, { Component } from "react"
import { StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"
import Styles, { Color, Dims } from "../styles"

export default class TabIcon extends Component {
  render() {
    const { icon, focused } = this.props

    return (<Icon 
      name={focused ? "ios-" + icon : "ios-" + icon + "-outline"} 
      size={28} 
      style={focused ? {color: Color.tint} : {color: Color.subtle}}
    />)
  }
}

TabIcon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  focused: React.PropTypes.bool.isRequired
}

let styles = StyleSheet.create({
})
