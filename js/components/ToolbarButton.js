import React, { Component } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import Styles, { Color, Dims } from "../styles"

import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons"
import IonIcon from "react-native-vector-icons/Ionicons"
import EvilIcon from "react-native-vector-icons/EvilIcons"
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import Octicon from "react-native-vector-icons/Octicons"

export default class ToolbarButton extends Component {
  render() {

    var icon;

    switch (this.props.name) {
      case "arrow-back": {
        icon = (<IonIcon name="ios-arrow-back" size={30} color={this.props.tint} style={[styles.icon, {marginLeft:-2,paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "add": {
        icon = (<IonIcon name="ios-add" size={40} color={this.props.tint} style={[styles.icon, {marginTop:0,marginLeft:0,paddingTop:0,height:40}, this.props.styleImage]} />);
        break;
      }
      case "more":
      case "more-horz": {
        icon = (<MaterialCommunityIcon name="dots-horizontal" size={30} color={this.props.tint} style={[styles.icon, {marginLeft:-1,paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "more-vert": {
        icon = (<MaterialCommunityIcon name="dots-vertical" size={30} color={this.props.tint} style={[styles.icon, {marginLeft: 0,paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "checkbox": {
        icon = (<IonIcon name="ios-checkbox-outline" size={30} color={this.props.tint} style={[styles.icon, {paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "contact": {
        icon = (<IonIcon name="ios-contact" size={30} color={this.props.tint} style={[styles.icon, {paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "close": {
        icon = (<EvilIcon name="close" size={34} color={this.props.tint} style={[styles.icon, {marginLeft: 0}, this.props.styleImage]} />);
        break;
      }
      case "heart": {
        icon = (<IonIcon name="ios-heart" size={30} color={this.props.tint} style={[styles.icon, {paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "heart-outline": {
        icon = (<IonIcon name="ios-heart-outline" size={30} color={this.props.tint} style={[styles.icon, {paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      case "options": {
        icon = (<IonIcon name="ios-options" size={25} color={this.props.tint} style={[styles.icon, {marginLeft: 0}, this.props.styleImage]} />);
        break;
      }
      case "history": {
        icon = (<MaterialIcon name="history" size={30} color={this.props.tint} style={[styles.icon, {paddingTop:5}, this.props.styleImage]} />);
        break;
      }
      default: {
        icon = (<SimpleLineIcon name={this.props.name} size={25} color={this.props.tint} style={[styles.icon, this.props.styleImage]} />);
        break;
      }
    }

    return (
      <TouchableOpacity style={[styles.touchable, this.props.style]} underlayColor="#3C5EAE" onPress={this.props.onPress}>
        <View style={styles.container}>
            {icon}
        </View>
      </TouchableOpacity>
    )
  }
}

ToolbarButton.propTypes = {
  name: React.PropTypes.string,
  size: React.PropTypes.number,
  tint: React.PropTypes.string,
  onPress: React.PropTypes.func
}

ToolbarButton.defaultProps = {
  name: "user",
  tint: Color.tint,
  onPress: null
}

var styles = StyleSheet.create({
  touchable: {

  },
  container: {
    width: 40,
    height: 40,
    padding: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    paddingTop: 7,
    marginLeft: -2
  }
})
