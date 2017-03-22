import * as Types from "../types"
import * as orgActions from "./orgActions"
import * as prefsActions from "./prefsActions"
import { Error } from "../../models"

export function initialize() {
  return async (dispatch, getState) => {

    await dispatch(orgActions.load());

    const state = getState();
    let org = state.prefs.org;
    if ((!org || !org.id) && (state.orgs.list && state.orgs.list.size > 0)) {
      org = state.orgs.list.first()
    }
    await dispatch(prefsActions.setOrg(org));
  }
}