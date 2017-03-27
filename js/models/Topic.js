import Immutable from "immutable"
import User from "./User"
import Image from "./Image"

const TopicRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  type: "",
  name: "",
  description: "",
  owner: new User(),
  image: new Image(),
  memberCount: 0,
  details: new Immutable.List()
})

export default class Topic extends TopicRecord {
  static fromParse(topic) {
    let res = new Topic()
      .set("id", topic.id)
      .set("createdAt", topic.createdAt)
      .set("updatedAt", topic.updatedAt)
      .set("type", topic.get("type"))
      .set("name", topic.get("name"))
      .set("description", topic.get("description"))
      .set("memberCount", topic.get("memberCount"))
      .set("details", topic.get("details"))
      .set("image", Image.fromParse(topic.get("image")))
      .set("owner", User.fromParse(topic.get("owner")))
    return res;
  }
}