import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { ToolbarButton } from "."

export default class ToolbarButtonExample extends Component {
  render() {
    return (
      <View>
      {this._renderBar(["arrow-back", "add", "more-horz", "more-vert", "checkbox", "contact", "close"])}
      {this._renderBar(["heart", "heart-outline", "options", "clock", "location-pin", "layers", "calendar", "plus"])}
      </View>
    )
  }

  _renderBar(btns) {
    var btnList = btns.map((name, i) => {
      return (
        <View key={i} style={{width:40,height:40,backgroundColor:"#FFF",marginRight:2}}>
          <ToolbarButton name={name} onPress={() => {}} />
        </View>
      )
    })
    return (
      <View style={{flexDirection:"row",height:44,paddingVertical:2,paddingHorizontal:2,borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:"#999",borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:"#999"}}>
        {btnList}
      </View>
    )
  }
}

