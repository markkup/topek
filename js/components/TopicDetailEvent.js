import React, { Component } from "react"
import { StyleSheet, View, Text } from "react-native"
import { ActionButton, TopicDetailGroup, TopicDetailField } from "./"
import Datetime from "../lib/datetime"
import Layout from "../lib/Layout"
import Styles, { Color, Dims, TextSize } from "../styles"

import MapView from "react-native-maps"

import TopicDetailBase from "./TopicDetailBase"

const RESPONSE_NO = 0;
const RESPONSE_YES = 1;
const RESPONSE_MAYBE = 2;

export default class TopicDetailEvent extends TopicDetailBase {

  constructor(props) {
    super(props);
    this.key = "event";
    this.state = {
      response: this.getIndividualResults().response,
      rsvp: {
        yes: 0,
        no: 0,
        maybe: 0,
        waiting: 0
      }
    }
  }

  init() {
    super.init();
    this._loadResults();
  }

  updateWithIndividualResults(results) {
    super.updateWithIndividualResults(results);
    this.setState({
      response: results.response
    })
  }

  updateWithCollectedResults(results) {
    super.updateWithCollectedResults();

    let rsvp = {
      yes: 0,
      no: 0,
      maybe: 0,
      waiting: 0
    }

    let replied = 0;

    if (results) {
      results.map(s => {
        if (s.results) {
          s.results.map(r => {
            if (r.type && r.type == this.key) {
              if (r.response == 0)
                rsvp.no++;
              else if (r.response == 1)
                rsvp.yes++;
              else if (r.response == 2)
                rsvp.maybe++;
              replied++;
            }
          })
        }
      })
    }

    rsvp.waiting = this.props.topic.memberCount - replied;

    this.setState({
      rsvp: rsvp
    })
  }

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
    if (!this.isOwner && detail.ack) {
      actions = (
        <View style={{flexDirection: "row"}}>
          <ActionButton 
            title={"I'm Going"} 
            tint={this.state.response == RESPONSE_YES ? Color.tint : Color.gray}
            onPress={() => this._submitResponse(RESPONSE_YES)}
            style={{marginTop: 15, marginLeft: 0, marginBottom: 5}} />
          <ActionButton 
            title={"Maybe"} 
            tint={this.state.response == RESPONSE_MAYBE ? Color.tint : Color.gray}
            onPress={() => this._submitResponse(RESPONSE_MAYBE)}
            style={{marginTop: 15, marginLeft: 5, marginBottom: 5}} />
          <ActionButton 
            title={"No"} 
            tint={this.state.response == RESPONSE_NO ? Color.tint : Color.gray}
            onPress={() => this._submitResponse(RESPONSE_NO)}
            style={{marginTop: 15, marginLeft: 5, marginBottom: 5}} />
        </View>
      )
    }

    let resultsPanel = null;
    if (this._canShowResults) {
      let width = (Layout.window.width - 20) / 5;
      let loading = this.isCollectingResults ? "-" : null
      resultsPanel = (
        <TopicDetailGroup title="RSVP" border={true} refreshing={!this.hasCollectedResults} onRefresh={() => this._loadResults(true)}>
          <View style={{flexDirection: "row",paddingTop:8,paddingBottom:8}}>
            <View style={{width:width}}>
              <Text style={{fontSize:34,fontWeight:"600",color:Color.slate}}>{loading || this.state.rsvp.yes}</Text>
              <Text style={{fontSize:11,fontWeight:"600",color:Color.darkGray}}>{"ACCEPTED"}</Text>
            </View>
            <View style={{width:width}}>
              <Text style={{fontSize:34,fontWeight:"600",color:Color.slate}}>{loading || this.state.rsvp.no}</Text>
              <Text style={{fontSize:11,fontWeight:"600",color:Color.darkGray}}>{"DECLINED"}</Text>
            </View>
            <View style={{width:width}}>
              <Text style={{fontSize:34,fontWeight:"600",color:Color.slate}}>{loading || this.state.rsvp.maybe}</Text>
              <Text style={{fontSize:11,fontWeight:"600",color:Color.darkGray}}>{"MAYBE"}</Text>
            </View>
            <View style={{width:width}}>
              <Text style={{fontSize:34,fontWeight:"600",color:Color.slate}}>{loading || this.state.rsvp.waiting}</Text>
              <Text style={{fontSize:11,fontWeight:"600",color:Color.darkGray}}>{"NO REPLY"}</Text>
            </View>
          </View>
        </TopicDetailGroup>
      )
    }

    return (
      <View>
        <TopicDetailGroup>
          <TopicDetailField text={when} icon="clock" />
          {where}
          {actions}
        </TopicDetailGroup>
        {resultsPanel}
      </View>
    )
  }

  get _canShowResults() {
    return (this.props.detail.ack && (this.isOwner || this.props.detail.publicResults));
  }

  _loadResults(force) {
    if (this._canShowResults) {
      // kick-off collection
      this.collectResults(force);
    }
  }

  async _submitResponse(response) {

    // update our state to highlight the button
    this.setState({ 
      response: response 
    })

    // submit our response
    await this.submit({
      response: response
    })

    // load our results
    this._loadResults();
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
