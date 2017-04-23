import * as Types from "../types"
import State from ".." 
import { OrgActions, PrefsActions, TopicActions } from "."
import { Error } from "../../models"

export function initialize() {
  return async (dispatch, getState) => {

    const state = getState();
    if (!state.auth.isAuthenticated) {
      return false;
    }

    // initialize orgs
    await dispatch(initializeOrgs());

    // setup our watchers
    await dispatch(TopicActions.setupWatchers());

    return true;
  }
}

export function uninitialize() {
  return async (dispatch, getState) => {

    // close our watchers
    await dispatch(TopicActions.closeWatchers());

    // purge our data
    State.purgePersistedState();

  }
}

function initializeOrgs() {
  return async (dispatch, getState) => {

    await dispatch(OrgActions.load());

    const state = getState();
    let org = state.prefs.org;
    if ((!org || !org.id) && (state.orgs.list && state.orgs.list.size > 0)) {
      org = state.orgs.list.first()
    }
    await dispatch(PrefsActions.setOrg(org));
  }
}