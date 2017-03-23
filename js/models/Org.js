import Immutable from "immutable"
import User from "./User"
import UserMap from "./UserMap"
import Image from "./Image"

const OrgRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  name: "",
  owner: new User(),
  membersRef: null,
  image: new Image(),
  icon: new Image()
})

export default class Org extends OrgRecord {
  static fromParse(org) {
    let res = new Org()
      .set("id", org.id)
      .set("createdAt", org.createdAt)
      .set("updatedAt", org.updatedAt)
      .set("name", org.get("name"))
      .set("image", Image.fromParse(org.get("image")))
      .set("icon", Image.fromParse(org.get("icon")))
      .set("owner", User.fromParse(org.get("owner")))
    if (org.get("members")) {
      res = res.set("membersRef", org.get("members"))
    }
    return res;
  }
}