import axios from 'axios'

const state = () => ({
    friendsList: []
    
})
  
const mutations = {
    updateFriendsList(state, data) {
        state.friendsList = data
    }

}

const actions = {
    loadFriendListData ({ commit }) {
        let config = {
            headers: {
                Authorization: this.$auth.getToken('local')
            }
        }
        axios.get(process.env.API_URL + '/user/friends', config)
        .then((response) => {
            commit('updateFriendsList',response.data )
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