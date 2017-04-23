function errWithMsg(msg) {
  if (msg !== undefined)
    throw msg;
  return false;
}

export default {

  isEmpty: (value, msg) => {
    if (!value || value.trim() == "")
      return true;
    return errWithMsg(msg);
  },

  isNotEmpty: (value, msg) => {
    if (!value || value.trim() == "")
      return errWithMsg(msg);
    return true;
  },

  isEmail: (value, msg) => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(value))
      return errWithMsg(msg);
    return true;
  }

}