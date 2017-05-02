import React, { Component } from "react"
import { StyleSheet, View, Text, Animated, ActivityIndicator, TouchableHighlight } from "react-native"
import { ActionButton, TopicDetailGroup, TopicDetailField } from "./"
import Immutable from "immutable"
import Ionicon from "react-native-vector-icons/Ionicons"
import Styles, { Color, Dims, TextSize } from "../styles"

import TopicDetailBase from "./TopicDetailBase"

export default class TopicDetailPoll extends TopicDetailBase {

  constructor(props) {
    super(props);
    this.key = "poll";
    this.state = {
    }
  }

  init() {
    this._pollLoadResults();
  }

  destroy() {
    this.props.clearResults();
  }

  updateWithCollectedResults(results) {
    // set initial answer graph widths in state
    let data = this._pollGetData(results);
    let widths = {};
    setTimeout(() => {
      Animated.parallel(data.map(d => {
        return Animated.timing(this.state.widths["point" + d.index], {toValue: d.width})
      })).start()
    });
  }

  render() {
    const { detail } = this.props;

    let resultsPanel = null;
    let questionsPanel = null;
    let answersPanel = null;

    questionsPanel = (
      <TopicDetailGroup border={true}>
        <TopicDetailField text={"Q: " + detail.question} />
      </TopicDetailGroup>
    )

    if (this._pollCanShowResults()) {

      // create results data
      let data = this._pollGetData(this.props.collectedResults);
      let selected = this._pollGetSelected();

      resultsPanel = (
        <TopicDetailGroup title="Results" border={true} refreshing={!this.props.hasCollectedResults} onRefresh={() => this._pollLoadResults(true)}>
          <View style={{paddingTop:8}}>
          {data.map((point, i) => {
            let width = this.state.widths ? this.state.widths["point" + point.index] : 16;
            return (
              <View style={styles.pollResultsItem} key={i}>
                <Text style={styles.pollResultsLabel}>{point.answer}</Text>
                <View style={styles.pollResultsData}>
                  <Animated.View style={[styles.pollResultsBar, styles["pollResultsPoints" + (i + 1)], {width: width}]} />
                  <Text style={styles.pollResultsDataNumber}>{point.votes}</Text>
                  {selected == (i + 1) && <View style={{backgroundColor:Color.tint,borderRadius:5,marginLeft:6,padding:2,height:16}}>
                    <Text style={[styles.pollResultsDataNumber, {fontSize:9,padding:0,color:Color.white}]}>{"YOU"}</Text>
                  </View>}
                </View>
              </View>
            )
          })}
          </View>

        </TopicDetailGroup>
      )
    }

    if (!this.props.isOwner && !this._pollHasSelected()) {
      let answers = detail.answers.map((ans, i) => {
        return (
          <TouchableHighlight 
            key={i}
            onPress={() => this._pollSelect(i + 1)}
            underlayColor={"#eee"}>
            <View style={styles.pollAnswer}>
              {(i + 1) == this.state.selected ?
              <Ionicon name="ios-radio-button-on" size={28} color={Color.tint} /> :
              <Ionicon name="ios-radio-button-off" size={28} color={Color.subtle} />}
              <Text style={styles.pollAnswerText}>{ans}</Text>
            </View>
          </TouchableHighlight>
        )
      })
      let disabled = this.state.selected === undefined;
      answersPanel = (
        <TopicDetailGroup border={true}>
          {answers}
          <ActionButton 
            title={"Submit"} 
            onPress={() => this._pollSubmit()}
            disabled={disabled}
            style={{marginTop: 14, marginLeft: 0,marginBottom: 10}} />
        </TopicDetailGroup>
      )
    }
    return (
      <View key={key}>
        {questionsPanel}
        {answersPanel}
        {resultsPanel}
      </View>
    )
  }

  // poll specific members
  _pollLoadResults(force) {
    if (force === undefined) force = false;
    if (this._pollCanShowResults() && !this.props.isCollectingResults && (!this.props.hasCollectedResults || force)) {
      // set initial answer graph widths in state
      if (!this.state.widths) {
        let data = this._pollGetData();
        let widths = {};
        data.map(d => widths["point" + d.index] = new Animated.Value(16));
        this.setState({
          widths: widths
        });
      }

      // kick-off collection
      this.props.collectResults(this.props.topic.id);
    }
  }

  _pollCanShowResults() {
    let detail = this.props.detail;
    if (detail) {
      return (this.props.isOwner || (this._pollHasSelected() && detail.publicResults));
    }
    return false;
  }

  _pollGetData(results) {
    let data = [];
    this.props.detail.answers.map((ans, i) => {
      let votes = 0;
      let selected = i + 1;
      if (results) {
        results.map(s => {
          if (s.results) {
            s.results.map(r => {
              if (r.type && r.type == this.key && r.selected == selected) {
                votes++;
              }
            })
          }
        })
      }
      data.push({
        index: (i + 1),
        answer: ans,
        votes: votes,
        width: votes == 0 ? 16 : (300 / results.size * votes)
      })
    })
    return data;
  }

  _pollSelect(index) {
    this.setState({
      selected: index
    })
  }

  _pollGetSelected() {
    let results = this.getIndividualResults();
    if (results.selected)
      return results.selected;
    return 0;
  }

  _pollHasSelected() {
    return (this._pollGetSelected() > 0);
  }

  _pollGetSelectedAnswer() {
    let selected = this._pollGetSelected();
    if (selected <= 0)
      return "";
    let pollDetails = this.props.detail;
    if (!pollDetails)
      return "";
    if ((selected - 1) < pollDetails.answers.length)
      return pollDetails.answers[selected - 1];
    return "";
  }

  async _pollSubmit() {
    await this.submit({
      selected: this.state.selected
    })
    this._pollLoadResults();
  }

}

let styles = StyleSheet.create({
  pollAnswer: {
    flexDirection: "row",
    padding: 6,
    marginTop: 6
  },
  pollAnswerText: {
    flex: 1,
    fontSize: TextSize.normal,
    marginLeft: 10,
    marginTop: 4
  },
  pollResultsItem: {
    flexDirection: 'column',
    marginBottom: 5,
    paddingHorizontal: 0
  },
  pollResultsLabel: {
    color: Color.slate,
    fontWeight: "600",
    flex: 1,
    fontSize: 14,
    position: 'relative',
    top: 2,
    marginBottom: 4
  },
  pollResultsData: {
    flex: 2,
    flexDirection: 'row'
  },
  pollResultsDataNumber: {
    color: Color.subtle,
    fontSize: 13
  },
  pollResultsBar: {
    alignSelf: 'center',
    borderRadius: 8,
    height: 16,
    marginRight: 5
  },
  pollResultsPoints1: {
    backgroundColor: '#7B7FEC'
  },
  pollResultsPoints2: {
    backgroundColor: '#FCBD24'
  },
  pollResultsPoints3: {
    backgroundColor: '#59838B'
  },
  pollResultsPoints4: {
    backgroundColor: '#4D98E4'
  },
  pollResultsPoints5: {
    backgroundColor: '#7B7FEC'
  },
  pollResultsPoints6: {
    backgroundColor: '#FCBD24'
  },
  pollResultsPoints7: {
    backgroundColor: '#59838B'
  },
  pollResultsPoints8: {
    backgroundColor: '#4D98E4'
  }
})
