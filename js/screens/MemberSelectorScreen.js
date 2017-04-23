import React, { Component } from "react"
import { StyleSheet, View, StatusBar } from "react-native"
import { ToolbarTextButton, UserSelectListView } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { UserMap } from "../models"
import { TopicActions } from "../state/actions"
import { TopicSelectors } from "../state/selectors"
import Styles, { Color, Dims, TextSize } from "../styles"

class Props extends PropMap {
  map(props) {
    props.topic = TopicSelectors.getCurrentTopic(this.state);
    props.orgMembers = this.state.members.list;
    props.orgOwner = this.state.prefs.org.owner;
    props.currentUser = this.state.profile.user;
    props.isWorking = false;
    props.saveClicked = this.bindEvent(TopicActions.addMembersToSelectedTopic);
  }
}

@connectprops(Props)
export default class MemberSelectorScreen extends Component {

  static navigationOptions = {
    title: "Select Members",
    header: ({ state, goBack }, defaultHeader) => ({
      ...defaultHeader,
      left: <ToolbarTextButton title="Cancel" disabled={state.params && state.params.working} onPress={() => goBack(null)} />,
      right: <ToolbarTextButton title="Add" active={true} disabled={!state.params || !state.params.valid} working={state.params && state.params.working} onPress={() => state.params.rightClick()} />,
      visible: true
    })
  }

  constructor(props) {
    super(props);
    this.membersToAdd = new UserMap();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      valid: false,
      working: false,
      rightClick: () => this._saveMembers(),
    });
  }

  render() {
    const { topic, orgMembers, orgOwner, currentUser } = this.props;

    // compile list of potential members
    // all members - owner - existing users
    let users = orgMembers.delete(currentUser.id);
    this.props.topic.memberIds.map(id => {
      users = users.delete(id)
    })

    return (
      <View style={Styles.screen}>

        <StatusBar barStyle="dark-content" />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }
        
        <UserSelectListView
          users={users}
          onSelectedUsersChanged={(members) => this._onMembersChanged(members)}
          emptyMessage={"All members have been added"}
        />

      </View>
    )
  }

  async _saveMembers() {
    this.props.navigation.setParams({working: true});
    let memberIds = this.membersToAdd.map(m => m.id).toArray();
    await this.props.saveClicked(memberIds);
    this.props.navigation.goBack(null);
  }

  _onMembersChanged(members) {
    this.props.navigation.setParams({valid: members.size > 0});
    this.membersToAdd = members;
  }
}

let styles = StyleSheet.create({
})
