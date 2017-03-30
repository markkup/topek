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
  }
  
}