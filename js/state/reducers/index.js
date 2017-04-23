import { combineReducers } from "redux"
import nav from "./navReducer"
import auth from "./authReducer"
import topics from "./topicReducer"
import profile from "./profileReducer"
import orgs from "./orgReducer"
import members from "./memberReducer"
import prefs from "./prefsReducer"
import messaging from "./messagingReducer"
import topicStates from "./topicStateReducer"
import topicResults from "./topicResultsReducer"

export default combineReducers({
  nav,
  auth,
  topicStates,
  topics,
  profile,
  orgs,
  members,
  prefs,
  messaging,
  topicResults
});
