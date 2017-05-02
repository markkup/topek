import React, { Component } from "react"
import { StyleSheet, View, Text, Animated, ActivityIndicator, TouchableHighlight } from "react-native"
import { ActionButton, TopicDetailGroup, TopicDetailField } from "./"
import Immutable from "immutable"
import Ionicon from "react-native-vector-icons/Ionicons"
import Styles, { Color, Dims, TextSize } from "../styles"

export default class TopicDetailBase extends Component {

  key = "unknown";

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.init();
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(this.props.collectedResults, nextProps.collectedResults)) {
      this.updateWithCollectedResults(nextProps.collectedResults);
    }
    if (!Immutable.is(this.props.topicState, nextProps.topicState)) {
      const results = this.getIndividualResults(nextProps.topicState);
      if (Object.keys(results).length > 0) 
        this.updateWithIndividualResults(results);
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  init() {
  }

  destroy() {
    this.props.clearResults();
  }

  updateWithCollectedResults(results) {
  }

  updateWithIndividualResults(results) {

  }

  render() {
  }

  collectResults(force) {
    if (force === undefined) 
      force = false;
    if (!this.props.isCollectingResults && (!this.props.hasCollectedResults || force)) {
      this.props.collectResults(this.props.topic.id);
    }
  }

  get isOwner() {
    return this.props.isOwner;
  }

  get hasCollectedResults() {
    return this.props.hasCollectedResults;
  }

  get isCollectingResults() {
    return this.props.isCollectingResults;
  }

  async submit(values) {
    let newResults = this.props.topicState.results.slice(0);
    let keyResult = null;
    newResults.map(r => {
      if (r.type && r.type == this.key)
        keyResult = r;
    });
    if (!keyResult) {
      keyResult = { type: this.key };
      newResults.push(keyResult);
    }

    // apply values to keyResult
    for (var key in values) {
      keyResult[key] = values[key];
    }

    await this.props.updateTopicState(this.props.topic.id, "results", newResults);
  }

  getIndividualResults(topicState) {
    if (topicState === undefined)
      topicState = this.props.topicState;
    let results = {};
    if (this.props.topicState) {
      this.props.topicState.results.map(r => {
        if (r.type && r.type == this.key) {
          results = r;
        }
      })
    }
    return results;
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
