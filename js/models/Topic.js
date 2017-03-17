import Immutable from "immutable"
import User from "./User"

const TopicRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  name: "",
  description: "",
  owner: new User(),
  details: new Immutable.List()
})

export default class Topic extends TopicRecord {
  static fromParse(topic) {
    let res = new Topic()
      .set("id", topic.id)
      .set("createdAt", topic.createdAt)
      .set("updatedAt", topic.updatedAt)
      .set("name", topic.get("name"))
      .set("description", topic.get("description"))
      .set("details", topic.get("details"))
    if (topic.get("owner")) {
      res = res.set("owner", User.fromParse(topic.get("owner")))
    }
    return res;
  }
}