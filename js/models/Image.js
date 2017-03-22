import Immutable from "immutable"

const ImageRecord = Immutable.Record({
    name: "",
    url: "",
    type: "", // uri|base64|path
    valid: false
})

export default class Image extends ImageRecord {
  static fromParse(image) {
    let res = new Image()
      .set("name", image && image.name())
      .set("url", image && image.url())
      .set("valid", (image !== undefined && image != null))
      .set("type", "uri")
    return res;
  }
  static fromBase64(data) {
    let res = new Image()
      .set("name", "")
      .set("url", data)
      .set("valid", true)
      .set("type", "base64")
    return res;
  }
  static fromPath(path) {
    let res = new Image()
      .set("name", "")
      .set("url", path)
      .set("valid", true)
      .set("type", "path")
    return res;
  }
}
