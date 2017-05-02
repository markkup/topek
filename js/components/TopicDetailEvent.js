import React, { Component } from "react"
import { StyleSheet, View } from "react-native"
import { ActionButton, TopicDetailGroup, TopicDetailField } from "./"
import Datetime from "../lib/datetime"
import Styles, { Color, Dims, TextSize } from "../styles"

import MapView from "react-native-maps"

import TopicDetailBase from "./TopicDetailBase"

export default class TopicDetailEvent extends TopicDetailBase {
  render() {
    const { detail } = this.props;
    
    let start = Datetime(detail.startDate);
    let end = Datetime(detail.endDate);
    let when = "";
    if (detail.allDay == true) {
      when = ""
      if (start.isSame(end, "day"))
        when += start.format("LL")
      else
        when += start.format("LL") + " to " + end.format("LL")
    }
    else {
      if (start.isSame(end, "day"))
        when += start.format("LLL") + " to " + end.format("h:mm A")
      else
        when += start.format("LLL") + " to " + end.format("LLL")
    }
    if (when) when = when.replace(/:00/g, "")
    if (when) when = when.replace(" " + new Date().getFullYear(), "")

    let where = null;
    if (detail.location) {
      where = (
        <View key={key}>
          <TopicDetailField text={detail.location.name} subtext={detail.location.address} icon="location-pin" />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              initialRegion={{
                latitude: detail.location.geo.lat,
                longitude: detail.location.geo.lng,
                latitudeDelta: detail.location.viewport.lat,
                longitudeDelta: detail.location.viewport.lng,
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: detail.location.geo.lat,
                  longitude: detail.location.geo.lng
                  }}
                title={detail.location.name}
                description={detail.location.address}
              />
            </MapView>
          </View>
        </View>
      )
    }
    else if (detail.locationName && detail.locationName != "") {
      where = (
        <View title="Where" key={key}>
          <TopicDetailField text={detail.locationName} icon="location-pin" />
        </View>
      )
    }

    let actions = null;
    if (detail.ack) {
      actions = (
        <View style={{flexDirection: "row"}}>
          <ActionButton 
            title={"I'm Going"} 
            tint={Color.gray}
            onPress={() => {}}
            style={{marginTop: 15, marginLeft: 0, marginBottom: 5}} />
          <ActionButton 
            title={"Maybe"} 
            tint={Color.gray}
            onPress={() => {}}
            style={{marginTop: 15, marginLeft: 5, marginBottom: 5}} />
          <ActionButton 
            title={"No"} 
            tint={Color.gray}
            onPress={() => {}}
            style={{marginTop: 15, marginLeft: 5, marginBottom: 5}} />
        </View>
      )
    }

    return (
      <View key={key}>
        <TopicDetailGroup>
          <TopicDetailField text={when} icon="clock" />
          {where}
          {actions}
        </TopicDetailGroup>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  mapContainer: {
    height: 130,
    marginTop: 16,
    marginBottom: 8,
    borderColor: Color.subtle,
    borderRadius: 4
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130
  }
})
