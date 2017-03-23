import Immutable from "immutable"
import Image from "./Image"

const UserRecord = Immutable.Record({
  id: null,
  createdAt: null,
  updatedAt: null,
  email: "",
  username: "",
  name: "",
  alias: "",
  avatar: new Image()
})

export default class User extends UserRecord {
  static fromParse(user) {
    if (!user)
      return null;
    let res = new User()
      .set("id", user.id)
      .set("createdAt", user.createdAt)
      .set("updatedAt", user.updatedAt)
      .set("email", user.get("email"))
      .set("username", user.get("username"))
      .set("name", user.get("name"))
      .set("alias", user.get("alias"))
      .set("avatar", Image.fromParse(user.get("avatar")))
    return res;
  }
}