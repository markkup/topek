import React, { Component } from "react"
import { StyleSheet, View, Text, TextInput, Button, ListView, TouchableHighlight, TouchableOpacity, RefreshControl } from "react-native"
import { ErrorHeader, Toolbar, ToolbarButton, ToolbarButtonExample, Header, AvatarImage, TopicImage } from "../components"
import Immutable from "immutable"
import Datetime from "../lib/datetime"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims, TextSize } from "../styles"

import { TopicSelectors } from "../state/selectors"

import IonIcon from "react-native-vector-icons/Ionicons"
import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons"

class Props extends PropMap {
  map(props) {
    props.isAuthenticated = this.state.auth.isAuthenticated;
    props.topics = TopicSelectors.getTopicList(this.state); //this.state.topics.list;
    props.members = this.state.members.list;
    props.isRefreshing = this.state.topics.isRefreshing;
    props.loadError = this.state.topics.loadError;
    props.loadTopics = this.bindEvent(TopicActions.load);
    props.refreshTopics = this.bindEvent(TopicActions.load);
    props.topicSelect = this.bindEvent(TopicActions.setSelected);
    props.startNewTopic = this.bindEvent(TopicActions.startNewTopic);
  }
}

@connectprops(Props)
export default class TopicsScreen extends Component {

  static navigationOptions = {
    title: "Topics",
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      visible: false
    })
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => !Immutable.is(r1, r2)});
    this.state = {
      dataSource: ds.cloneWithRows(props.topics.toArray())
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.topics, nextProps.topics)) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.topics.toArray())
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;

    let header = (
      <View style={{height:66,backgroundColor:"#fff",borderBottomWidth:StyleSheet.hairlineWidth,borderBottomColor:Color.separator}}>
        <Toolbar style={{marginTop:20,paddingHorizontal:4}}>
          <ToolbarButton name="options" onPress={() => {}} />
          <View style={{flex:1}}>
            <TextInput 
              style={{fontSize:14,height:28,backgroundColor:"rgb(233,235,238)",marginTop:1,marginHorizontal:5,borderRadius:6,paddingHorizontal:10}}
              placeholder="Search"
              underlineColorAndroid="transparent" />
          </View>
          <ToolbarButton name="add" onPress={() => this._addNewTopic()} />
        </Toolbar>
      </View>
    )

    let example = null //<ToolbarButtonExample />

    return (
      <View style={Styles.screenFields}>
        {header}
        {example}
        { this.props.loadError && <ErrorHeader text={this.props.loadError} /> }
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          renderSeparator={this._renderSeparator}
          refreshControl={
            <RefreshControl
              refreshing={this.props.isRefreshing}
              onRefresh={this.props.refreshTopics}
            />
          }
        />
      </View>
    )
  }

  async _addNewTopic() {
    const {navigate} = this.props.navigation;
    await this.props.startNewTopic();
    navigate("TopicAddStack");
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    const {navigate} = this.props.navigation;
    const { topic, read } = rowData;
    var onPress = () => { 
      this.props.topicSelect(topic)
      navigate("TopicDetails")
    };
    var date = Datetime(topic.updatedAt);
    if (Datetime.isToday(date)) {
      date = date.format("h:mm a")
    }
    else if (Datetime.isYesterday(date)) {
      date = "Yesterday";
    }
    else {
      date = date.format("M/d/Y")
    }

    let icon = null;
    let sub = null;
    let when = null;
    let memberCount = rowData.topic.memberCount || 0;
    let status = null;

    if (topic.type == "event") {
      let detail = topic.details[0]

      let location = null;
      if (detail.location && detail.location.name) {
        location = detail.location.name
      }
      else if (detail.locationName && detail.locationName != "") {
        location = detail.locationName
      }

      let start = Datetime(detail.startDate)
      let end = Datetime(detail.endDate)
      let occurs = null
      if (detail.allDay == true) {
        occurs = ""
        if (start.isSame(end, "day"))
          occurs += start.format("MMMM Do")
        else
          occurs += start.format("MMM Do") + " to " + end.format("MMM Do")
      }
      else {
        if (start.isSame(end, "day"))
          occurs = start.format("MMM Do, h:mm A") + " to " + end.format("h:mm A")
        else
          occurs = start.format("MMM Do, h:mm A") + " to " + end.format("MMM Do h:mm A")
      }

      if (occurs) occurs = occurs.replace(/:00/g, "")
      if (occurs) occurs = occurs.replace(" " + new Date().getFullYear(), "")

      icon = <SimpleLineIcon name="event" size={18} style={styles.icon} />
      sub = location && <Text style={styles.subtext}>{location}</Text>
      when = occurs && <Text style={styles.when}>{occurs}</Text>
      
      if (detail.ack) {
        let memberstr = memberCount == 1 ? "member" : "members";
        status = "0/" + memberCount + " " + memberstr + " accepted"
      }
    }
    else if (topic.type == "announcement") {
      icon = <SimpleLineIcon name="volume-2" size={18} style={styles.icon} />
    }
    else {
      icon = <SimpleLineIcon name="info" size={18} style={styles.icon} />
    }

    if (!status) {
      if (memberCount == this.props.members.size)
        status = "all members"
      else status = memberCount != 1 ? memberCount + " members" : memberCount + " member";
    }

    return (
      <TouchableHighlight onPress={onPress} underlayColor="#eee">
        <View style={styles.row}>
          
          <View style={styles.rowInfo}>
            {icon}
            {!read && <Text style={styles.unread}>{"●"}</Text>}
          </View>

          <View style={styles.rowContent}>

            <Text style={styles.text}>{topic.name}</Text>
          
            <View style={styles.details}>
              {sub}
              {when}
            </View>

            <View style={styles.status}>
              <AvatarImage user={topic.owner} size={20} background="dark" />
              <Text style={styles.owner}>{topic.owner.alias}</Text>
              <Text style={styles.dot}>{"•"}</Text>
              <Text style={styles.members}>{status}</Text>
            </View>

          </View>

          {topic.image.valid && <TopicImage image={topic.image} size={60} style={{marginLeft:0,marginRight:0}} />}

        </View>
      </TouchableHighlight>
    );
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={Styles.separator}
      />
    );
  }
}

let styles = StyleSheet.create({
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    paddingLeft: Dims.horzPadding,
    paddingRight: Dims.horzPadding,
    backgroundColor: Color.white
  },
  icon: {
    marginRight: 10,
    marginTop: 1,
    color: Color.subtle,
  },
  rowContent: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    paddingRight: 10
  },
  rowInfo: {
    flexDirection: "column",
    alignItems: "center",
  },
  owner: {
    fontWeight: "500",
    color: Color.subtle,
    fontSize: TextSize.tiny,
    marginLeft: 4,
    marginTop: 2
  },
  dot: {
    fontWeight: "500",
    color: Color.subtle,
    fontSize: TextSize.tiny,
    marginLeft: 4,
    marginTop: 2
  },
  members: {
    fontWeight: "500",
    color: Color.subtle,
    fontSize: TextSize.tiny,
    marginLeft: 4,
    marginTop: 2
  },
  text: {
    fontSize: TextSize.normal,
    fontWeight: "500",
    color: "#000"
  },
  details: {
    flex: 1,
    flexDirection: "column",
    marginTop: 4
  },
  status: {
    flexDirection: "row",
    marginTop: 8,
    marginBottom: 8
  },
  subtext: {
    flex: 1,
    fontSize: TextSize.tiny,
    fontWeight: "500",
    color: Color.tint,
    marginTop: 4
  },
  when: {
    flex: 1,
    fontSize: TextSize.tiny,
    fontWeight: "500",
    color: Color.tint,
    marginTop: 4
  },
  date: {
    color: Color.subtle,
    fontSize: 14,
  },
  unread: {
    color: Color.blue,
    marginRight: 11,
    marginTop: 7,
    fontSize: 16
  }
})
