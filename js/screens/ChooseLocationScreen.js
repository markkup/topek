import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { ToolbarTextButton } from "../components"
import { Field, FieldGroup, TouchableField } from "react-native-fields"
import Styles, { Color, Dims, TextSize } from "../styles"
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete"

export default class ChooseLocationScreen extends Component {

  static navigationOptions = {
    title: "Location",
    header: ({ state, goBack }, defaultHeader) => ({
      ...defaultHeader
    })
  }

  render() {

    const homePlace = {description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
    const workPlace = {description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};

    return (
      <View style={Styles.screen}>
        <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2} // minimum length of text to search
        autoFocus={true}
        listViewDisplayed='auto'    // true/false/undefined
        fetchDetails={true}
        renderRow={this._renderRow.bind(this)}
        renderDescription={(row) => row.description} // custom description render
        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
          console.log(data);
          console.log(details);

          this.props.navigation.state.params.onComplete(details);
        }}
        getDefaultValue={() => {
          return ''; // text input default value
        }}
        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyCrCTR44_3NpgADNlK7kggoMkeMv8_3WxY',
          language: 'en', // language of the results
          types: '', // default: 'geocode'
        }}
        styles={{
          row: {
            flexDirection: "column",
            height: 65
          },
          specialItemRow: {
            height: 35
          },
          description: {
            fontSize: TextSize.normal,
            paddingVertical: 0
          },
          predefinedPlacesDescription: {

          },
          textInputContainer: {
            backgroundColor: Color.backgroundFields,
            borderTopWidth: 0,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: Color.separator
          }
        }}

        currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
        currentLocationLabel="Current location"
        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
        GoogleReverseGeocodingQuery={{
          // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
        }}
        GooglePlacesSearchQuery={{
          // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
          rankby: 'distance',
          types: 'food',
        }}


        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

        //predefinedPlaces={[homePlace, workPlace]}

        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 200ms.
      />
      </View>
    )
  }

  _renderRow(rowData) {
    
    if (rowData.structured_formatting && rowData.structured_formatting.main_text) {
      let mainText = rowData.structured_formatting.main_text;
      let subText = rowData.structured_formatting.secondary_text;
      return (
        <View>
          <Text style={styles.rowMainText}>{mainText}</Text>
          <Text style={styles.rowSubText}>{subText}</Text>
        </View>
      )
    }

    let text = rowData.description || rowData.formatted_address || rowData.name;
    return (
      <Text style={styles.rowText}>{text}</Text>
    )
  }
}

let styles = StyleSheet.create({
  row: {

  },
  rowDetailed: {
    flexDirection: "column",
    height: 65
  },
  rowMainText: {
    fontSize: TextSize.normal,
    color: "#000"
  },
  rowSubText: {
    fontSize: TextSize.small,
    color: "#666"
  },
  rowText: {
    fontSize: TextSize.normal,
    color: "#000"
  }
})
