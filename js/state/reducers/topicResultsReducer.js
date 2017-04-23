import { TopicResultMap } from "../../models"
import Immutable from "immutable"
import { REHYDRATE } from "redux-persist/constants"
import * as Types from "../types"

const isPersistable = false;
const TopicResultsState = Immutable.Record({
    list: new TopicResultMap(),
    isCollected: false,
    isCollecting: false,
    collectError: null
})

var initialState = new TopicResultsState();

export default function(state = initialState, action = {}) {

  switch (action.type) {

    case REHYDRATE: {
      if (action.payload["topicResults"]) {
        if (isPersistable) {
          state = new TopicResultsState().mergeDeep(action.payload["topicResults"]);
        }
        else state = new TopicResultsState();
      }
      return state;  
    }

    case Types.TOPIC_RESULTS_REQUEST: {
      state = state.set("list", new TopicResultMap())
        .set("isCollected", false)
        .set("isCollecting", true)
        .set("collectError", null)
      return state;
    }

    case Types.TOPIC_RESULTS_SUCCESS: {
      const results = action.payload;
      state = state.set("list", results)
        .set("isCollected", true)
        .set("isCollecting", false)
        .set("collectError", null)
      return state;
    }

    case Types.TOPIC_RESULTS_FAILURE: {
      const {error} = action.payload;
      state = state.set("isCollected", false)
        .set("isCollecting", false)
        .set("collectError", error)
      return state;
    }

    case Types.TOPIC_RESULTS_RESET: {
      state = state.set("list", new TopicResultMap())
        .set("isCollected", false)
        .set("isCollecting", false)
        .set("collectError", null)
      return state;
    }

    default:
      return state;
  }
}
