import Immutable from "immutable"

const TopicStateRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  topicId: "",
  userId: "",
  read: false
})

export default class TopicState extends TopicStateRecord {
  static fromParse(topicState) {
    let res = new TopicState()
      .set("id", topicState.id)
      .set("createdAt", topicState.createdAt)
      .set("updatedAt", topicState.updatedAt)
      .set("topicId", topicState.get("topicId"))
      .set("userId", topicState.get("userId"))
      .set("read", topicState.get("read"))
    return res;
  }
}