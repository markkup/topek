import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"

export default class Toolbar extends Component {
  render() {
    const align = this.props.align == "right" ? "flex-end" : "flex-start";
    return (
      <View style={[styles.container, {justifyContent:align}, this.props.style]}>
        {this.props.children}
      </View>
    )
  }
}

Toolbar.propTypes = {
  align: React.PropTypes.string
}

Toolbar.defaultProps = {
  align: "left"
}

var styles = StyleSheet.create({
  container: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  }
})
