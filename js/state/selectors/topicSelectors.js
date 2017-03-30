import { createSelector } from "reselect"
import Immutable from "immutable"

const getTopics = state => state.topics.list
const getTopicStates = state => state.topicStates.list

export const getTopicList = createSelector(
  [getTopics, getTopicStates],
  (topics, topicStates) => {
    let resMap = new Immutable.OrderedMap().withMutations(res => {
      topics.map(topic => {
        let read = false
        let state = topicStates.get(topic.id)
        if (state) {
          read = state.read
        }
        res.set(topic.id, {
          topic: topic,
          read: read
        })
      })
    })
    return resMap
  }
)