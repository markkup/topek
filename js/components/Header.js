import React, { Component, PropTypes } from "react"
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import Toolbar from "./Toolbar"
import Styles, { Color, Dims } from "../styles"

export default class Header extends Component {

  render() {

    const toolbar = this.props.children;
    const indicator = <ActivityIndicator color={Color.tint} style={{backgroundColor:"white",marginBottom:5,marginRight:8}} />
    const tools = this.props.isLoading ? indicator : toolbar;
    const subtitle = (this.props.subtitle) ? <Text style={styles.subText}>{this.props.subtitle}</Text> : null;
    const titleMarginTop = (this.props.subtitle) ? 8 : 0;

    return (
      <View style={styles.component}>
        <View style={styles.content}>
          <View style={styles.title}>
            <Text
              numberOfLines={1} 
              ellipsizeMode="tail" 
              style={[styles.titleText, {marginTop: titleMarginTop}]}>{this.props.title}</Text>
            {subtitle}
          </View>
          <View style={styles.toolsContainer}>
            <View style={styles.tools}>
              {tools}
            </View>
          </View>
        </View>
        <View style={styles.custom}>
          {this._renderCustomView()}
        </View>
        <View style={styles.border} />
      </View>

    )
  }

  _renderCustomView() {
    return this.props.custom;
  }

  _renderTools() {
    if (this.props.isLoading) {
      return (
        <ActivityIndicator 
          color="black"
          style={{backgroundColor:"#FFF"}}
          />
      )
    }
    else {
      return (
        <Toolbar>
          {this.props.children}
        </Toolbar>
      )
    }
  }
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  subtitle: React.PropTypes.string,
  isLoading: React.PropTypes.bool
}

Header.defaultProps = {
  subtitle: null,
  isLoading: false
}

var styles = StyleSheet.create({
  component: {
    flexDirection: "column",
    backgroundColor: Color.white
  },
  content: {
    flexDirection: "row",
    marginTop: 40,
    paddingTop: 0,
    paddingBottom: 10,
    paddingLeft: 12,
    paddingRight: 12
  },
  title: {
    flex: 1,
  },
  titleText: {
    fontSize: 40,
    fontWeight: "800",
    color: Color.black,
    
  },
  subText: {
    position: "absolute",
    top: 0,
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: 12,
  },
  toolsContainer: {
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  tools: {
    flexDirection: "row",
  },
  custom: {
    paddingLeft: Dims.horzPadding,
    paddingRight: Dims.horzPadding,
  },
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(225, 225, 225, 255)"
  }
});
