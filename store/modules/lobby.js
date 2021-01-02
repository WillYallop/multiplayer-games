import axios from 'axios'

const state = () => ({
    lobby: {},
    players: []
    
})
  
const mutations = {
    createLobby(state, data) {
        state.lobby = data
    }
}

const actions = {
    createLobby({ commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby', {}, config)
        .then((response) => {
            commit('createLobby', response.data)
        })
        .catch((err) => {
            console.log(err)
        })
    },

}

export default {
    state, 
    mutations,
    actions
}