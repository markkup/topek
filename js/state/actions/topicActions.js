import * as Types from "../types"
import Validate from "../../lib/validate"
import MembersHelper from "../../lib/membersHelper"
import { Error } from "../../models"
import topicService from "../../services/topicService"

export function load(skipRequest = true) {
  return async (dispatch, getState) => {
    if (!skipRequest) 
      dispatch({type: Types.TOPICS_LOAD_REQUEST});

    try {
      const state = getState();
      if (!state.prefs.org)
        throw "No current org set"

      if (!state.profile.user)
        throw "No current user set"

      // get topic state first
      let states = await topicService.loadState(state.profile.user.id);
      dispatch({type: Types.TOPICS_STATE_LOAD_SUCCESS, payload: states});

      // now get topics
      let topics = await topicService.load(state.prefs.org.id, state.profile.user.id);
      dispatch({type: Types.TOPICS_LOAD_SUCCESS, payload: topics});
    }
    catch (e) {
      dispatch({type: Types.TOPICS_LOAD_FAILURE, payload: Error.fromException(e)});
    }
  }
}

export function add(title) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_UPDATE_REQUEST});
    
    try {
      Validate.isNotEmpty(title, "Title is required");

      const state = getState();
      if (!state.prefs.org)
        throw "No current org set"

      let results = await topicService.add(state.prefs.org.id, title);
      dispatch({type: Types.TOPICS_ADD_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function destroy(id) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_UPDATE_REQUEST});
    
    try {
      let results = await topicService.destroy(id);
      dispatch({type: Types.TOPICS_REMOVE_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function setSelected(topic) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_SELECT_TOPIC, payload: topic});
    dispatch(markSelectedTopicAsRead(true));
  }
}

export function addMembersToSelectedTopic(memberIds) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_UPDATE_REQUEST});
    
    try {

      const state = getState();
      if (!state.topics.selectedTopic)
        throw "No topic has been selected"

      let newMemberIds = MembersHelper.addMemberIds({
        currentIds: state.topics.selectedTopic.memberIds,
        addIds: memberIds,
        orgMembers: state.members.list,
        ownerId: state.topics.selectedTopic.owner.id
      })

      let results = await topicService.update(state.topics.selectedTopic.id, "memberIds", newMemberIds);
      dispatch({type: Types.TOPICS_UPDATE_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function removeMembersFromSelectedTopic(memberIds) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_UPDATE_REQUEST});
    
    try {

      const state = getState();
      if (!state.topics.selectedTopic)
        throw "No topic has been selected"

      let newMemberIds = MembersHelper.removeMemberIds({
        currentIds: state.topics.selectedTopic.memberIds,
        removeIds: memberIds,
        orgMembers: state.members.list
      })

      let results = await topicService.update(state.topics.selectedTopic.id, "memberIds", newMemberIds);
      dispatch({type: Types.TOPICS_UPDATE_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function markSelectedTopicAsRead(read) {
  return async (dispatch, getState) => {
    const state = getState();
    if (!state.topics.selectedTopic)
      throw "No topic has been selected"

    dispatch(updateTopicState(state.topics.selectedTopic.id, "read", read));
  }
}

export function dismissTopic(topicId, dismissed) {
  return async (dispatch, getState) => {
    dispatch(updateTopicState(topicId, "dismissed", dismissed));
  }
}

export function updateTopicState(topicId, prop, value) {
  return async (dispatch, getState) => {
    try {
      const state = getState();

      dispatch({type: Types.TOPICS_STATE_UPDATE_REQUEST, payload: {
        topicId: topicId,
        prop: prop,
        value: value
      }});

      let results = await topicService.updateState(state.profile.user.id, topicId, prop, value);
      dispatch({type: Types.TOPICS_STATE_UPDATE_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_STATE_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function startNewTopic() {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_NEW_TOPIC_START});
  }
}

export function cancelNewTopic() {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_NEW_TOPIC_RESET});
  }
}

export function saveNewTopic() {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_UPDATE_REQUEST});

    try {

      const state = getState();
      if (!state.topics.newTopic)
        throw "No new topic has been created"
      const newTopic = state.topics.newTopic;
      
      if (!state.prefs.org)
        throw "No current org set"

      let results = await topicService.add(state.prefs.org.id, newTopic);
      dispatch({type: Types.TOPICS_ADD_SUCCESS, payload: results});
      dispatch({type: Types.TOPICS_NEW_TOPIC_RESET});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function collectResults(topicId) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPIC_RESULTS_REQUEST});
    
    try {
      let results = await topicService.collectResults(topicId);
      dispatch({type: Types.TOPIC_RESULTS_SUCCESS, payload: results});
    }
    catch (e) {
      dispatch({type: Types.TOPIC_RESULTS_FAILURE, payload: Error.fromException(e)});
    }
  }
}

export function clearResults() {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPIC_RESULTS_RESET});
  }
}

export function updateNewTopic(prop, value) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_NEW_TOPIC_UPDATE, payload: {prop: prop, value: value}});
  }
}

let topicWatch = null;
let topicStateWatch = null;

export function setupWatchers() {
  return async (dispatch, getState) => {
    
    const state = getState();

    topicWatch = topicService.addTopicWatch(dispatch, {
      "create": Types.TOPICS_ADD_SUCCESS,
      "update": Types.TOPICS_UPDATE_SUCCESS,
      "delete": Types.TOPICS_REMOVE_SUCCESS
    })

    topicStateWatch = topicService.addTopicStateWatch(dispatch, {
      "create": Types.TOPICS_STATE_ADD_SUCCESS,
      "update": Types.TOPICS_STATE_UPDATE_SUCCESS
    }, state.profile.user.id)

  }
} 

export function closeWatchers() {
  return async (dispatch, getState) => {
    
    if (topicWatch != null) {
      topicWatch.close();
      topicWatch = null;
    }

    if (topicStateWatch != null) {
      topicStateWatch.close();
      topicStateWatch = null;
    }

  }
} 