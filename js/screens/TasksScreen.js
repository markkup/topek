import React, { Component } from "react"
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from "react-native"
import { AvatarImage, ToolbarButton, Header } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import Styles, { Color, Dims, TextSize } from "../styles"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"

import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons"
import IonIcon from "react-native-vector-icons/Ionicons"

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
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      user: this.props.user
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user.avatar != this.props.user.avatar) {
      this.props.navigation.setParams({
        avatarSource: nextProps.user.avatar.valid ? { uri: nextProps.user.avatar.url } : null
      });
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    const { user, navigation } = this.props;
    let content = this._renderTasks()
    return (
      <View style={Styles.screenFields}>
        <TouchableField onPress={() => {navigation.navigate("Profile")}} accessory={true} style={styles.navbar}>
          <View style={styles.profileContainer}>
            <AvatarImage user={user} size={50} color={Color.subtle} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{"@" + user.alias}</Text>
            </View>
          </View>
        </TouchableField>

        {content}
      </View>
    )
  }

  _renderTasks() {
    const { user, navigation } = this.props;
    return (
      <ScrollView style={{flex:1}}>
        {/*<FieldGroup>
          <TouchableField onPress={() => {navigation.navigate("Profile")}} accessory={true}>
            <View style={styles.profileContainer}>
              <AvatarImage user={user} size={50} color={Color.subtle} />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{"@" + user.alias}</Text>
              </View>
            </View>
          </TouchableField>
        </FieldGroup>*/}
        <FieldGroup title="To Do">
          <Field style={{flexDirection: "row"}}>
            <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Complete Visicorp Proposal"}</Text>
            <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
          </Field>
          <Field style={{flexDirection: "row"}}>
            <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Return stage equipment"}</Text>
            <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
          </Field>
          <Field style={{flexDirection: "row"}}>
            <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Pickup t-shirts for weekend"}</Text>
            <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
          </Field>
          <Field style={{flexDirection: "row"}}>
            <Text style={{flex:1, fontSize:18, marginTop: 4}}>{"Finish app"}</Text>
            <MaterialIcon name="checkbox-blank-outline" size={30} color={Color.tint} />
          </Field>
        </FieldGroup>
      </ScrollView>
    )
  }

  _showProfile() {
    const { navigate } = this.props.navigation;
    navigate("Profile")
  }
}

let styles = StyleSheet.create({
  navbar: {
    marginTop: 20,
    borderBottomColor: Color.separator,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  profileContainer: {
    flexDirection: "row",
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
