import React, { Component } from "react"
import { StyleSheet, View, Text, ListView, TouchableOpacity, ScrollView } from "react-native"
import { Header, AvatarImage, Toolbar, ToolbarTextButton, UserCell } from "../components"
import CachedImage from "react-native-cached-image"
import SearchBar from "react-native-search-box"
import Immutable from "immutable"
import { UserMap } from "../models"
import MaterialIcon from "react-native-vector-icons/MaterialIcons"
import { connectprops, PropMap } from "react-redux-propmap"
import Styles, { Color, Dims, TextSize } from "../styles"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
    props.orgs = this.state.orgs.list;
    props.org = this.state.prefs.org;
    props.members = this.state.members.list;
  }
}

@connectprops(Props)
export default class GroupScreen extends Component {

  static navigationOptions = {
    header: (navigation, defaultHeader) => ({
      visible: false
    })
  }

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2});
    this.state = {
      dataSource: ds.cloneWithRows(this._getMembers(this.props.members))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.members, nextProps.members)) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this._getMembers(nextProps.members))
      });
    }
  }

  render() {
    const { org, user } = this.props;
    const { navigate } = this.props.navigation;

    let iconSource = require("../assets/images/group-128.png")
    if (org.icon.valid) {
      iconSource = {
        uri: org.icon.url
      }
    }

    return (

      <View style={Styles.screenFields}>

        <TouchableField onPress={() => {navigate("Org")}} accessory={true} style={styles.navbar}>
          <View style={styles.profileContainer}>
            <TouchableOpacity 
              onPress={() => navigate("Org")} 
              style={styles.iconContainer}>
              <CachedImage
                source={iconSource}
                style={styles.icon}
              />
            </TouchableOpacity>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{org.name}</Text>
              <Text style={styles.profileEmail}>{org.owner.name}</Text>
            </View>
          </View>
        </TouchableField>
        <TouchableField onPress={() => navigate("OrgSwitch")} text="Switch Group"  style={styles.navBottom} />

        <ScrollView style={{flex:1}}>

          <FieldGroup title="Members">

          {this.props.members.map(member => {

            return (
              <Field style={{paddingVertical: 6, paddingHorizontal: 0}}>
                <UserCell 
                  user={member}
                  onPress={() => this.props.navigation.navigate("MessagingStack", {member: member})}>
                  <MaterialIcon name="textsms" size={20} color={Color.tint} />
                </UserCell>
              </Field>
            )

          })}

          </FieldGroup>
      

      {/*<View style={Styles.screenFields}>
        <Header title="Group" subtitle={org.name.toUpperCase()}>
          <TouchableOpacity 
            onPress={() => navigate("Org")} 
            style={styles.iconContainer}>
            <CachedImage
              source={iconSource}
              style={styles.icon}
            />
          </TouchableOpacity>
        </Header>
        {/*<SearchBar
          ref="searchbar"
          backgroundColor={Color.white}
          titleCancelColor={Color.tint}
          onChangeText={(k) => this._onSearchTextChange(k)}
          onCancel={() => this._onCancelSearch()}
        />
        <FieldGroup>
          <TouchableField onPress={() => {navigation.navigate("Profile")}} accessory={true}>
            <View style={styles.profileContainer}>
              <AvatarImage user={user} size={50} color={Color.subtle} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{"@" + user.alias}</Text>
              </View>
            </View>
          </TouchableField>
        </FieldGroup>
        <ListView
          style={{paddingTop: 8}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          renderSeparator={this._renderSeparator}
          removeClippedSubviews={false}
          keyboardShouldPersistTaps="always"
          enableEmptySections={true}
        />
        {this.props.members.size > 0 ? <View style={styles.toolbarContainer}>
          <Toolbar align="right">
            <ToolbarTextButton 
              title="Switch Group" 
              onPress={() => navigate("OrgSwitch")} />
          </Toolbar>
        </View> : null}
      </View>*/}

        </ScrollView>
      </View>
    )
  }

  _renderRow(rowData) {
    const member = rowData;

    if (member.id == this.props.user.id) {
      return (<UserCell user={member} />);
    }

    return (
      <UserCell 
        user={member}
        onPress={() => this.props.navigation.navigate("MessagingStack", {member: member})}>
        <MaterialIcon name="textsms" size={20} color={Color.tint} />
      </UserCell>
    )
  }

  _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={Styles.separator}
      />
    );
  }

  _getMembers(members) {
    const { org } = this.props;
    return new UserMap([[org.owner.id, org.owner]]).merge(members).toArray();
  }
}

let styles = StyleSheet.create({
  navbar: {
    marginTop: 20
  },
  navBottom: {
    borderBottomColor: Color.separator,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  iconContainer: {

  },
  icon: {
    width: 50,
    height: 50
  },
  toolbarContainer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#bbb",
    height: 44,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingTop: 6,
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
  },
  profileContainer: {
    flexDirection: "row",
    marginTop: 2
  },
  profileInfo: {
    marginTop: 4,
    marginLeft: 10
  },
  profileName: {
    fontWeight: "500",
    fontSize: TextSize.normal
  },
  profileEmail: {
    color: "#777",
    fontSize: TextSize.small
  },
})
