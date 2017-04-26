import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView } from "react-native"
import { connectprops, PropMap } from "react-redux-propmap"
import Styles, { Color, Dims, TextSize } from "../styles"

import Calendar from "react-native-calendar"
import moment from "moment"

const customDayHeadings = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const calendarStyle = {
  dayHeading: {
    color: Color.subtle,
    fontSize: 14
  },
  weekendHeading: {
    color: Color.subtle,
    fontSize: 14
  },
  calendarHeading: {
    borderTopColor: Color.transparent,
    borderBottomColor: Color.separator
  },
  title: {
    marginBottom: 0,
    marginTop: 0,
    height:0
  },
  calendarContainer: {
    backgroundColor: Color.white,
  },
  dayButton: {
    borderTopWidth: 0
  }
}

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
    props.isAuthenticated = this.state.auth.isAuthenticated;
  }
}

@connectprops(Props)
export default class CalendarScreen extends Component {

  static navigationOptions = {
    title: moment().format("MMMM")
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedDate: moment().format(),
    }
  }

  render() {
    return (
      <View style={Styles.screenFields}>
        {this._renderCalendar()}
      </View>
    )
  }

  _renderCalendar() {
    return (<View>
      <Calendar
        ref="calendar"
        style={{flex:1, marginTop:-10}}
        customStyle={calendarStyle}
        eventDates={['2017-02-03', '2017-02-05', '2017-03-28', '2017-07-30']}
        events={[{date: '2016-07-04', hasEventCircle: {backgroundColor: 'powderblue'}}]}
        scrollEnabled
        showControls={false}
        dayHeadings={customDayHeadings}
        monthNames={customMonthNames}
        titleFormat={"MMMM YYYY"}
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
    return (<ScrollView style={{height:200,paddingTop:16,borderTopWidth:StyleSheet.hairlineWidth,borderTopColor:Color.separator}}>
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
}

let styles = StyleSheet.create({
})
