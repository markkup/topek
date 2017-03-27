import Parse from "parse/react-native"
import { InteractionManager } from "react-native"
import { TopicMap, Topic, UserMap, Error } from "../models"
import * as Utils from "../lib/utils"

const ParseOrg = Parse.Object.extend("Org");
const ParseTopic = Parse.Object.extend("Topic");
const ParseUser = Parse.Object.extend("User");

class TopicService {

  async load(orgId) {

    await InteractionManager.runAfterInteractions();
    
    try {

      let org = new ParseOrg();
      org.id = orgId;

      let query = new Parse.Query("Topic")
        .include("owner")
        .include("members")
        .descending("createdAt")
        .equalTo("org", org);

      const data = await query.find();
      return TopicMap.fromParse(data);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  async loadMembers(topicId) {

    await InteractionManager.runAfterInteractions();
    
    try {

      // this query syntax was pulled together from the Parse SDK
      let query = new Parse.Query("User");
      query._addCondition("$relatedTo", "object", {
        __type: "Pointer",
        className: "Topic",
        objectId: topicId
      });
      query._addCondition("$relatedTo", "key", "members");

      const result = await query.find();
      return UserMap.fromParse(result);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  async add(orgId, topic, topicMembers) {

    await InteractionManager.runAfterInteractions();

    try {

      const me = Parse.User.current();

      let org = new ParseOrg();
      org.id = orgId;

      let image = null;
      if (topic.image.valid) {
        image = new Parse.File("topic-image.png", { base64: topic.image.url });
        await image.save();
      }

      let t = new ParseTopic();
      t.set("type", topic.type);
      t.set("name", topic.name);
      t.set("owner", me);
      t.set("org", org);
      t.set("description", topic.description);
      t.set("details", topic.details)
      t.set("image", image);
      var memberRelation = t.relation("members");
      topicMembers.map(m => {
        let u = new ParseUser();
        u.id = m.id;
        memberRelation.add(u);
      })

      const result = await t.save();
      return Topic.fromParse(result);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  async destroy(id) {

    await InteractionManager.runAfterInteractions();

    try {

      let topic = new ParseTopic();
      topic.set("id", id);

      const result = await topic.destroy();
      return id;
    }
    catch (e) {
      throw Error.fromException(e)
    }

  }

  async addMembers(topicId, membersMap) {

    await InteractionManager.runAfterInteractions();

    try {

      let topic = new ParseTopic();
      topic.set("id", topicId);

      let relation = topic.relation("members");
      membersMap.map(member => {
        let user = new ParseUser();
        user.id = member.id;
        relation.add(user);
      });
      
      const result = await topic.save();
      return this.loadMembers(topicId);
    }
    catch (e) {
      throw Error.fromException(e)
    }

  }

  async removeMember(topicId, member) {

    await InteractionManager.runAfterInteractions();

    try {

      let topic = new ParseTopic();
      topic.set("id", topicId);

      let relation = topic.relation("members");
      let user = new ParseUser();
      user.id = member.id;
      relation.remove(user);
      
      const result = await topic.save();
      return this.loadMembers(topicId);
    }
    catch (e) {
      throw Error.fromException(e)
    }

  }

}

export default new TopicService()
