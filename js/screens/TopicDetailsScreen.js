
import React, { Component } from "react"
import { StyleSheet, View, Text, Button, Animated, ActivityIndicator, Image, TouchableOpacity, TouchableHighlight } from "react-native"
import { ToolbarButton, AvatarImage, ErrorHeader, WorkingOverlay, TopicImage, AnimatedModal, Toolbar } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import { Field, FieldGroup, TouchableField, DescriptionField } from "../react-native-fieldsX"
import Layout from "../lib/Layout"
import { TopicActions } from "../state/actions"
import Styles, { Color, Dims, TextSize } from "../styles"

import ActionSheet from "react-native-actionsheet"

import SimpleLineIcon from "react-native-vector-icons/SimpleLineIcons"

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
      <View style={{paddingHorizontal: 15,paddingVertical: 15,borderTopWidth: 0, backgroundColor: Color.white}}>
        {title}
        {this.props.children}
      </View>
    )
  }
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
        <SimpleLineIcon name={this.props.icon} size={16} color={Color.subtle} style={{marginRight: 10,marginTop:2}} />
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
      right: <ToolbarButton name="more-horz" tint={Color.tint} onPress={() => state.params.rightClick()} />
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

    let descr = null
    if (topic.description) {
      descr = (
        <View>
          <TopicDetailGroup>
            <Text style={{fontSize:TextSize.small,color:"#555"}}>{topic.description}</Text>
          </TopicDetailGroup>
          <View style={styles.gutter} />
        </View>
      )
    }

    return (
      <View style={Styles.screen}>

        <WorkingOverlay visible={this.props.isUpdating} />
        { this.props.updateError && <ErrorHeader text={this.props.updateError} /> }

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

              <View style={styles.gutter} />

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
    const { members, isLoadingMembers } = this.props;
    const { navigate } = this.props.navigation;

    return (
      <TopicDetailGroup title="Members">
        <TouchableHighlight onPress={() => {navigate("TopicMembers")}} accessory={true} style={{paddingVertical:6}}>
          <View style={{flexDirection:"row", minHeight:35}}>
            { isLoadingMembers
              ? <ActivityIndicator />
              : members.valueSeq().map((member, i) => this._renderMemberAvatar(member, i)) }
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

    let captionFontSize = 22;
    if (image) {
      captionFontSize = TextSize.normal;
    }

    return (
      <View>
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

    if (topic.details.type == "event") {
      return this._renderEvent();
    }

    let children = [];
    if (topic.details) {
      topic.details.map((detail, i) => {
        if (detail.type == "event") {
          children.push(this._renderEvent(detail, detail.type + i))
          children.push(<View key={detail.type + i + "gutter"} style={styles.gutter} />)
        }
        else {
          children.push(
            <TopicDetailGroup key={detail.type + i}>
              <Text style={{fontSize: TextSize.normal}}>{detail.title}</Text>
            </TopicDetailGroup>
          )
          children.push(<View key={detail.type + i + "gutter"} style={styles.gutter} />)
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
    paddingTop: 0,
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
    height: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Color.separator,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.separator,
    backgroundColor: "rgb(248, 247, 250)"
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
  }
})
