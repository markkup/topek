import React, { Component } from "react"
import { StyleSheet, View, Text } from "react-native"
import Styles, { Color, Dims, TextSize } from "../styles"

import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons"

export default class TopicDetailField extends Component {
  render() {
    let title = null;
    if (this.props.title) {
      title = (
        <View>
          <Text style={{color:Color.darkGray,fontWeight:"500"}}>{this.props.title.toUpperCase()}</Text>
        </View>
      )
    }
    return (
      <View style={{flex:1,flexDirection:"row",marginBottom:5,marginTop:5}}>
        {this.props.icon ? 
        <SimpleLineIcon name={this.props.icon} size={16} color={Color.subtle} style={{marginRight: 10,marginTop:2}} /> :
        null}
        <View style={{flex:1}}>
          <Text style={{color:Color.slate,fontSize:TextSize.normal}}>{this.props.text}</Text>
          {this.props.subtext && <Text style={{color:Color.subtle,fontSize:TextSize.tiny}}>{this.props.subtext}</Text>}
        </View>
      </View>
    )
  }
}

TopicDetailField.propTypes = {
  title: React.PropTypes.string,
  text: React.PropTypes.string.isRequired,
  subtext: React.PropTypes.string,
  icon: React.PropTypes.string,
}

TopicDetailField.defaultProps = {
}

let styles = StyleSheet.create({
})
