import React, { Component } from "react"
import { StackNavigator } from "react-navigation"

// stack navigator that allows a modal to be easily dismissed
// https://github.com/react-community/react-navigation/issues/686#issuecomment-292225313
//
export default function DismissableStackNavigator(routes, options) {
  const StackNav = StackNavigator(routes, options);

  return class DismissableStackNav extends Component {
    static router = StackNav.router;

    render() {
      const { state, goBack } = this.props.navigation;
      const nav = {
        ...this.props.navigation,
        dismiss: () => goBack(state.key),
      };
      return (
        <StackNav
          navigation={nav}
        />
      );
    }
  }
}