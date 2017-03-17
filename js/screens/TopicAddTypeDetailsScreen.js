import React, { Component } from "react"
import { StyleSheet, View, Text, Button, StatusBar, TouchableHighlight } from "react-native"
import { ToolbarTextButton, ErrorHeader, FieldButton } from "../components"
import { Form, InputField, Field, FieldGroup, TouchableField, SwitchField, DatePickerField } from "../react-native-fieldsX"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

import MapView from "react-native-maps"
//import RNGooglePlacePicker from "react-native-google-place-picker"

class Props extends PropMap {
  map(props) {
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.saveClick = this.bindEvent(TopicActions.add);
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
      location: null,
      locationName: "No where"
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
        rightClick: () => this.props.navigation.navigate("TopicAddMembers")
    });
  }

  render() {
    const { navigate, goBack } = this.props.navigation;
    return (
      <View style={Styles.screenFields}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <Form
          ref="form">
        
          <FieldGroup title="WHEN">
            <SwitchField label="All-day" ref="allDay" />
            <DatePickerField ref="starts"
              placeholder="Starts"
              value={new Date()}
              minimumDate={new Date('1/1/1900')}
              maximumDate={new Date()} 
              mode="datetime" />
            <DatePickerField ref="ends"
              placeholder="Ends"
              value={new Date()}
              minimumDate={new Date('1/1/1900')}
              maximumDate={new Date()} 
              mode="datetime" />
            <TouchableField text="Reminder" accessory={true} onPress={() => {}} />
          </FieldGroup>

          <FieldGroup title="LOCATION">
            <InputField ref="locationName" placeholder="Name" value={this.state.locationName} />
            <Field style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: 37.78825,
                  longitude: -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              />
            </Field>
            {this.state.location
            ? <TouchableField text="Clear" color={"black"} onPress={() => this._clearLocation()} />
            : <TouchableField text="Choose place..." color={"black"} onPress={() => this._chooseLocation()} />}
          </FieldGroup>

        </Form>

      </View>
    )
  }

  _chooseLocation() {
    /*RNGooglePlacePicker.show((response) => {
      if (response.didCancel) {
        console.log('User cancelled GooglePlacePicker');
      }
      else if (response.error) {
        console.log('GooglePlacePicker Error: ', response.error);
      }
      else {
        console.log('GooglePlacePicker picked: ', response);
        this.setState({location: response, locationName: response.name})
      }
    })*/
    this.props.navigation.navigate("ChooseLocation")
  }

  _clearLocation() {
    this.setState({location: null, locationName: ""})
  }

  async _saveType() {
    const { navigate } = this.props.navigation;
    //if (await this.props.saveClick(this.state.title))
    //  this.props.navigation.goBack(null);
    navigate("TopicAddTypeDetails")
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
