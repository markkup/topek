import React, { Component } from "react"
import { StyleSheet, View, Animated } from "react-native"
import Modal from "react-native-root-modal"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class AnimatedModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      scale: new Animated.Value(1),
      x: new Animated.Value(0)
    };
  }

  show(visible, animate) {
    if (!animate) {
      this.setState({visible: visible})
    }
    else {
      if (visible) 
        this._scaleModal();
      else this._hideModal();
    }
  }

  render() {
    return (
      <Animated.Modal
        style={{
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          transform: [
            {
              scale: this.state.scale
            },
            {
              translateX: this.state.x
            }
          ]
        }}
        visible={this.state.visible}
      >
        {this.props.children}
      </Animated.Modal>
    )
  }

  _scaleModal() {
    this.state.x.setValue(0);
    this.state.scale.setValue(0);
    Animated.spring(this.state.scale, {
        toValue: 1,
        tension: 80
    }).start();
    this.setState({
        visible: true
    });
    this.slide = false;
  }

  _hideModal() {
    if (this.slide) {
      Animated.timing(this.state.x, {
        toValue: -320,
        duration: 100
      }).start(() => {
        this.setState({
          visible: false
        });
      });
    } else {
      Animated.timing(this.state.scale, {
        toValue: 0,
        duration: 100
      }).start(() => {
        this.setState({
          visible: false
        });
      });
    }
  }
}

AnimatedModal.propTypes = {
  visible: React.PropTypes.bool
}

AnimatedModal.defaultProps = {
  visible: false
}

let styles = StyleSheet.create({
})
