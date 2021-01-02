import axios from 'axios'

const state = () => ({
    friendsList: [],
    friendRequestTotal: 0,
    
})
  
const mutations = {
    // Set friend list data
    updateFriendsList(state, data) {
        state.friendsList = data
    },
    addNewFriend(state, data) {
        state.friendsList.push(data)
    },
    // Increment friend request count - used for web socket
    incrementFriendRequestTotal(state) {
        state.friendRequestTotal++
    },
    decrementFriendRequestTotal(state) {
        state.friendRequestTotal--
    },
    // Set freind request total
    setFriendRequestTotal(state, data) {
        state.friendRequestTotal = data
    }

}

const actions = {
    loadFriendListData({ commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.get(process.env.API_URL + '/user/friends', config)
        .then((response) => {
            commit('updateFriendsList', response.data)
        })
        .catch((err) => {
            console.log(err)
        })
    },
    loadFriendRequestData({ commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.get(process.env.API_URL + '/friend-actions/request' ,config)
        .then((response) => {
            commit('setFriendRequestTotal', response.data.length)
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