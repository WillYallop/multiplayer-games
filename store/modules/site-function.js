import axios from 'axios'

const state = () => ({
    lobbyStatus: true,
    modalInfo: {
        status: false,
        component: ''
    },
    notifications: []
    

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
    },
    // Notifications
    setNotifications(state, data) {
        state.notifications = data
    },
    pushNewNotificationObject(state, data) {
        state.notifications.unshift(data)
    },
    deleteNotification(state, id) {
        var notificationIndex = state.notifications.findIndex(item => item._id === id)
        state.notifications.splice(notificationIndex, 1)
    }

}

const actions = {
    loadNotificationData({ commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.get(process.env.API_URL + '/user/notifications', config)
        .then((response) => {
            commit('setNotifications', response.data)
        })
        .catch((err) => {
            console.log(err)
        })
    },
    deleteNotification({ commit }, id) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.delete(process.env.API_URL + '/user/notification/'+id, config)
        .then((response) => {
            commit('deleteNotification', id)
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