import React, { Component } from "react"
import { StyleSheet, View, Image } from "react-native"
import CachedImage from "react-native-cached-image"
import { Platform } from "react-native"
import Styles, { Color, Dims } from "../styles"

export default class TopicImage extends Component {
  render() {

    const { image } = this.props;

    let darkBg = Platform.OS === "ios" ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.5)";
    let lightBg = Platform.OS === "ios" ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.5)";

    let imgSource = {uri: image.url};

    const style = {
      width: this.props.size, 
      height: this.props.size, 
      borderRadius: 4,
      backgroundColor: this.props.background == "dark" ? darkBg : lightBg,
      padding: 0,
      flexDirection: "row"
    }

    return (
      <View style={[style, this.props.style]}>
        <CachedImage
          source={imgSource}
          style={[style, this.props.style, styles.icon]}
        />
      </View>
    )
  }
}

TopicImage.propTypes = {
  image: React.PropTypes.object.isRequired,
  size: React.PropTypes.number,
  background: React.PropTypes.string
}

TopicImage.defaultProps = {
  size: 140,
  background: "light" // dark
}

let styles = StyleSheet.create({
  icon: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "transparent"
  }
})
