import Immutable from "immutable"
import TopicState from "./TopicState"

export default class TopicStateMap extends Immutable.OrderedMap {
  static fromParse(topicStates) {
    return Immutable.OrderedMap(topicStates.map(t => [t.get("topicId"), TopicState.fromParse(t)]));
  }
}