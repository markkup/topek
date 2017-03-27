import React, { Component } from "react"
import { StyleSheet, View, Text, ListView, TouchableHighlight } from "react-native"
import { AvatarImage, Toolbar, ToolbarTextButton, UserCell } from "."
import SearchBar from "react-native-search-box"
import Immutable from "immutable"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class UserSelectListView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    this.checks = {}
    this.searchKeyword = ""
    this.state = {
      dataSource: ds.cloneWithRows(this._getAggregateData(this.props.users))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.users, nextProps.users)) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._getAggregateData(nextProps.users))
      });
    }
  }

  render() {
    let emptyMsg = null;
    if (this.props.users.size == 0) {
      emptyMsg = (<View style={styles.emptyMsgContainer}>
          <Text style={styles.emptyMsg}>{this.props.emptyMessage}</Text>
        </View>)
    }
    return (
      <View style={styles.component}>
        <SearchBar
          ref="searchbar"
          backgroundColor={Color.white}
          titleCancelColor={Color.tint}
          onChangeText={(k) => this._onSearchTextChange(k)}
          onCancel={() => this._onCancelSearch()}
        />
        {emptyMsg}
        <ListView
          style={{paddingTop: 0}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="always"
          enableEmptySections={true}
        />
        {this.props.users.size > 0 ? <View style={styles.toolbarContainer}>
          <Toolbar align="left">
            <ToolbarTextButton 
              title="Select All" 
              onPress={() => this._checkAll()} />
          </Toolbar>
          <Toolbar align="right">
            <ToolbarTextButton 
              title="Select None" 
              onPress={() => this._checkNone()} />
          </Toolbar>
        </View> : null}
      </View>)
  }

  _renderRow(rowData) {
    var onPress = () => { 
    };
    const { member, checked } = rowData;
    return (
      <UserCell user={member} onPress={() => this._checkMember(member.id)}>
        {(checked)
            ? <MaterialIcon name="check-box" size={30} color={Color.tint} />
            : <MaterialIcon name="check-box-outline-blank" size={30} color={Color.tint} />}
      </UserCell>
    )
  }

  _onSearchTextChange(keyword) {
    return new Promise((resolve, reject) => {
      console.log("_onHandleSearchTextChange:", keyword);
      this._performSearch(keyword);
      resolve();
    });
  }

  _onCancelSearch() {
    this._performSearch("");
  }

  _performSearch(keyword) {
    this.searchKeyword = keyword;
    this._updateListViewSource();
  }

  _checkMember(id) {
    this.checks[id] = !this.checks[id];
    this._updateListViewSource();
  }

  _checkAll() {
    for (key in this.props.users.toJS())
      this.checks[key] = true
    this._updateListViewSource();
  }

  _checkNone() {
    for (key in this.props.users.toJS())
      this.checks[key] = false
    this._updateListViewSource();
  }

  _updateListViewSource() {
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this._getAggregateData(this.props.users))
    })

    let usersToAdd = this.props.users.asImmutable();
    for (key in this.props.users.toJS()) {
      if (this.checks[key] === undefined || this.checks[key] == false) {
        usersToAdd = usersToAdd.delete(key)
      }
    }
    this.props.onSelectedUsersChanged(usersToAdd);
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={Styles.separator}
      />
    );
  }

  _getAggregateData(users) {
    let keyword = this.searchKeyword;
    keyword = keyword.toLowerCase();
    let agg = {};
    users.map(member => {
      if (member.name.toLowerCase().search(keyword) >= 0 || 
        member.alias.toLowerCase().search(keyword) >= 0) {
        agg[member.id] = {
          checked: this.checks[member.id] !== undefined ? this.checks[member.id] : false,
          member: member
        }
      }
    })
    return agg;
  }
}

UserSelectListView.propTypes = {
  users: React.PropTypes.object.isRequired,
  onSelectedUsersChanged: React.PropTypes.func,
  emptyMessage: React.PropTypes.string
}

UserSelectListView.defaultProps = {
  onSelectedUsersChanged: () => {},
  emptyMessage: "No users to add"
}

let styles = StyleSheet.create({
  component: {
    flex: 1
  },
  toolbarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#bbb",
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingRight: 2
  },
  emptyMsgContainer: {
    flex: 1,
    padding: 25
  },
  emptyMsg: {
    color: Color.subtle,
    textAlign: "center",
    fontSize: 14
  }
})
