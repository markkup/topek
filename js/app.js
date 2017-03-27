import React, { Component } from "react"
import { addNavigationHelpers } from "react-navigation"
import { StyleSheet, View, StatusBar, Text } from "react-native"
import { connectprops, PropMap } from "react-redux-propmap"
import { WorkingOverlay } from "./components"
import Nav from "./navigation"
import Styles from "./styles"
import LoginScreen from "./screens/LoginScreen"

class Props extends PropMap {
  map(props) {
    props.isAuthenticated = this.state.auth.isAuthenticated;
    props.nav = this.state.nav;
    props.dispatch = this.dispatch;
  }
}

@connectprops(Props)
class App extends Component {

  render() {
    if (!this.props.isAuthenticated) {
      return (
      <View style={Styles.app}>
        {this._renderStatusBar()}
        <LoginScreen />
      </View>)
    }
    else {
      return (
      <View style={Styles.app}>
        {this._renderStatusBar()}      
        <Nav navigation={addNavigationHelpers({dispatch: this.props.dispatch, state: this.props.nav})} />
      </View>)
    }
  }

  _renderStatusBar() {
    return <StatusBar
      translucent={true}
      backgroundColor="rgba(0, 0, 0, 0.2)"
      barStyle="dark-content"
    />
  }
}

export default App
