import React, { Component } from "react"
import { StyleSheet, View, TouchableHighlight, Text } from "react-native"
import { AvatarImage } from "."
import Styles, { Color, Dims, TextSize } from "../styles"

export default class UserCell extends Component {
  
  render() {
    if (!this.props.onPress) {
      return this._renderInnerCell();
    }

    return (
      <TouchableHighlight onPress={this.props.onPress} underlayColor="#eee">
        {this._renderInnerCell()}
      </TouchableHighlight>
    )
  }

  _renderInnerCell() {
    const { user } = this.props;
    return (
      <View style={styles.row}>
        <AvatarImage user={user} background="dark" style={[styles.avatar]} />
        <View style={styles.identity}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.alias}>{"@" + user.alias}</Text>
        </View>
        <View style={styles.content}>
          {this.props.children}
        </View>
      </View>
    )
  }
}

UserCell.propTypes = {
  user: React.PropTypes.object.isRequired,
  onPress: React.PropTypes.func,
}

UserCell.defaultProps = {
  onPress: null
}

let styles = StyleSheet.create({
  row: {
    paddingHorizontal: Dims.horzPadding,
    paddingVertical: 4,
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    backgroundColor: Color.white
  },
  avatar: {

  },
  identity: {
    flex: 1,
    flexDirection: "row",
  },
  name: {
    fontSize: TextSize.normal,
    marginLeft: 6
  },
  alias: {
    fontSize: TextSize.normal,
    color: "#777",
    marginLeft: 6
  }
})
