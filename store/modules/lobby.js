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
    personLeftLobby(state, data) {
        var playerIndex = state.lobby.players.findIndex(item => item.playerId === data.userId)
        state.lobby.players.splice(playerIndex, 1)

        var playerIndex2 = state.players.findIndex(item => item._id === data.userId)
        state.players.splice(playerIndex2, 1)
    },
    updateMyPing(state, data) {
        var playerIndex = state.lobby.players.findIndex(item => item.playerId === this.$auth.user._id)
        state.lobby.players[playerIndex].ping = data
    },
    updateUsersPing(state, data) {
        var playerIndex = state.lobby.players.findIndex(item => item.playerId === data.userId)
        state.lobby.players[playerIndex].ping = data.ping
    },
    addPlayerToLobby(state, data) {
        state.lobby.playerCount = data.playerCount;
        state.lobby.players.push(data.lobbyPlayersObj)
        state.players.push(data.userData);
    },
    updatePlayersReadyStatus(state, data) {
        var playerIndex = state.lobby.players.findIndex(item => item.playerId === data.userId)
        state.lobby.players[playerIndex].playerReady = data.readyStatus
    },
    setLobbyGame(state, data) {
        state.lobby.selectedGame = {
            game: true,
            image: data.gameInfo.image,
            max_players: data.gameInfo.max_players,
            min_players: data.gameInfo.min_players,
            title: data.gameInfo.title,
            slug: data.gameInfo.slug
        }
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
            this.$socketIo.emit('adminJoinedLobbyRoom', {
                lobbyRoom: response.data._id,
            });
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
                this.$socketIo.emit('adminDeletedLobby', {
                    lobbyRoom: state.lobby._id
                });
                commit('deleteLobby')
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    leaveLobby({ state, commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/leave', {
            lobbyId: state.lobby._id
        }, config)
        .then((response) => {  
            this.$socketIo.emit('personLeftLobby', {
                lobbyRoom: state.lobby._id,
                userId: this.$auth.user._id
            });
            commit('deleteLobby')
        })
        .catch((err) => {
            console.log(err)
        }) 
    },
    lobbyEnded({ state, commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/closed', {
            
        }, config)
        .then((response) => {
            this.$socketIo.emit('lobbyEnded', {
                lobbyRoom: state.lobby._id,
            });
            commit('deleteLobby')
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
            this.$socketIo.emit('sendUserPingToLobby', {
                lobbyRoom: state.lobby._id,
                userId: this.$auth.user._id,
                ping: ping
            });
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
                this.$socketIo.emit('newLobbyRequest', response.data.notification);
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    acceptLobbyRequest({ commit, dispatch }, data) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/invite/accept', {
            lobbyId: data.lobbyId
        }, config)
        .then((response) => {
            // If its not a duplicate notification send websocket data
            if(response.data.exists === true) {
                if(response.data.full === false) {
                    if(response.data.member != false) {
                        commit('createLobby', response.data.lobbyData)
                        dispatch('loadPlayers');
                        let userData = {
                            experience: this.$auth.user.experience,
                            accentColor: this.$auth.user.accentColor,
                            profileImage: this.$auth.user.profileImage,
                            _id: this.$auth.user._id,
                            username: this.$auth.user.username,
                            status: this.$auth.user.status,
                            gamerTag: this.$auth.user.gamerTag
                        }
                        let lobbyPlayersObj = {
                            playerId: this.$auth.user._id,
                            playerReady: false,
                            ping: 30
                        };
                        this.$socketIo.emit('personJoinedLobby', {
                            lobbyRoom: response.data.lobbyData._id,
                            userData: userData,
                            playerCount: response.data.lobbyData.playerCount,
                            lobbyPlayersObj: lobbyPlayersObj
                        });
                    }
                }
            } 
            dispatch('deleteNotification', data.notificationId)
        })
        .catch((err) => {
            console.log(err)
        })
        
        
    },
    readyToggle({ commit, state }, data) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.post(process.env.API_URL + '/lobby/ready-toggle', {
            lobbyId: state.lobby._id,
            readyStatus: data
        }, config)
        .then((response) => {
            if(response.data) {
                this.$socketIo.emit('playerReadyToggle', {
                    lobbyId: state.lobby._id,
                    userId: this.$auth.user._id,
                    readyStatus: data
                });
                // Update current users ready up status
                commit("updatePlayersReadyStatus", {
                    userId: this.$auth.user._id,
                    readyStatus: data
                })
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    selectLobbyGame({ commit, state }, data) {
        if(this.$auth.user._id === state.lobby.adminId) {
            let config = {
                headers: {
                    Authorization: this.$auth.getToken('local')
                }
            }
            axios.post(process.env.API_URL + '/lobby/game/select', {
                lobbyId: state.lobby._id,
                gameInfo: data
            }, config)
            .then((response) => {
                if(response.data) {
                    this.$socketIo.emit('setLobbyGame', {
                        lobbyId: state.lobby._id,
                        gameInfo: data
                    });
                    // Update current users ready up status
                    commit("setLobbyGame", {gameInfo: data})
                }
            })
            .catch((err) => {
                console.log(err)
            })
        }
    }
}

export default {
    state, 
    mutations,
    actions
}