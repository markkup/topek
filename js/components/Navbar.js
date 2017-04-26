import React, { Component } from "react"
import { StyleSheet, View, Text } from "react-native"
import Styles, { Color, Dims, TextSize } from "../styles"

import { Toolbar, ToolbarButton, ToolbarButtonExample, Header, AvatarImage, TopicImage } from "../components"

export default class Navbar extends Component {
  render() {

    return (
      <View style={[styles.container, this.props.style]}>
        <Toolbar style={{marginTop:20,paddingHorizontal:4}}>
          {this.props.leftButton}
          <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
            {this.props.children ? this.props.children :
            <Text style={styles.captionText}>{this.props.title}</Text>}
          </View>
          {this.props.rightButton}
        </Toolbar>
      </View>
    )
  }
}

Navbar.propTypes = {
  leftButton: React.PropTypes.element,
  rightButton: React.PropTypes.element,
  title: React.PropTypes.string
}

Navbar.defaultProps = {
  leftButton: null,
  rightButton: null,
  title: ""
}

let styles = StyleSheet.create({
  container: {
    height: 66,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator
  },
  captionText: {
    fontSize: 16,
    fontWeight: "600"
  }
})
