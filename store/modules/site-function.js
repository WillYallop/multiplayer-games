const state = () => ({
    lobbyStatus: true,
    modalInfo: {
        status: false,
        component: ''
    }
    

})
  
const mutations = {
    // Lobby 
    toggleLobby(state) {
        state.lobbyStatus = !state.lobbyStatus;
    },
    // Modal Mutations
    toggleModal(state) {
        state.modalInfo.status = !state.modalInfo.status
    },
    setModalComponent(state, comp) {
        state.modalInfo.status = true
        state.modalInfo.component = comp
    }


}

export default {
    state, 
    mutations
}