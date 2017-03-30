import Parse from "parse/react-native"

export default class LiveQueryWatcher {

  constructor(dispatch, className, actionMap, options) {
    this.dispatch = dispatch;
    this.className = className;
    this.actionMap = actionMap;
    this.options = options;
    this.subscription = null;
    this._mapActions();
  }

  _mapActions() {

    let query = this.getQuery(this.className);
    let subscription = query.subscribe();

    for (var key in this.actionMap) {
      let type = key;
      let action = this.actionMap[type];
      subscription.on(type, (obj) => {
        console.log("LiveQuery(" + this.className + ")." + type + ": dispatch " + action, obj);
        this.dispatch({type: action, payload: this.getPayload(type, obj)});
      });
    }

    this.subscription = subscription;
  }

  close() {
    this.subscription.unsubscribe();
  }

  getQuery(className) {
    return new Parse.Query(className)
  }

  getPayload(type, obj) {
    return obj;
  }
}