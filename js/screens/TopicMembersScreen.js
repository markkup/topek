
import React, { Component } from "react"
import { StyleSheet, View, Text, TouchableHighlight, ListView, TouchableOpacity, ActivityIndicator } from "react-native"
import { NavbarButton, ErrorHeader, AvatarImage, WorkingOverlay } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import Immutable from "immutable"
import Ionicon from "react-native-vector-icons/Ionicons"
import { TopicActions } from "../state/actions"
import { TopicSelectors } from "../state/selectors"
import Styles, { Color, Dims, TextSize } from "../styles"

class Props extends PropMap {
  map(props) {
    props.members = TopicSelectors.getCurrentTopic(this.state).members;
    props.isOwner = this.state.topics.selectedTopic.owner.id == this.state.profile.user.id;
    props.removeClicked = this.bindEvent(TopicActions.removeMembersFromSelectedTopic);
  }
}

@connectprops(Props)
export default class TopicMembersScreen extends Component {

  static navigationOptions = {
    title: "Topic Members",
    header: ({ navigate, state }, defaultHeader) => ({
      ...defaultHeader,
      right: state.params && state.params.isOwner && (<NavbarButton title="Add" color={Color.tintNavbar} onPress={() => state.params.rightClick()} />),
    })
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      removingMemberId: null,
      dataSource: ds.cloneWithRows(props.members)
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
        isOwner: this.props.isOwner,
        rightClick: () => this.props.navigation.navigate("MemberSelectorStack")
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.members != nextProps.members) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.members)
      });
    }
  }

  render() {
    return (
      <View style={Styles.screen}>
        { this.props.loadError && <ErrorHeader text={this.props.loadError} /> }
        <ListView
          key={this.state.removingMemberId} // trick to refresh list
          style={{paddingTop: 8}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
          removeClippedSubviews={false}
          enableEmptySections={true}
        />
      </View>
    )
  }

  _renderRow(member) {

    let removeButton = null;
    if (this.state.removingMemberId) {
      let removing = this.state.removingMemberId && this.state.removingMemberId == member.id
      removeButton = removing ? <ActivityIndicator /> : null
    }
    else if (this.props.isOwner) {
      removeButton = (
        <TouchableOpacity onPress={() => this._removeMember(member)}>
          <Ionicon name="ios-close-circle-outline" size={28} color={Color.tint} />
        </TouchableOpacity>
      )
    }

    return (
      <TouchableHighlight onPress={() => {}} underlayColor="#eee">
        <View style={styles.row}>
          <AvatarImage user={member} background="dark" style={[styles.avatar]} />
          <View style={styles.memberNameContainer}>
            <Text style={styles.name}>{member.name}</Text>
            <Text style={styles.alias}>{"@" + member.alias}</Text>
          </View>
          {removeButton}
        </View>
      </TouchableHighlight>
    );
  }

  _removeMember(member) {
    this.setState({removingMemberId: member.id}, async () => {
      await this.props.removeClicked([member.id]);
      this.setState({removingMemberId: null})
    });
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
    paddingHorizontal: Dims.horzPadding,
    paddingVertical: 4,
    flexDirection: "row",
    backgroundColor: Color.white,
    flex: 1,
    alignItems: "center"
  },
  avatar: {

  },
  name: {
    fontSize: TextSize.normal,
    marginLeft: 6
  },
  alias: {
    fontSize: TextSize.normal,
    color: "#777",
    marginLeft: 6
  },
  memberNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    marginLeft: 4
  },
  memberAlias: {
    color: Color.subtle,
    marginLeft: 4
  }
})
