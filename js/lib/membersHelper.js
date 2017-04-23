
const ALL_ID = "*";

class MembersHelper {

  containsWildcardId(memberIds) {
    if (!Array.isArray(memberIds))
      throw "memberIds is not a valid array"

    return memberIds.includes(ALL_ID);
  }

  // this method takes the current topic ids and adds the
  // new ids (minus the owner)
  addMemberIds({ currentIds, addIds, orgMembers, ownerId }) {

    if (!Array.isArray(currentIds))
      throw "currentIds is not a valid array"

    if (!Array.isArray(addIds))
      throw "addIds is not a valid array"

    // forcing all members
    if (this.containsWildcardId(addIds)) {
      return [ALL_ID];
    }
    
    // add ids
    let finalMemberIds = [...currentIds];
    addIds.map(id => {
      if (!finalMemberIds.includes(id))
        finalMemberIds.push(id);
    })

    // remove owner if specified
    if (ownerId) {
      finalMemberIds = finalMemberIds.filter(id => id != ownerId);
    }

    return finalMemberIds;
  }

  removeMemberIds({ currentIds, removeIds, orgMembers }) {

    if (!Array.isArray(currentIds))
      throw "currentIds is not a valid array"

    if (!Array.isArray(removeIds))
      throw "removeIds is not a valid array"

    // if the current list of members is "all", convert it to 
    // the actual array of member ids
    if (this.containsWildcardId(currentIds)) {
      currentIds = orgMembers.map(m => m.id).toArray();
    }

    // now remove ids
    let finalMemberIds = currentIds.filter(id => {
      return !removeIds.includes(id);
    })

    return finalMemberIds;
  }

}

export default new MembersHelper();
