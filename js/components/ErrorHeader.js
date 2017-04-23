import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/SimpleLineIcons"
import Styles, { Color, Dims } from "../styles"

export default class ErrorHeader extends Component {
  render() {
    if (!this.props.text || this.props.text == "")
      return null;
    return (<View style={styles.container}>
      <Icon name="exclamation" color={"white"} size={16} style={styles.icon} />
      <Text style={styles.text}>
        {this.props.text}
      </Text>
    </View>)
  }
}

ErrorHeader.propTypes = {
  text: React.PropTypes.string.isRequired
}

let styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    padding: 10,
    flexDirection: "row"
  },
  icon: {
    paddingRight: 5
  },
  text: {
    flex: 1,
    color: "white"
  }
});