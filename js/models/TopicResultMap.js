import Immutable from "immutable"
import TopicState from "./TopicState"

export default class TopicResultMap extends Immutable.OrderedMap {
  static fromParse(topicStates) {
    return Immutable.OrderedMap(topicStates.map(t => t.has("results") ? [t.get("userId"), TopicState.fromParse(t)] : null));
  }
}