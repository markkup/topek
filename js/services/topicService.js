import Parse from "parse/react-native"
import { InteractionManager } from "react-native"
import { TopicMap, Topic, TopicStateMap, TopicState, UserMap, Error } from "../models"
import * as Utils from "../lib/utils"
import LiveQueryWatcher from "../lib/LiveQueryWatcher"

const ParseOrg = Parse.Object.extend("Org");
const ParseTopic = Parse.Object.extend("Topic");
const ParseTopicState = Parse.Object.extend("TopicState");
const ParseUser = Parse.Object.extend("User");

class LiveTopicWatcher extends LiveQueryWatcher {
  getQuery(className) {
    return new Parse.Query(className).include("owner").include("members");
  }
  getPayload(type, obj) {
    return Topic.fromParse(obj);
  }
}

class LiveTopicStateWatcher extends LiveQueryWatcher {
  getQuery(className) {
    return new Parse.Query(className).equalTo("userId", this.options.userId);
  }
  getPayload(type, obj) {
    return TopicState.fromParse(obj);
  }
}

class TopicService {

  async loadState(userId) {

    await InteractionManager.runAfterInteractions();
    
    try {

      let query = new Parse.Query("TopicState")
        .equalTo("userId", userId);

      const data = await query.find();
      return TopicStateMap.fromParse(data);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

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

  async getTopicState(userId, topicId) {

    await InteractionManager.runAfterInteractions();

    try {

      let query = new Parse.Query("TopicState")
        .equalTo("userId", userId)
        .equalTo("topicId", topicId);

      let topicStates = await query.find();
      if (topicStates && topicStates.length > 0) {
        return topicStates[0];
      }
      return null;
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  async markRead(userId, topicId, read) {

    await InteractionManager.runAfterInteractions();

    try {

      let topicState = await this.getTopicState(userId, topicId);
      if (!topicState) {
        topicState = new ParseTopicState();
        topicState.set("userId", userId);
        topicState.set("topicId", topicId);
      }
      topicState.set("read", read);

      const result = await topicState.save();
      return TopicState.fromParse(result);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  async markDismissed(userId, topicId, dismissed) {

    await InteractionManager.runAfterInteractions();

    try {

      let topicState = await this.getTopicState(userId, topicId);
      if (!topicState) {
        topicState = new ParseTopicState();
        topicState.set("userId", userId);
        topicState.set("topicId", topicId);
      }
      topicState.set("dismissed", dismissed);

      const result = await topicState.save();
      return TopicState.fromParse(result);
    }
    catch (e) {
      throw Error.fromException(e)
    }
  }

  addTopicWatch(dispatch, actionMap) {
    return new LiveTopicWatcher(dispatch, "Topic", actionMap);
  }

  addTopicStateWatch(dispatch, actionMap, userId) {
    return new LiveTopicStateWatcher(dispatch, "TopicState", actionMap, {
      userId: userId
    });
  }

}

export default new TopicService()
