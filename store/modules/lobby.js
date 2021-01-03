import axios from 'axios'

const state = () => ({
    lobby: false,
    players: []
    
})
  
const mutations = {
    createLobby(state, data) {
        state.lobby = data
    },
    setPlayers(state, data) {
        state.players = data
    },
    clearPlayerData(state) {
        state.players = [];
    },
    deleteLobby(state) {
        state.players = [];
        state.lobby = false;
    },
    updateMyPing(state, data) {
        var playerIndex = state.lobby.players.findIndex(item => item.playerId === this.$auth.user._id)
        state.lobby.players[playerIndex].ping = data
    }
}

const actions = {
    createLobby({ commit, dispatch }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby', {}, config)
        .then((response) => {
            commit('createLobby', response.data)
            dispatch('loadPlayers')
            return new Promise((resolve) => {
                resolve()
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },
    loadLobby({ commit, dispatch }) {
        if(this.$auth.user.currentLobby) {
            let config = {
                headers: {
                    Authorization: this.$auth.getToken('local')
                }
            }
            axios.get(process.env.API_URL + '/lobby/'+this.$auth.user.currentLobby, config)
            .then((response) => {
                if(response.data === false) {
                    commit('clearPlayerData')
                } else {
                    commit('createLobby', response.data);
                    dispatch('loadPlayers');
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            return new Promise((resolve) => {
                resolve()
            })
        }
    },
    loadPlayers({ state, commit }) {
        let playersIdArray = []
        for(var i = 0; i < state.lobby.players.length; i++) {
            playersIdArray.push(state.lobby.players[i].playerId)
        }
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/players', {
            players: playersIdArray
        }, config)
        .then((response) => {
            commit('setPlayers', response.data)
        })
        .catch((err) => {
            console.log(err)
        })
    },
    deleteLobby({ state, commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/delete', {
            lobbyId: state.lobby._id
        }, config)
        .then((response) => {
            if(response.data) {
                commit('deleteLobby')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    checkPing({ state, commit }) {
        var sendDate = new Date().getTime()
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.get(process.env.API_URL + '/user/ping', config)
        .then((response) => {
            var receiveDate = (new Date()).getTime();
            var ping = receiveDate - sendDate
            commit('updateMyPing', ping)
        })
        .catch((err) => {
            console.log(err)
        })
    },
    sendJoinLobbyRequest({ commit }, data) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/invite', {
            toUser: data.toUser,
            lobbyId: data.lobbyId,
            fromUsername: data.fromUsername
        }, config)
        .then((response) => {
            // If its not a duplicate notification send websocket data
            if(!response.data.alreadyExists) {
                this.$socketTest.emit('newLobbyRequest', response.data.notification);
            }
        })
        .catch((err) => {
            console.log(err)
        })
    }

}

export default {
    state, 
    mutations,
    actions
}