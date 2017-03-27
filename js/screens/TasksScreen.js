import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native"
import { NavbarButton, AvatarImage, ToolbarButton, Header } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import Styles, { Color, Dims } from "../styles"

import { SegmentedControls } from "react-native-radio-buttons"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"

import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import IonIcon from "react-native-vector-icons/Ionicons"

import Calendar from "react-native-calendar"
import moment from "moment"

const customDayHeadings = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const calendarStyle = {
  dayHeading: {
    color: "black",
    fontSize: 12
  },
  weekendHeading: {
    color: "black",
    fontSize: 12
  },
  calendarHeading: {
    borderTopColor: "transparent",
    borderBottomColor: Color.separator
  },
  title: {
    marginBottom: 4,
    marginTop: 7
  }
}

const options = [
    "Tasks",
    "Calendar",
  ];

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
    props.isAuthenticated = this.state.auth.isAuthenticated;
  }
}

@connectprops(Props)
export default class TasksScreen extends Component {

  static navigationOptions = {
    header: (navigation, defaultHeader) => ({
      visible: false
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      view: "Tasks",
      selectedDate: moment().format(),
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { avatar } = this.props.user;

    let avatarSource = require("../assets/images/circle-user-man-512.png")
    if (avatar.valid) {
      avatarSource = {
        uri: avatar.url
      }
    }

    let content = null;
    if (this.state.view == "Calendar") {
      content = (<View>
        {this._renderCalendar()}
      </View>)
    }
    else if (this.state.view == "Tasks") {
      content = this._renderTasks()
    }

    let custom = (<View style={{marginBottom: 7}}>
      <SegmentedControls 
        options={options}
        tint={"#aaa"}
        selectedTint={Color.tint}
        selectedBackgroundColor={"#fff"}
        backTint={"rgb(238, 238, 243)"} 
        containerBorderTint={"#ddd"}
        selectedOption={this.state.view}
        onSelection={(opt) => this._onViewSelectionChanged(opt)}
        />
    </View>)

    return (
      <View style={Styles.screenFields}>

        <Header title={(this.state.view == "Calendar") ? "Calendar" : "Tasks"} subtitle="UPCOMING" custom={custom}>

          {(!avatar.valid) ?
          <TouchableOpacity onPress={() => navigate("Profile")} style={{marginRight: 10,marginBottom:-4}}>
            <IonIcon name="ios-contact" size={45} color={Color.tint} />
          </TouchableOpacity>
          :
          <TouchableOpacity onPress={() => navigate("Profile")} style={{marginRight: 10,marginBottom:4}}>
            <AvatarImage source={avatarSource} size={40} background="light"/>
          </TouchableOpacity>
          }

        </Header>

        {content}
        
      </View>
    )
  }

  _onViewSelectionChanged(opt) {
    this._setView(opt)
  }

  _renderCalendar() {
    return (<View>
      <Calendar
        ref="calendar"
        style={{flex:1}}
        customStyle={calendarStyle}
        eventDates={['2017-02-03', '2017-02-05', '2017-03-28', '2017-07-30']}
        events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
        scrollEnabled
        showControls={false}
        dayHeadings={customDayHeadings}
        monthNames={customMonthNames}
        titleFormat={'MMMM YYYY'}
        prevButtonText={"Prev"}
        nextButtonText={"Next"}
        onDateSelect={(date) => this.setState({ selectedDate: date })}
        onTouchPrev={(e) => console.log('onTouchPrev: ', e)}
        onTouchNext={(e) => console.log('onTouchNext: ', e)}
        onSwipePrev={(e) => console.log('onSwipePrev: ', e)}
        onSwipeNext={(e) => console.log('onSwipeNext', e)}
      />
      {this._renderEvents()}
      </View>)
  }

  _renderEvents() {
    return (<ScrollView style={{height:200,paddingTop:8,borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:Color.separator}}>
      {this._renderEvent("Company Meeting", "3/23", "1:00p")}
      {this._renderEvent("Return registration forms to Volleyball Club", "3/28")}
    </ScrollView>)
  }

  _renderEvent(text, date, time) {
    const { avatar } = this.props.user;
    let datetime = date;
    if (datetime.length > 0 && time)
      datetime += " ";
    if (time)
      datetime += time;

    return (
        <View style={{flexDirection: "row", paddingHorizontal:10, paddingVertical: 5}}>
          <View style={{flexDirection: "column", alignItems: "flex-start", width: 70, marginTop: 3}}>
            <Text style={{fontSize: 11, color: "#555"}}>{datetime}</Text>
          </View>
          <Text style={{flex:1, fontSize:16}}>{text}</Text>
        </View>
    )
  }

  _renderTasks() {
    return (<ScrollView style={{flex:1,marginTop:-8}}>
            <FieldGroup>
              <Field>
                <View style={{flexDirection: "row"}}>
                  <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Complete Visicorp Proposal"}</Text>
                  <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
                </View>
              </Field>
              <Field>
                <View style={{flexDirection: "row"}}>
                  <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Return stage equipment"}</Text>
                  <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
                </View>
              </Field>
              <Field>
                <View style={{flexDirection: "row"}}>
                  <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Pickup t-shirts for weekend"}</Text>
                  <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
                </View>
              </Field>
              <Field>
                <View style={{flexDirection: "row"}}>
                  <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Finish app"}</Text>
                  <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
                </View>
              </Field>
            </FieldGroup>
          </ScrollView>)
  }

  _setView(view) {
    this.setState({view: view});
  }
}

let styles = StyleSheet.create({
})
