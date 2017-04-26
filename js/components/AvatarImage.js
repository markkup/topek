import React, { Component } from "react"
import { StyleSheet, View, Text, Image, Animated } from "react-native"
import CachedImage from "react-native-cached-image"
import { Platform } from "react-native"
import Styles, { Color, Dims } from "../styles"
import IonIcon from "react-native-vector-icons/Ionicons"

export default class AvatarImage extends Component {
  render() {

    const { source, user } = this.props;

    let darkBg = Platform.OS === "ios" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.5)";
    let lightBg = Platform.OS === "ios" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)";

    let initials = null;
    let avatarSource = source;
    if (avatarSource == null && user != null) {
      if (user.avatar && user.avatar.valid) {
        avatarSource = {
          uri: user.avatar.url
        }
      }
      else if (user.name) {
        let tokens = user.name.split(" ");
        initials = "";
        tokens.map(t => initials += t[0]);
      }
    }

    const style = {
      width: this.props.size, 
      height: this.props.size, 
      borderRadius: Platform.OS === "ios" ? this.props.size/2 : 150,
      backgroundColor: this.props.background == "dark" ? darkBg : lightBg,
      padding: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center"
    }

    let color = this.props.background == "dark" ? "#666" : "#fff";
    if (this.props.color != null) {
      color = this.props.color;
    }

    if (initials) {

      const initialsStyle = {
        fontSize: this.props.size/2,
        color: color
      }

      return (
        <View style={[style, styles.initialsContainer, this.props.style]}>
          <Text style={[styles.initials, initialsStyle]}>{initials}</Text>
        </View>)
    }

    // adjustments for default icon
    let size = this.props.size * 1.2;
    let marginTop = this.props.size * 0.1;

    return (
      <View style={[style, this.props.style]}>
        {avatarSource ? <CachedImage
          source={avatarSource}
          style={[style, this.props.style, styles.icon]}
        /> : 
        <IonIcon name="ios-contact" size={size} color={color}  style={{marginTop: marginTop}} />}
      </View>
    )
  }
}

AvatarImage.propTypes = {
  source: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.number
  ]),
  user: React.PropTypes.object,
  size: React.PropTypes.number,
  background: React.PropTypes.string,
  color: React.PropTypes.string,
}

AvatarImage.defaultProps = {
  source: null,
  user: null,
  size: 35,
  background: "light", // dark
  color: null
}

let styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "transparent"
  },
  initialsContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  initials: {
    color: "#666"
  }
})
