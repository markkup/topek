import { TopicStateMap } from "../../models"
import Immutable from "immutable"
import { REHYDRATE } from "redux-persist/constants"
import * as Types from "../types"

const isPersistable = true;
const TopicStateState = Immutable.Record({
    list: new TopicStateMap()
})

var initialState = new TopicStateState();

export default function(state = initialState, action = {}) {

  switch (action.type) {

    case REHYDRATE: {
      if (action.payload["topicStates"]) {
        if (isPersistable) {
          state = new TopicStateState().set("list", new TopicStateMap(action.payload["topicStates"].list))
        }
        else state = new TopicStateState();
      }
      return state;  
    }

    case Types.TOPICS_STATE_LOAD_SUCCESS: {
      const states = action.payload;
      state = state.set("list", states)
      return state;
    }

    case Types.TOPICS_STATE_DISMISS: {
      const { topicId, prop, value } = action.payload;
      let topicState = state.list.get(topicId)
      if (topicState) {
        state = state.set("list", state.list.set(topicState.topicId, topicState.set(prop, value)))
      }
      return state;
    }

    case Types.TOPICS_STATE_UPDATE_SUCCESS: {
      const topicState = action.payload;
      state = state.set("list", state.list.set(topicState.topicId, topicState))
      return state;
    }

    case Types.TOPICS_STATE_ADD_SUCCESS: {
      const topicState = action.payload;
      state = state.set("list", state.list.set(topicState.topicId, topicState))
      return state;
    }

    default:
      return state;
  }
}
