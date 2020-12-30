const state = () => ({
    lobbyStatus: true,

})
  
const mutations = {
    toggleLobby(state) {
        state.lobbyStatus = !state.lobbyStatus;
    },


}

export default {
    state, 
    mutations
}