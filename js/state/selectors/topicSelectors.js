import { createSelector } from "reselect"
import Immutable from "immutable"

const getTopics = state => state.topics.list
const getTopicStates = state => state.topicStates.list
const getOrgMembers = state => state.members.list
const getSelectedTopic = state => state.topics.selectedTopic
const getTopicStateIsUpdatingTopicId = state => state.topicStates.isUpdatingTopicId
const getTopicStateUpdateErrorTopicId = state => state.topicStates.updateErrorTopicId
const getTopicStateUpdateError = state => state.topicStates.updateError

function collectTopicMembers(ids, memberList) {
  if (ids == "*") {
    return memberList.toArray();
  }
  return ids.map(id => memberList.get(id))
}

function setTopicMembers(topic, memberList) {
  if (!topic || !topic.memberIds || !Array.isArray(topic.memberIds)) return;
  for (var i=0; i<topic.memberIds.length; i++) {
    if (topic.memberIds[i] == "*") {
      topic.memberCount = memberList.size;
      topic.members = collectTopicMembers("*", memberList);
      return;
    }
  }
  topic.memberCount = topic.memberIds.length;
  topic.members = collectTopicMembers(topic.memberIds, memberList);
}

export const getTopicList = createSelector(
  [getTopics, getTopicStates, getOrgMembers],
  (topics, topicStates, orgMembers) => {
    let resMap = new Immutable.OrderedMap().withMutations(res => {
      topics.map(topic => {
        let read = false
        let dismissed = false
        let state = topicStates.get(topic.id)
        if (state) {
          read = state.read
          dismissed = state.dismissed
        }
        setTopicMembers(topic, orgMembers);
        if (!dismissed) {
          res.set(topic.id, {
            topic: topic,
            read: read
          })
        }
      })
    })
    return resMap
  }
)

export const getCurrentTopic = createSelector(
  [getSelectedTopic, getOrgMembers],
  (topic, orgMembers) => {
    setTopicMembers(topic, orgMembers);
    return topic;
  }
)

export const getCurrentTopicState = createSelector(
  [getSelectedTopic, getTopicStates],
  (topic, topicStates) => {
    if (topic == null) {
      return {};
    }
    return topicStates.get(topic.id);
  }
)

export const getCurrentTopicIsUpdating = createSelector(
  [getSelectedTopic, getTopicStateIsUpdatingTopicId],
  (topic, topicStateIsUpdatingTopicId) => {
    if (topic == null) {
      return true;
    }
    return topic.id == topicStateIsUpdatingTopicId;
  }
)

export const getCurrentTopicUpdatingError = createSelector(
  [getSelectedTopic, getTopicStateUpdateErrorTopicId, getTopicStateUpdateError],
  (topic, topicStateUpdateErrorTopicId, topicStateUpdateError) => {
    if (topic == null) {
      return "";
    }
    if (topic.id == topicStateUpdateErrorTopicId)
      return topicStateUpdateError;
    return "";
  }
)
