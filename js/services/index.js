import Parse from "parse/react-native"
import Log from "./logService"
import PushService from "./pushService"
import Config from "../config"

import { Topic } from "../models"
import * as Types from "../state/types"

export default {

  initialize: (dispatch) => {
  
    // initialize parse api
    console.log("Parse initialized: ", Config.serverKey, Config.serverURL)
    Parse.initialize(Config.serverKey);
    Parse.serverURL = `${Config.serverURL}/parse`;

    // initialize logging
    console.log("Logging initialized: ", Config.loggingLogKey, Config.loggingApiKey)
    Log.initialize(Config.loggingLogKey, Config.loggingApiKey);

    // initialize push
    console.log("Push initialized")
    PushService.initialize(dispatch);
  },

  setupLiveQueries: (dispatch) => {

    let queryTopic = new Parse.Query("Topic").include("owner").include("members").descending("updatedAt");
    let subscriptionTopic = queryTopic.subscribe();
    
    subscriptionTopic.on("create", (topic) => {
      console.log("LiveQuery(Topic) dispatch TOPICS_ADD_SUCCESS: ", topic);
      dispatch({type: Types.TOPICS_ADD_SUCCESS, payload: Topic.fromParse(topic)});
    });

    subscriptionTopic.on("update", (topic) => {
      console.log("LiveQuery(Topic) dispatch TOPICS_UPDATE_SUCCESS: ", topic);
      dispatch({type: Types.TOPICS_UPDATE_SUCCESS, payload: Topic.fromParse(topic)});
    });

    subscriptionTopic.on("delete", (topic) => {
      console.log("LiveQuery(Topic) dispatch TOPICS_REMOVE_SUCCESS: ", topic);
      dispatch({type: Types.TOPICS_REMOVE_SUCCESS, payload: topic.id});
    });

  }
}