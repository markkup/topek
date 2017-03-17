
import React, { Component } from "react"
import { StyleSheet, View, Text, Button, Animated, ActivityIndicator } from "react-native"
import { ToolbarButton, AvatarImage, ErrorHeader, WorkingOverlay } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, DescriptionField } from "react-native-fields"
import Layout from "../lib/Layout"
import ActionSheet from "react-native-actionsheet"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.topic = this.state.topics.selectedTopic;
    props.members = this.state.topics.selectedTopicMembers;
    props.isLoadingMembers = this.state.topics.isLoadingMembers;
    props.user = this.state.profile.user;
    props.isOwner = this.state.topics.selectedTopic && this.state.topics.selectedTopic.owner.id == this.state.profile.user.id;
    props.isUpdating = this.state.topics.isUpdating;
    props.updateError = this.state.topics.updateError;
    props.deleteClick = this.bindEvent(TopicActions.destroy);
  }
}

@connectprops(Props)
export default class TopicDetailsScreen extends Component {

  static navigationOptions = {
    title: " ",
    header: ({state}, defaultHeader) => ({
      ...defaultHeader,
      right: <ToolbarButton name="more-horz" tint={Color.white} onPress={() => state.params.rightClick()} />
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
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

    return (
      <View style={Styles.screen}>

        <WorkingOverlay visible={this.props.isUpdating} />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }

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

              {topic.description &&
              <DescriptionField text={topic.description} />}


              {this._renderDetails()}
              {this._renderMembers()}

            </View>
          </Animated.ScrollView>
        </View>

        {this._renderTitlebar()}

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
    const { members, isLoadingMembers } = this.props;
    const { navigate } = this.props.navigation;

    return (
      <FieldGroup title="Members">
        <TouchableField onPress={() => {navigate("TopicMembers")}} accessory={true} style={{paddingVertical:6}}>
          <View style={{flexDirection:"row", minHeight:35}}>
            { isLoadingMembers
              ? <ActivityIndicator />
              : members.valueSeq().map((member, i) => this._renderMemberAvatar(member, i)) }
          </View>
        </TouchableField>
      </FieldGroup>
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
      inputRange: [-10, 0, 10],
      outputRange: [-3, 0, -11],
    });

    return (
      <View>
        <Animated.View 
          style={[styles.headerBackground, { transform: [{translateY: headerBackgroundTranslateY}] }]}
         />
        <Animated.View 
          style={[styles.header]}>
          <Animated.View 
            style={[styles.caption, {transform: [{translateY: bottomTranslateY}], opacity: infoOpacity}]}>
            <Text style={styles.captionTitle}>{topic.name}</Text>
            <View style={styles.ownerContainer}>
              <AvatarImage user={topic.owner} size={25} style={styles.ownerAvatar} />
              <Text style={styles.owner}>{topic.owner.alias}</Text>
            </View>
          </Animated.View>
        </Animated.View>
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
    const { navigate } = this.props.navigation;

    let children = [];
    const topic = this.props.topic;
    if (topic.details) {
      topic.details.map((detail, i) => {
        children.push(<Field key={detail.type + i} text={detail.title} />)
      });
    }

    if (!this.isOwner && children.length == 0)
      return null;

    return (
      <FieldGroup title="Details">
        {children}
        { this.isOwner && children.length == 0 ? <Field key={-1} text=" " /> : null }
      </FieldGroup>
    )
  }

  get isOwner() {
    return (this.props.topic.owner.id == this.props.user.id);
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
    backgroundColor: Color.tint,
  },
  header: {
    backgroundColor: Color.tint,
    paddingTop: 10,
    paddingBottom: 20
  },
  contentContainerStyle: {
    paddingBottom: 20
  },
  caption: {
    paddingHorizontal: Dims.horzPadding,
  },
  captionTitle: {
    color: "white",
    fontSize: 24,
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
    color: "#FFFFFFCC",
    marginTop: 4,
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
  }
})
