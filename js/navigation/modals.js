import { StackNavigator } from "react-navigation"
import Styles, { Color, Dims } from "../styles"
import TabsNav from "./tabs"

import SettingsScreen from "../screens/SettingsScreen"

import TopicAddScreen from "../screens/TopicAddScreen"
import TopicAddTypeScreen from "../screens/TopicAddTypeScreen"
import TopicAddEventDetailsScreen from "../screens/TopicAddEventDetailsScreen"
import TopicAddPollDetailsScreen from "../screens/TopicAddPollDetailsScreen"
import TopicAddMembersScreen from "../screens/TopicAddMembersScreen"
import TopicAddConfirmScreen from "../screens/TopicAddConfirmScreen"

import ProfileScreen from "../screens/ProfileScreen"
import ProfileEditScreen from "../screens/ProfileEditScreen"

import MessagingScreen from "../screens/MessagingScreen"

import MemberSelectorScreen from "../screens/MemberSelectorScreen"

import ChooseLocationScreen from "../screens/ChooseLocationScreen"
import ChooseReminderScreen from "../screens/ChooseReminderScreen"
import ChooseAnswersScreen from "../screens/ChooseAnswersScreen"
import TestScreen from "../screens/TestScreen"

const modalOptions = {
  //initialRouteName: "TopicAddPollDetails",
  headerMode: "float",
  navigationOptions: {
    header: {
      style: Styles.navbarModal,
      titleStyle: Styles.navbarTitleModal,
      tintColor: Color.tint
    },
    cardStack: {
      gesturesEnabled: false
    }
  }
}

export const TopicAddStack = StackNavigator({
  TopicsAdd: { screen: TopicAddScreen },
  TopicAddType: { screen: TopicAddTypeScreen },
  TopicAddEventDetails: { screen: TopicAddEventDetailsScreen },
  TopicAddPollDetails: { screen: TopicAddPollDetailsScreen },
  TopicAddMembers: { screen: TopicAddMembersScreen },
  TopicAddConfirm: { screen: TopicAddConfirmScreen },
  ChooseLocation: { screen: ChooseLocationScreen },
  ChooseReminder: { screen: ChooseReminderScreen },
  ChooseAnswers: { screen: ChooseAnswersScreen }
}, modalOptions);

export const SettingsStack = StackNavigator({
  Settings: { screen: SettingsScreen },
  SecondScreen: { screen: TestScreen }
}, modalOptions);

export const ProfileStack = StackNavigator({
  Profile: { screen: ProfileScreen },
  SecondScreen: { screen: TestScreen }
}, modalOptions);

export const ProfileEditStack = StackNavigator({
  Settings: { screen: ProfileEditScreen },
  SecondScreen: { screen: TestScreen }
}, modalOptions);

export const MessagingStack = StackNavigator({
  Messaging: { screen: MessagingScreen }
}, modalOptions);

export const MemberSelectorStack = StackNavigator({
  MemberSelector: { screen: MemberSelectorScreen }
}, modalOptions);