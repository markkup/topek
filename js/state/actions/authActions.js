import * as Types from "../types"
import Validate from "../../lib/validate"
import authService from "../../services/authService"
import pushService from "../../services/pushService"
import { AppActions } from "."
import { Error } from "../../models"

export function login(username, password) {
  return async dispatch => {

    // temporarily here until we implement signup screen
    // await authService.signup("joe@here.com", "joe@here.com", "123456", "Joe W", "joe");

    dispatch({type: Types.LOGIN_REQUEST});
    
    try {
      Validate.isNotEmpty(username, "Email is required");
      Validate.isEmail(username, "Email is not valid");
      Validate.isNotEmpty(password, "Password is required");

      var results = await authService.login(username, password);
      dispatch({type: Types.LOGIN_SUCCESS, payload: results});

      // let's init the app
      dispatch(AppActions.initialize());
    }
    catch (e) {
      dispatch({type: Types.LOGIN_FAILURE, payload: Error.fromException(e)});
    }
  }
}

export function logout() {
  return {type: Types.LOGOUT_SUCCESS}
}

export function requestPushPermissions() {
  return async dispatch => {
    pushService.requestPermissions();
    dispatch({type: Types.PUSH_SUCCESS});
  }
}

export function registerDevice(token, channels) {
  return async dispatch => {

    dispatch({type: Types.REGISTER_REQUEST});
    
    try {
      Validate.isNotEmpty(token, "Device token is required");

      var results = await authService.registerDevice(token, channels);
      dispatch({type: Types.REGISTER_SUCCESS, payload: results});
    }
    catch (e) {
      dispatch({type: Types.REGISTER_FAILURE, payload: Error.fromException(e)});
    }
  }
}