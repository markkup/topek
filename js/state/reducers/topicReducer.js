import { Topic, TopicMap } from "../../models"
import Immutable from "immutable"
import { REHYDRATE } from "redux-persist/constants"
import * as Types from "../types"

const isPersistable = false;
const TopicState = Immutable.Record({
  list: new TopicMap(),
  selectedTopic: null,
  isRefreshing: false,
  isUpdating: false,
  loadError: null,
  updateError: null
})

let initialState = new TopicState();

export default function(state = initialState, action = {}) {

  switch (action.type) {

    case REHYDRATE: {
      if (action.payload["topics"]) {
        if (isPersistable) {
          state = new TopicState().set("list", new TopicMap(action.payload["topics"].list))
            .set("isUpdating", false)
            .set("updateError", null)
            .set("isRefreshing", false)
            .set("loadError", null);
        }
        else state = new TopicState();
      }
      return state;  
    }

    case "Navigation/BACK":
    case "Navigation/NAVIGATE": {
      state = state.set("loadError", null).set("updateError", null)
      return state;
    }

    case Types.TOPICS_LOAD_REQUEST: {
      state = state.set("isRefreshing", true)
        .set("loadError", null)
      return state;
    }

    case Types.TOPICS_LOAD_SUCCESS: {
      const topics = action.payload;
      state = state.set("list", topics)
        .set("isRefreshing", false)
        .set("loadError", null)
      if (state.selectedTopic) {
        state = state.set("selectedTopic", state.list.find((v, k) => k == state.selectedTopic.id))
      }
      return state;
    }

    case Types.TOPICS_LOAD_FAILURE: {
      const {error} = action.payload;
      state = state.set("isRefreshing", false)
        .set("loadError", error)
      return state;
    }

    case Types.TOPICS_UPDATE_REQUEST: {
      state = state.set("isUpdating", true)
        .set("updateError", null)
      return state;
    }

    case Types.TOPICS_UPDATE_SUCCESS: {
      const topic = action.payload;
      state = state.set("list", new TopicMap({[topic.id]: topic}).merge(state.list))
        .set("isUpdating", false)
        .set("updateError", null);
      if (state.selectedTopic && state.selectedTopic.id == topic.id) {
        state = state.set("selectedTopic", topic)
      }
      return state;
    }

    case Types.TOPICS_ADD_SUCCESS: {
      const topic = action.payload;
      state = state.set("list", new TopicMap({[topic.id]: topic}).merge(state.list))
        .set("isUpdating", false)
        .set("updateError", null)
      if (state.selectedTopic && state.selectedTopic.id == topic.id) {
        state = state.set("selectedTopic", topic)
      }
      return state;
    }

    case Types.TOPICS_REMOVE_SUCCESS: {
      const topicId = action.payload;
      state = state.set("list", state.list.delete(topicId))
        .set("isUpdating", false)
        .set("updateError", null)
      if (state.selectedTopic && state.selectedTopic.id == topicId) {
        state = state.set("selectedTopic", null)
      }
      return state;
    }

    case Types.TOPICS_UPDATE_FAILURE: {
      const {error} = action.payload;
      state = state.set("isUpdating", false)
        .set("updateError", error)
      return state;
    }

    case Types.TOPICS_SELECT_TOPIC: {
      const topic = action.payload;
      state = state.set("selectedTopic", topic);
      return state;
    }

    default:
      return state;
  }
}
