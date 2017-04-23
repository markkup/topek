
import React, { Component } from "react"
import { StyleSheet, View, Text, Button, Animated, ActivityIndicator, Image, TouchableOpacity, TouchableHighlight } from "react-native"
import { ToolbarButton, AvatarImage, ErrorHeader, WorkingOverlay, TopicImage, AnimatedModal, Toolbar } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, DescriptionField } from "../react-native-fieldsX"
import Layout from "../lib/Layout"
import { TopicActions } from "../state/actions"
import { TopicSelectors } from "../state/selectors"
import Styles, { Color, Dims, TextSize } from "../styles"

import ActionSheet from "react-native-actionsheet"

import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons"
import Ionicon from "react-native-vector-icons/Ionicons"

// event
import Datetime from "../lib/datetime"
import MapView from "react-native-maps"

// fields
class TopicDetailGroup extends Component {
  render() {
    let title = null;
    if (this.props.title) {
      title = (
        <View>
          <Text style={{color:"#777"}}>{this.props.title.toUpperCase()}</Text>
        </View>
      )
    }
    return (
      <View style={{backgroundColor: Color.white}}>
        <View style={{paddingHorizontal: 15,paddingVertical: 10,borderTopWidth: 0}}>
          {title}
          {this.props.children}
        </View>
        {this.props.border && <View style={styles.gutter} />}
      </View>
    )
  }
}

TopicDetailGroup.propTypes = {
  border: React.PropTypes.bool
}

TopicDetailGroup.defaultProps = {
  border: true
}

class TopicDetailField extends Component {
  render() {
    let title = null;
    if (this.props.title) {
      title = (
        <View>
          <Text style={{color:"#777"}}>{this.props.title.toUpperCase()}</Text>
        </View>
      )
    }
    return (
      <View style={{flex:1,flexDirection:"row",marginBottom:5,marginTop:5}}>
        {this.props.icon ? 
        <SimpleLineIcon name={this.props.icon} size={16} color={Color.subtle} style={{marginRight: 10,marginTop:2}} /> :
        null}
        <View style={{flex:1}}>
          <Text style={{color:"#555",fontSize:TextSize.normal}}>{this.props.text}</Text>
          {this.props.subtext && <Text style={{color:"#999",fontSize:TextSize.tiny}}>{this.props.subtext}</Text>}
        </View>
      </View>
    )
  }
}


class Props extends PropMap {
  map(props) {
    props.topic = TopicSelectors.getCurrentTopic(this.state);
    props.topicState = TopicSelectors.getCurrentTopicState(this.state);
    props.isUpdating = TopicSelectors.getCurrentTopicIsUpdating(this.state);
    props.updateError = TopicSelectors.getCurrentTopicUpdatingError(this.state);
    props.user = this.state.profile.user;
    props.isCollectingResults = this.state.topicResults.isCollecting;
    props.hasCollectedResults = this.state.topicResults.isCollected;
    props.collectedResults = this.state.topicResults.list;
    props.isOwner = props.topic && props.topic.owner.id == this.state.profile.user.id;
    props.updateTopicState = this.bindEvent(TopicActions.updateTopicState);
    props.collectResults = this.bindEvent(TopicActions.collectResults);
    props.clearResults = this.bindEvent(TopicActions.clearResults);
    props.deleteClick = this.bindEvent(TopicActions.destroy);
  }
}

@connectprops(Props)
export default class TopicDetailsScreen extends Component {

  static navigationOptions = {
    title: " ",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarButton name="more-horz" tint={Color.tint} onPress={() => state.params.rightClick()} />
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      event: {},
      poll: {}
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      rightClick: () => this.props.isOwner ? this.moreSheetForOwner.show() : this.moreSheetForMember.show()
    });

    this._pollInit();
  }

  componentWillUnmount() {
    this._pollDestroy();
  }

  render() {
    let { scrollY } = this.state;
    const { topic } = this.props;

    if (!topic) {
      return (
        <View style={Styles.screenFields}>
          <ErrorHeader text="This topic has been deleted" />
        </View>
      )
    }

    let descr = null
    if (topic.description) {
      descr = (
        <View>
          <TopicDetailGroup border={true}>
            <Text style={{fontSize:TextSize.small,color:"#555"}}>{topic.description}</Text>
          </TopicDetailGroup>
        </View>
      )
    }

    return (
      <View style={Styles.screen}>

        <WorkingOverlay visible={this.props.isUpdating} />
        <ErrorHeader text={this.props.updateError} />

        <AnimatedModal ref="photoViewer">
          <View style={{marginTop: 22,flexDirection: "column"}}>
            <View style={{flexDirection:"row", justifyContent:"flex-end", marginBottom:50, marginRight:10}}>
              <ToolbarButton name="close" tint={Color.white} onPress={() => {this._showPhotoViewer(false)}} />
            </View>
            <TopicImage image={topic.image} size={Layout.window.width} />
         </View>
        </AnimatedModal>

        <View style={styles.animatedContainer}>
          <Animated.ScrollView
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}>
            {this._renderHeader()}
            <View style={styles.contentContainerStyle}>

              {descr}

              {this._renderDetails()}

              {this._renderMembers()}

            </View>
          </Animated.ScrollView>
        </View>

        {/*this._renderTitlebar()*/}

        <ActionSheet 
          ref={(c) => this.moreSheetForOwner = c}
          options={["Cancel", "Delete", "Add/Edit Details"]}
          cancelButtonIndex={0}
          destructiveButtonIndex={1}
          onPress={this._handleMoreForOwner.bind(this)}
        />

        <ActionSheet 
          ref={(c) => this.moreSheetForMember = c}
          title="You cannot edit this topic"
          options={["Cancel"]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this._handleMoreForMember.bind(this)}
        />
      </View>
    )
  }

  _renderMembers() {
    const { members } = this.props.topic;
    const { navigate } = this.props.navigation;

    let children = members.map((member, i) => this._renderMemberAvatar(member, i));

    return (
      <TopicDetailGroup title="Members" border={false}>
        <TouchableHighlight onPress={() => {navigate("TopicMembers")}} accessory={true} style={{paddingVertical:6}}>
          <View style={{flexDirection:"row", minHeight:35}}>
            { children }
          </View>
        </TouchableHighlight>
      </TopicDetailGroup>
    )
  }

  _renderMemberAvatar(member, i) {
    return (<AvatarImage key={i} user={member} background="dark" style={[styles.ownerAvatar, {marginRight:2}]} />)
  }

  _renderHeader() {
    let { scrollY } = this.state;
    const { topic } = this.props;

    let infoOpacity = scrollY.interpolate({
      inputRange: [-200, 0, 150],
      outputRange: [1, 1, 0],
    });

    let headerBackgroundTranslateY = scrollY.interpolate({
      inputRange: [-1, 0],
      outputRange: [0.2, 0],
    });

    let bottomTranslateY = scrollY.interpolate({
      inputRange: [-10, 0, 1],
      outputRange: [-3, 0, 0],
    });

    let image = null;
    if (topic.image && topic.image.valid) {
      image = (<TouchableOpacity onPress={() => this._showPhotoViewer(true)} activeOpacity={0.9}>
        <TopicImage style={styles.image} image={topic.image} />
      </TouchableOpacity>)
    }

    let captionFontSize = 24;
    if (image) {
      captionFontSize = TextSize.normal;
    }

    return (
      <View style={{backgroundColor: Color.white}}>
        <Animated.View 
          style={[styles.headerBackground, { transform: [{translateY: headerBackgroundTranslateY}] }]}
        />
        <Animated.View 
          style={[styles.header]}>
          <Animated.View 
            style={[styles.caption, {transform: [{translateY: bottomTranslateY}]}]}>
            {image}
            <View style={styles.captionFrame}>
              <Text style={[styles.captionTitle, {fontSize: captionFontSize}]}>{topic.name}</Text>
              <View style={styles.ownerContainer}>
                <AvatarImage user={topic.owner} size={20} background="dark" style={styles.ownerAvatar} />
                <Text style={styles.owner}>{topic.owner.alias}</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
        <View style={styles.gutter} />
      </View>
    );
  }

  _renderTitlebar() {
    let { scrollY } = this.state;
    const { topic } = this.props;

    let titleOpacity = scrollY.interpolate({
      inputRange: [-100, 0, 50],
      outputRange: [0, 0, 1],
    });

    return (
      <Animated.View style={[styles.titlebar, {opacity: titleOpacity}]}>
        <View style={styles.titlebarTextContainer}>
          <Text 
            style={[styles.titlebarText]}
            numberOfLines={1}
            ellipsizeMode="tail">{topic.name}</Text>
        </View>
      </Animated.View>
    )
  }

  _renderDetails() {
    const { topic } = this.props;

    let children = [];
    if (topic.details) {
      topic.details.map((detail, i) => {
        if (detail.type == "event") {
          children.push(this._renderEvent(detail, detail.type + i))
          //children.push(<View key={detail.type + i + "gutter"} style={styles.gutter} />)
        }
        else if (detail.type == "poll") {
          children.push(this._pollRender(detail, detail.type + i))
          //children.push(<View key={detail.type + i + "gutter"} style={styles.gutter} />)
        }
        else {
          children.push(
            <TopicDetailGroup key={detail.type + i}>
              <Text style={{fontSize: TextSize.normal}}>{detail.title}</Text>
            </TopicDetailGroup>
          )
          //children.push(<View key={detail.type + i + "gutter"} style={styles.gutter} />)
        }
      });
    }

    if (children.length == 0)
      return null;

    return (
      <View>
        {children}
      </View>
    )
  }

  _getDetails(key) {
    let result = null;
    this.props.topic.details.map(detail => {
      if (detail.type == key) {
        result = detail;
      }
    });
    return result;
  }

  _pollInit() {
    if (this._pollCanShowResults() && !this.props.isCollectingResults && !this.props.hasCollectedResults) {
      this.props.collectResults(this.props.topic.id);
    }
  }

  _pollDestroy() {
    this.props.clearResults();
  }

  _pollCanShowResults() {
    let details = this._getDetails("poll");
    if (details) {
      return (this.props.isOwner || (this._pollHasSelected() && details.publicResults));
    }
    return false;
  }

  _pollRender(detail, key) {
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
      let data = [];
      detail.answers.map((ans, i) => {
        let votes = 0;
        let selected = i + 1;
        this.props.collectedResults.map(s => {
          if (s.results) {
            s.results.map(r => {
              if (r.type && r.type == "poll" && r.selected == selected) {
                votes++;
              }
            })
          }
        })
        data.push({
          answer: ans,
          votes: votes,
          width: votes == 0 ? 16 : (300 / this.props.collectedResults.size * votes)
        })
      });

      let selected = this._pollGetSelected();

      resultsPanel = (
        <TopicDetailGroup title="Results" border={true}>
          {!this.props.hasCollectedResults &&
          <ActivityIndicator />}
          <View style={{paddingTop:8}}>
          {this.props.hasCollectedResults && data.map((point, i) => {
            return (
              <View style={styles.pollResultsItem} key={i}>
                <Text style={styles.pollResultsLabel}>{point.answer}</Text>
                <View style={styles.pollResultsData}>
                  {point.width &&
                    <Animated.View style={[styles.pollResultsBar, styles["pollResultsPoints" + (i + 1)], {width: point.width}]} />
                  }
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
              {(i + 1) == this.state.poll.selected ?
              <Ionicon name="ios-radio-button-on" size={28} color={Color.tint} /> :
              <Ionicon name="ios-radio-button-off" size={28} color={Color.subtle} />}
              <Text style={styles.pollAnswerText}>{ans}</Text>
            </View>
          </TouchableHighlight>
        )
      })
      let bgColor = this.state.poll.selected ? Color.tint : Color.lightGray;
      let disabled = this.state.poll.selected === undefined;
      answersPanel = (
        <TopicDetailGroup border={true}>
          {answers}
          <TouchableOpacity style={{width: 100,marginTop: 14, marginLeft: 0,marginBottom: 10}} disabled={disabled} onPress={() => this._pollSubmit()}>
            <View style={{backgroundColor: bgColor,borderRadius: 4,padding: 10}}>
              <Text style={{color: Color.white,fontWeight: "600", fontSize: TextSize.normal,textAlign: "center"}}>{"Submit"}</Text>
            </View>
          </TouchableOpacity>
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

  _pollSelect(index) {
    this.setState({
      poll: {
        selected: index
      }
    })
  }

  _pollGetSelected() {
    let result = 0;
    if (this.props.topicState) {
      this.props.topicState.results.map(r => {
        if (r.type && r.type == "poll") {
          if (r.selected)
            result = r.selected;
        }
      });
    }
    return result;
  }

  _pollHasSelected() {
    return (this._pollGetSelected() > 0);
  }

  _pollGetSelectedAnswer() {
    let selected = this._pollGetSelected();
    if (selected <= 0)
      return "";
    let pollDetails = this._getDetails("poll");
    if (!pollDetails)
      return "";
    if ((selected - 1) < pollDetails.answers.length)
      return pollDetails.answers[selected - 1];
    return "";
  }

  async _pollSubmit() {
    let results = this.props.topicState.results.slice(0);
    let pollResult = null;
    results.map(r => {
      if (r.type && r.type == "poll")
        pollResult = r;
    });
    if (!pollResult) {
      pollResult = { type: "poll" };
      results.push(pollResult);
    }

    pollResult.selected = this.state.poll.selected;

    await this.props.updateTopicState(this.props.topic.id, "results", results);

    if (this._pollCanShowResults()) {
      this.props.collectResults(this.props.topic.id);
    }
  }

  _renderEvent(detail, key) {
    let start = Datetime(detail.startDate);
    let end = Datetime(detail.endDate);
    let when = "";
    if (detail.allDay == true) {
      when = ""
      if (start.isSame(end, "day"))
        when += start.format("LL")
      else
        when += start.format("LL") + " to " + end.format("LL")
    }
    else {
      if (start.isSame(end, "day"))
        when += start.format("LLL") + " to " + end.format("h:mm A")
      else
        when += start.format("LLL") + " to " + end.format("LLL")
    }
    if (when) when = when.replace(/:00/g, "")
    if (when) when = when.replace(" " + new Date().getFullYear(), "")

    let where = null;
    if (detail.location) {
      where = (
        <View key={key}>
          <TopicDetailField text={detail.location.name} subtext={detail.location.address} icon="location-pin" />
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              scrollEnabled={false}
              zoomEnabled={false}
              rotateEnabled={false}
              pitchEnabled={false}
              initialRegion={{
                latitude: detail.location.geo.lat,
                longitude: detail.location.geo.lng,
                latitudeDelta: detail.location.viewport.lat,
                longitudeDelta: detail.location.viewport.lng,
              }}
            >
              <MapView.Marker
                coordinate={{
                  latitude: detail.location.geo.lat,
                  longitude: detail.location.geo.lng
                  }}
                title={detail.location.name}
                description={detail.location.address}
              />
            </MapView>
          </View>
        </View>
      )
    }
    else if (detail.locationName && detail.locationName != "") {
      where = (
        <View title="Where" key={key}>
          <TopicDetailField text={detail.locationName} icon="location-pin" />
        </View>
      )
    }

    return (
      <View key={key}>
        <TopicDetailGroup>
          <TopicDetailField text={when} icon="clock" />
          {where}
        </TopicDetailGroup>
      </View>
    )
  }

  async _handleMoreForOwner(index) {
    if (index == 1) {
      if (await this.props.deleteClick(this.props.topic.id))
        this.props.navigation.goBack(null);
    }
    else if (index == 2) {
      this.props.navigation.navigate("TopicDetailsEdit")
    }
  }

  _handleMoreForMember(index) {
    
  }

  _showPhotoViewer(visible) {
    this.refs.photoViewer.show(visible, true);
  }
}

const HeaderHeight = 240;

let styles = StyleSheet.create({
  animatedContainer: {
    flex: 1,
    flexDirection: "column", 
    backgroundColor: Color.backgroundFields
  },
  headerBackground: {
    position: "absolute",
    top: -Layout.window.height + Dims.navbarHeight,
    left: 0,
    right: 0,
    height: Layout.window.height,
    backgroundColor: "#fff"
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 6,
    paddingBottom: 20,
    //borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator
  },
  contentContainerStyle: {
    paddingBottom: 20
  },
  image: {
    marginRight: 15, 
    borderRadius: 4
  },
  caption: {
    flexDirection: "row",
    paddingHorizontal: Dims.horzPadding,
  },
  captionFrame: {
    flex: 1
  },
  captionTitle: {
    color: "#000",
    fontWeight: "500"
  },
  ownerContainer: {
    flexDirection: "row",
    paddingTop: 10
  },
  ownerAvatar: {
  },
  owner: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginTop: 1,
    marginLeft: 4
  },
  titlebar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0, 
    height: 36,
    backgroundColor: Color.tint,
    flexDirection: "row",
    flex: 1
  },
  titlebarTextContainer: {
    paddingHorizontal: Dims.horzPadding,
    paddingTop: 4
  },
  titlebarText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: Color.white
  },
  gutter: {
    height: 0,
    marginLeft: 15,
    paddingTop: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator,
    backgroundColor: Color.white
  },


  // event
  mapContainer: {
    height: 130,
    marginTop: 16,
    marginBottom: 8,
    borderColor: Color.subtle,
    borderRadius: 4
  },
  map: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 130
  },


  // poll
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
    color: Color.subtle,
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
