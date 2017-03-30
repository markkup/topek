import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, DescriptionField, FieldGroup, TouchableField, SwitchField, DatePickerField, SelectField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Datetime from "../lib/datetime"
import Styles, { Color, Dims } from "../styles"

import MapView from "react-native-maps"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.saveClick = this.bindEvent(TopicActions.add);
    props.updateNewTopic = this.bindEvent(TopicActions.updateNewTopic);
  }
}

@connectprops(Props)
export default class TopicAddTypeDetailsScreen extends Component {

  static navigationOptions = {
    title: "Enter Details",
    header: ({ state }, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarTextButton title="Next" active={true} onPress={() => state.params.rightClick()} />,
      backTitle: " "
    })
  }

  constructor(props){
    super(props);
    this.state = {
      type: "event",
      allDay: false,
      startDate: Datetime().startOf("hour").toDate(),
      endDate: Datetime().startOf("hour").add(1, "hours").toDate(),
      reminder: null,
      location: null,
      locationName: "",
      ack: true 
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
        rightClick: () => this._save()
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form"
          onChange={this._handleFormChange.bind(this)}>
        
          <FieldGroup ref="when" title="WHEN">
            <SwitchField label="All-day" ref="allDay" />
            <DatePickerField ref="starts"
              label="Starts"
              value={this.state.startDate}
              dateTimeFormat={(value, mode) => this._formatPicker("startDate", value, mode)}
              mode={this.state.allDay ? "date" : "datetime"} />
            <DatePickerField ref="ends"
              label="Ends"
              value={this.state.endDate}
              dateTimeFormat={(value, mode) => this._formatPicker("endDate", value, mode)}
              minimumDate={this.state.startDate}
              mode={this.state.allDay ? "date" : "datetime"} />
            <SelectField text="Reminder" value={this.state.reminder ? this.state.reminder.text : "None"} onPress={() => this._chooseReminder()} />
          </FieldGroup>

          {this._renderLocationFields()}

        </Form>

      </View>
    )
  }

  _handleFormChange(data) {

    // if our start date is changing, let's update our end date
    if (data.starts != this.state.startDate) {
      // if the previous start and end days were the same
      // set the end day to the same as the new start day
      if (Datetime(this.state.startDate).isSame(this.state.endDate, "day")) {
        let end = Datetime(this.state.endDate)
        data.ends = Datetime(data.starts).hour(end.hours()).minute(end.minutes()).toDate()
      }
    }

    this.setState({
      startDate: data.starts,
      endDate: data.ends,
      allDay: data.allDay,
      locationName: data.locationName
    })
  }

  _renderLocationFields() {
    if (!this.state.location) {
      return (
        <FieldGroup title="LOCATION" link="Search >" onPressLink={() => this._chooseLocation()}>
          <InputField ref="locationName" placeholder="Name" value={this.state.locationName} />
          {/*<TouchableField text="Choose location..." color={"black"} onPress={() => this._chooseLocation()} />*/}
        </FieldGroup>
      )
    }
    else {
      return (
        <FieldGroup title="LOCATION" link="Clear" onPressLink={() => this._clearLocation()}>
          <Field text={this.state.location.name} />
          <DescriptionField text={this.state.location.address} />
          <Field style={styles.mapContainer}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              initialRegion={{
                latitude: this.state.location.geo.lat,
                longitude: this.state.location.geo.lng,
                latitudeDelta: this.state.location.viewport.lat,
                longitudeDelta: this.state.location.viewport.lng,
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: this.state.location.geo.lat,
                  longitude: this.state.location.geo.lng
                  }}
                title={this.state.location.name}
                description={this.state.location.address}
              />
            </MapView>
          </Field>
          {/*<TouchableField text="Clear" color={"black"} onPress={() => this._clearLocation()} />*/}
        </FieldGroup>
      )
    }
  }

  _chooseLocation() {
    this.props.navigation.navigate("ChooseLocation", {
      onComplete: (details) => {
        this.props.navigation.goBack(null)

        let selectedLocation = null;
        if (details) {
          let latD = details.geometry.viewport.northeast.lat - details.geometry.viewport.southwest.lat;
          let lngD = details.geometry.viewport.northeast.lng - details.geometry.viewport.southwest.lng;
          selectedLocation = {
            name: details.name,
            geo: details.geometry.location,
            address: details.formatted_address,
            viewport: {
              lat: latD,
              lng: lngD
            }
          }
        }

        this.setState({location: selectedLocation});
      }
    })
  }

  _clearLocation() {
    this.setState({location: null, locationName: ""})
  }

  _chooseReminder() {
    this.props.navigation.navigate("ChooseReminder", {
      ...this.state.reminder,
      onComplete: (val) => {
        this.props.navigation.goBack(null)
        this.setState({reminder: val});
      }
    })
  }

  _formatPicker(which, value, mode) {
    // start date we just make look pretty
    if (which == "startDate") {
      if (mode == "datetime") {
        return Datetime(value).format("LLL")
      }
      else {
        return Datetime(value).format("LL")
      }
    }
    // end date we show as time only if it's the same as start date
    if (which == "endDate") {
      if (mode == "datetime") {
        if (!this.state.allDay && Datetime(this.state.startDate).isSame(value, "day")) {
          return Datetime(value).format("h:mm A")
        }
        return Datetime(value).format("LLL")
      }
      else {
        return Datetime(value).format("LL")
      }
    }
  }

  async _save() {
    const { navigate } = this.props.navigation;
    await this.props.updateNewTopic("details", this.state);
    navigate("TopicAddMembers")
  }
}

let styles = StyleSheet.create({
  mapContainer: {
    height: 130
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130,
  }
})
