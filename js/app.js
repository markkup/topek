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
    props.state = this.state;
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
        <Nav navigation={addNavigationHelpers({
          dispatch: this.props.dispatch, 
          state: this.props.nav,
          getState: () => this.props.state
        })} />
      </View>)
    }
  }

  _renderStatusBar() {
    return <StatusBar
      translucent={true}
      backgroundColor="rgba(255, 255, 255, 0)"
      barStyle="dark-content"
    />
  }
}

export default App
