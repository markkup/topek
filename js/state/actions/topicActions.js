import * as Types from "../types"
import Validate from "../../lib/validate"
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
      var states = await topicService.loadState(state.profile.user.id);
      dispatch({type: Types.TOPICS_STATE_LOAD_SUCCESS, payload: states});

      // now get topics
      var topics = await topicService.load(state.prefs.org.id);
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

      var results = await topicService.add(state.prefs.org.id, title);
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
      var results = await topicService.destroy(id);
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
    await dispatch({type: Types.TOPICS_SELECT_TOPIC, payload: topic});
    dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_REQUEST});
    dispatch(markSelectedTopicAsRead(true));

    try {
      var results = await topicService.loadMembers(topic.id);
      dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_LOAD_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function addMembersToSelectedTopic(members) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_REQUEST});
    
    try {

      const state = getState();
      if (!state.topics.selectedTopic)
        throw "No topic has been selected"

      var results = await topicService.addMembers(state.topics.selectedTopic.id, members);
      dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
    }
    return false;
  }
}

export function removeMembersfromSelectedTopic(member) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_REQUEST});
    
    try {

      const state = getState();
      if (!state.topics.selectedTopic)
        throw "No topic has been selected"

      var results = await topicService.removeMember(state.topics.selectedTopic.id, member);
      dispatch({type: Types.TOPICS_SELECT_TOPIC_MEMBERS_SUCCESS, payload: results});
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
    try {

      const state = getState();
      if (!state.topics.selectedTopic)
        throw "No topic has been selected"

      var results = await topicService.markRead(state.profile.user.id, state.topics.selectedTopic.id, read);
      dispatch({type: Types.TOPICS_STATE_UPDATE_SUCCESS, payload: results});
      return true;
    }
    catch (e) {
      dispatch({type: Types.TOPICS_UPDATE_FAILURE, payload: Error.fromException(e)});
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
      const newTopicMembers = state.topics.newTopicMembers;

      if (!state.prefs.org)
        throw "No current org set"

      var results = await topicService.add(state.prefs.org.id, newTopic, newTopicMembers);
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

export function updateNewTopic(prop, value) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_NEW_TOPIC_UPDATE, payload: {prop: prop, value: value}});
  }
}

export function updateMembersInNewTopic(members) {
  return async (dispatch, getState) => {
    dispatch({type: Types.TOPICS_NEW_TOPIC_UPDATE_MEMBERS, payload: members});
  }
}