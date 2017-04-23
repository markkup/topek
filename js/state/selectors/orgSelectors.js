import { createSelector } from "reselect"
import Immutable from "immutable"

const getOrgMembers = state => state.members.list
const getOrgOwner = state => state.prefs.org.owner

export const getAllOrgMembers = createSelector(
  [getOrgMembers, getOrgOwner],
  (orgMembers, orgOwner) => {
    return orgMembers.set(orgOwner.id, orgOwner)
  }
)
