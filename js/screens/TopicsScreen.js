import React, { Component } from "react"
import { StyleSheet, View, Text, Button, ListView, TouchableHighlight, TouchableOpacity, RefreshControl } from "react-native"
import { ErrorHeader, ToolbarButton, Header, AvatarImage } from "../components"
import Immutable from "immutable"
import Datetime from "../lib/datetime"
import { connectprops, PropMap } from "react-redux-propmap"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

import IonIcon from "react-native-vector-icons/Ionicons"

class Props extends PropMap {
  map(props) {
    props.isAuthenticated = this.state.auth.isAuthenticated;
    props.topics = this.state.topics.list;
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
      visible: false,
      backTitle: " "
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

    return (
      <View style={Styles.screen}>
        <Header title="Topics" subtitle="MOST RECENT">
          <TouchableOpacity onPress={() => this._addNewTopic()} style={{marginRight: 10,marginBottom:0}}>
            <IonIcon name="ios-add" size={40} color={"#fff"} />
          </TouchableOpacity>
        </Header>
        { this.props.loadError && <ErrorHeader text={this.props.loadError} /> }
        <ListView
          style={{paddingTop: 8}}
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

  _renderRow(topic, sectionID, rowID, highlightRow) {
    const {navigate} = this.props.navigation;
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
    return (
      <TouchableHighlight onPress={onPress} underlayColor="#eee">
        <View style={styles.row}>
          <View style={styles.rowHeader}>
            <AvatarImage user={topic.owner} size={25} background="dark" />
            <Text style={styles.owner}>{topic.owner.name}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.text}>
            {topic.name} 
          </Text>
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
    flexDirection: "column",
    justifyContent: "center",
    padding: 10,
    paddingLeft: Dims.horzPadding,
    paddingRight: Dims.horzPadding
  },
  rowHeader: {
    flexDirection: "row",
    marginBottom: 3
  },
  owner: {
    fontWeight: "600",
    color: "#777",
    flex: 1,
    fontSize: 16,
    marginLeft: 4,
    marginTop: 2
  },
  text: {
    flex: 1,
    fontSize: 18,
    paddingRight: 20,
    color: "#000",
    marginLeft: 29
  },
  date: {
    color: "#999",
    fontSize: 14,
  }
})
