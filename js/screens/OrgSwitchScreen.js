import React, { Component } from "react"
import { StyleSheet, View, Text, Button } from "react-native"
import { connectprops, PropMap } from "react-redux-propmap"
import { PrefsActions } from "../state/actions"
import { Field, FieldGroup, TouchableField } from "react-native-fields"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.orgs = this.state.orgs.list;
    props.org = this.state.prefs.org;
    props.setOrgClick = this.bindEvent(PrefsActions.setOrg);
  }
}

@connectprops(Props)
export default class ActivityScreen extends Component {

  static navigationOptions = {
    title: "Choose Group"
  }

  render() {
    return (
      <View style={Styles.screenFields}>
        {this._renderOrgsGroup()}
      </View>
    )
  }

  _renderOrgsGroup() {
    const { orgs, org } = this.props;
    const currentId = org ? org.id : "";
    return (
      <FieldGroup>
        {orgs.valueSeq().map((org, i) => {
          return <TouchableField 
                  key={i} 
                  text={org.name} 
                  accessory={(org.id == currentId) && "bullet"}
                  onPress={() => this._onChangeOrg(org)} 
                  />
        })}
      </FieldGroup>
    )
  }

  async _onChangeOrg(org) {
    const { setOrgClick, navigation } = this.props;
    await setOrgClick(org)
    navigation.goBack(null)
  }
}

let styles = StyleSheet.create({
})
