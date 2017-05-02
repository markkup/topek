
import React, { Component } from "react"
import { StyleSheet, View, Text, Button, Animated, ActivityIndicator, Image, TouchableOpacity, TouchableHighlight } from "react-native"
import { ToolbarButton, AvatarImage, ErrorHeader, WorkingOverlay, TopicImage, AnimatedModal, Toolbar, ActionButton, TopicDetailGroup, TopicDetailField } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, DescriptionField } from "../react-native-fieldsX"
import Layout from "../lib/Layout"
import Immutable from "immutable"
import { TopicActions } from "../state/actions"
import { TopicSelectors } from "../state/selectors"
import Styles, { Color, Dims, TextSize } from "../styles"

import TopicDetailPoll from "../components/TopicDetailPoll"
import TopicDetailEvent from "../components/TopicDetailEvent"

import ActionSheet from "react-native-actionsheet"
import Ionicon from "react-native-vector-icons/Ionicons"

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
    props.dismissTopic = this.bindEvent(TopicActions.dismissTopic);
  }
}

@connectprops(Props)
export default class TopicDetailsScreen extends Component {

  static navigationOptions = {
    title: " ",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      style: Styles.navbarBorderless,
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
          title="Only the owner can edit this"
          options={["Cancel", "Ignore"]}
          cancelButtonIndex={0}
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
        <TouchableOpacity onPress={() => {navigate("TopicMembers")}} style={{paddingVertical:6}}>
          <View style={{flexDirection:"row", minHeight:35}}>
            { children }
          </View>
        </TouchableOpacity>
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

        let topicProps = {
          detail: detail,
          collectedResults: this.props.collectedResults,
          isCollectingResults: this.props.isCollectingResults,
          hasCollectedResults: this.props.hasCollectedResults,
          collectResults: this.props.collectResults,
          clearResults: this.props.clearResults,
          updateTopicState: this.props.updateTopicState,
          topic: this.props.topic,
          topicState: this.props.topicState,
          isOwner: this.props.isOwner
        }

        if (detail.type == "event") {
          children.push(<TopicDetailEvent key={detail.type + i} {...topicProps} />)
        }
        else if (detail.type == "poll") {
          children.push(<TopicDetailPoll key={detail.type + i} {...topicProps} />)
        }
        else {
          children.push(
            <TopicDetailGroup key={detail.type + i}>
              <Text style={{fontSize: TextSize.normal}}>{detail.title}</Text>
            </TopicDetailGroup>
          )
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

  async _handleMoreForOwner(index) {
    if (index == 1) {
      if (await this.props.deleteClick(this.props.topic.id))
        this.props.navigation.goBack(null);
    }
    else if (index == 2) {
      this.props.navigation.navigate("TopicDetailsEdit")
    }
  }

  async _handleMoreForMember(index) {
    if (index == 1) {
      await this.props.dismissTopic(this.props.topic.id, true);
      this.props.navigation.goBack(null);
    }
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
    fontWeight: "600",
    color: Color.slate,
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
  }
})
