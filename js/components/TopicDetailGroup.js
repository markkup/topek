import React, { Component } from "react"
import { StyleSheet, View, Text, ActivityIndicator } from "react-native"
import { ToolbarButton } from "./"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class TopicDetailGroup extends Component {
  render() {
    let title = null;
    if (this.props.title) {
      title = (
        <View>
          <Text style={{color:Color.darkGray}}>{this.props.title.toUpperCase()}</Text>
        </View>
      )
    }

    let button = null;
    if (this.props.onRefresh) {
      if (this.props.refreshing) {
        button = <ActivityIndicator style={{position:"absolute",top:10,right:13}} />
      }
      else {
        button = <ToolbarButton name={"refresh"} onPress={() => this.props.onRefresh()} style={{position:"absolute",top:2,right:2}} size={20} tint={Color.darkGray} />
      }
    }

    return (
      <View style={{backgroundColor: Color.white}}>  
        <View style={{paddingHorizontal: 15,paddingVertical: 10,borderTopWidth: 0}}>
          {title}
          {this.props.children}
        </View>
        {button}
        {this.props.border && <View style={styles.gutter} />}
      </View>
    )
  }
}

TopicDetailGroup.propTypes = {
  border: React.PropTypes.bool
}

TopicDetailGroup.defaultProps = {
  border: true
}

let styles = StyleSheet.create({
})
