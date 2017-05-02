import React, { Component } from "react"
import { StyleSheet, View, Text, Animated, ActivityIndicator, TouchableHighlight } from "react-native"
import { ActionButton, TopicDetailGroup, TopicDetailField } from "./"
import Immutable from "immutable"
import Ionicon from "react-native-vector-icons/Ionicons"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class TopicDetailBase extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.collectedResults, nextProps.collectedResults)) {
      this.updateWithResults(nextProps.collectedResults);
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  init() {
  }

  destroy() {
  }

  updateWithResults(results) {
  }

  render() {
  }
}

TopicDetailBase.propTypes = {
  detail: React.PropTypes.object.isRequired,
  collectedResults: React.PropTypes.object.isRequired,
  isCollectingResults: React.PropTypes.bool.isRequired,
  hasCollectedResults: React.PropTypes.bool.isRequired,
  collectResults: React.PropTypes.func.isRequired,
  clearResults: React.PropTypes.func.isRequired,
  updateTopicState: React.PropTypes.func.isRequired,
  topic: React.PropTypes.object.isRequired,
  topicState: React.PropTypes.object.isRequired,
  isOwner: React.PropTypes.bool.isRequired,
}

TopicDetailBase.defaultProps = {
}

let styles = StyleSheet.create({
})
