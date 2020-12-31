const state = () => ({
    friendsList: []

})
  
const mutations = {
    setFriendsList(state, data) {
        state.friendsList = data
    },


}

export default {
    state, 
    mutations
}