import Immutable from "immutable"

const TopicStateRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  topicId: "",
  userId: "",
  read: false,
  dismissed: false,
  results: []
})

export default class TopicState extends TopicStateRecord {
  static fromParse(topicState) {
    let res = new TopicState()
      .set("id", topicState.id)
      .set("createdAt", topicState.createdAt)
      .set("updatedAt", topicState.updatedAt)
      .set("topicId", topicState.get("topicId"))
      .set("userId", topicState.get("userId"))
      .set("read", topicState.has("read") && topicState.get("read"))
      .set("dismissed", topicState.has("dismissed") && topicState.get("dismissed"))
      .set("results", topicState.has("results") ? topicState.get("results") : [])
    return res;
  }
}