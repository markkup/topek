import React, { Component } from "react"
import { StyleSheet, View, Text, Image, Animated, TouchableOpacity } from "react-native"
import { NavbarButton, ToolbarButton, AvatarImage, UserCell } from "../components"
import { connectprops, PropMap } from "react-redux-propmap"
import Layout from "../lib/Layout"
import { Field, FieldGroup, TouchableField, InputField, SwitchField, Form } from "../react-native-fieldsX"
import Styles, { Color, Dims } from "../styles"

class Props extends PropMap {
  map(props) {
    props.user = this.state.profile.user;
    props.orgs = this.state.orgs.list;
    props.org = this.state.prefs.org;
    props.members = this.state.members.list;
  }
}

@connectprops(Props)
export default class OrgScreen extends Component {

  static navigationOptions = {
    header: (navigation, defaultHeader) => ({
      ...defaultHeader,
      visible: false
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0)
    };
  }

  render() {
    let { scrollY } = this.state;

    const { navigate } = this.props.navigation;
    const { user, orgs, org } = this.props;

    if (!org) 
      return null;

    return (
      <View style={Styles.screen}>
        <View style={styles.animatedContainer}>
          {this._renderHeader()}
          <Animated.ScrollView
            scrollEventThrottle={16}
            style={StyleSheet.absoluteFill}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}>
            <View style={styles.headerSpacer} />
            <View style={styles.contentContainerStyle}>
              <Form onChange={this._handleFormChange.bind(this)}>
                <FieldGroup>
                  <InputField label="Name" value={org.name} editable={false} />
                </FieldGroup>
                <FieldGroup title="Admins">
                  <Field style={{paddingVertical:4,paddingHorizontal:0}} >
                    <UserCell user={org.owner} />
                  </Field>
                </FieldGroup>
              </Form>
            </View>
          </Animated.ScrollView>
        </View>
        {this._renderNavbar()}
      </View>
    )
  }

  _renderNavbar() {
    let { scrollY } = this.state;

    let titleOpacity = scrollY.interpolate({
      inputRange: [-200, 0, 100],
      outputRange: [0, 0, 1],
    });

    const { navigate, goBack } = this.props.navigation;

    return (
      <View style={styles.navbar}>
        <ToolbarButton 
          name="arrow-back" 
          tint={Color.white} 
          style={styles.navbarButton}
          onPress={() => goBack(null)} /> 
        <View style={styles.navbarTextContainer}>
          <Animated.Text style={[styles.navbarText, {opacity: titleOpacity}]}>{this.props.user.name}</Animated.Text>
        </View>
        <ToolbarButton 
          name="settings" 
          tint={Color.white} 
          style={styles.navbarButton}
          onPress={() => navigate("ProfileEditStack")} /> 
      </View>
    )
  }

  _renderHeader() {
    let { scrollY } = this.state;

    if (!this.props.user.avatar)
      return null;
      
    let imgScale = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [1.5, 1, 1],
    });

    let imgTranslateY = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [40, 0, -40],
    });

    let imgOpacity = scrollY.interpolate({
      inputRange: [-200, 0, 100],
      outputRange: [1, 1, 0],
    });

    let infoOpacity = scrollY.interpolate({
      inputRange: [-200, 0, 150],
      outputRange: [1, 1, 0],
    });

    let bottomTranslateY = scrollY.interpolate({
      inputRange: [-150, 0, 150],
      outputRange: [120, 0, -220],
    });

    let headerBackgroundTranslateY = scrollY.interpolate({
      inputRange: [-1, 0],
      outputRange: [1, 0],
    });

    const { org } = this.props;

    if (!org.image || !org.icon)
      return null;

    let imageSource = require("../assets/images/circle-user-man-512.png")
    if (org.image.valid) {
      imageSource = {
        uri: org.image.url
      }
    }

    let iconSource = require("../assets/images/group-128.png")
    if (org.icon.valid) {
      iconSource = {
        uri: org.icon.url
      }
    }

    return (
      <View>
        <Animated.Image 
          source={imageSource}
          style={[styles.headerBackground, { transform: [{translateY: headerBackgroundTranslateY}] }]}
         />
        <View style={styles.header}>
          <Animated.View
            style={{marginTop: -100, opacity: imgOpacity, transform: [{scale: imgScale}, {translateY: imgTranslateY}]}}>
            <Image
              source={iconSource}
              style={{width:100, height:100}}
            />
          </Animated.View>
          <Animated.View style={[styles.headerBottomContainer, {transform: [{translateY: bottomTranslateY}], opacity: infoOpacity}]}>
            <Text style={styles.headerLine1}>{org.name}</Text>
            <Text style={styles.headerLine2}>Group</Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  _handleFormChange(data) {
    if (data["notifications"] !== undefined && data["notifications"] == true) {
      this.props.notificationsClick();
    }
  }

}

const HeaderHeight = 240;

let styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: "transparent",
    flexDirection: "row"
  },
  navbarButton: {
    paddingTop: 22,
    paddingLeft: 6,
    paddingRight: 6
  },
  navbarTextContainer: {
    paddingTop: 20,
    flex: 1
  },
  navbarText: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "600",
    color: Color.tintNavbar,
    paddingTop: 12
  },
  animatedContainer: {
    flex: 1,
    flexDirection: "column", 
    backgroundColor: Color.backgroundFields
  },
  headerBackground: {
    backgroundColor: Color.tint,
    height: HeaderHeight + 300, 
    marginTop: -300
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HeaderHeight + 200,
    marginTop: -30,
    alignItems: "center",
    justifyContent: "center"
  },
  headerSpacer: {
    width: Layout.window.width,
    height: HeaderHeight,
    backgroundColor: "transparent",
  },
  headerBottomContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    paddingTop: 10
  },
  headerLine1: {
    fontSize: 18,
    fontWeight: "600",
    color: "white"
  },
  headerLine2: {
    fontSize: 16, 
    color: "white"
  },
  contentContainerStyle: {
    paddingBottom: 20
  },
  avatar: {
    width: 100, 
    height: 100, 
    resizeMode: "contain", 
    borderRadius: 50,
    marginTop: -100,
    backgroundColor: "rgba(255, 255, 255, 0.0)"
  },
  memberContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  memberNameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    marginLeft: 4
  },
  memberAlias: {
    color: Color.subtle,
    marginLeft: 4
  }
})
