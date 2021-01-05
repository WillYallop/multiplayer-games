<template>
    <div class="modalInnerCon"> 
        
        <div class="buttonCon">
            <button class="pageBtn" v-on:click="activePage = 1" :class="{ 'activeBtn' : activePage === 1 }">Add Friend</button>
            <button class="pageBtn" v-on:click="activePage = 2" :class="{ 'activeBtn' : activePage === 2 }">Friend Requests <div class="friendRequestCount" v-if="friendRequestsResults.length > 0"><p>{{friendRequestsResults.length}}</p></div></button>
        </div>

        <!-- Send Friend Requests -->
        <div class="actionCon" v-if="activePage === 1"> 
            <div class="inputWrapper">
                <input type="text" class="inputStyle" v-on:keyup.enter="searchUser" placeholder="Gamer Tag / Username" v-model="searchUserModel">
                <button class="searchTagBtn" v-on:click="searchUser"><fa class="fas" :icon="['fa', 'search']"/></button>
            </div>
            <p class="errorP" v-if="searchUserError">{{searchUserError}}</p>
            <Simplebar class="actionConBody" data-simplebar-auto-hide="true" >
                <div class="userResults" :key="user._id" v-for="user in searchUserResults">
                    <img :src="user.profileImage" class="userProfilePic" :style="{ 'border' : `2px solid ${user.accentColor}`, 'background-color' : user.accentColor }">
                    <div class="userTextarea">
                        <p class="usernameP">{{user.username}} <span>({{user.gamerTag}})</span></p>
                        <p class="experienceP">{{user.experience}}</p>
                        <button class="sendRequestBtn" :key="key" :disabled="user.requestSent || user.friendsAlready" v-on:click="sendFriendRequest(user)"><span v-if="user.requestSent">Request Sent!</span><span v-if="user.friendsAlready">Already Friends!</span><span v-if="!user.requestSent && !user.friendsAlready">Send Request</span></button>
                    </div>
                </div>
            </Simplebar>
        </div>

        <!-- Friend Requests -->
        <div class="actionCon" v-if="activePage === 2">
            <button class="refreshFriendRequestsBtn" v-on:click="findRequests">Refresh</button>
            <Simplebar class="actionConBody" data-simplebar-auto-hide="true">
                <div class="userResults" :key="user._id" v-for="user in friendRequestsResults">
                    <img :src="user.usersProfileImage" class="userProfilePic" :style="{ 'border' : `2px solid ${user.usersAccentColor}`, 'background-color' : user.accentColor }">
                    <div class="userTextarea">
                        <p class="usernameP">{{user.usersUsername}} <span>({{user.usersGamerTag}})</span></p>
                        <p class="experienceP">{{user.usersExperience}}</p>
                        <button class="sendRequestBtn" v-on:click="respondToRequest('accept', user._id, user.senderUserId)">Accept</button><button class="sendRequestBtn declineBtn" v-on:click="respondToRequest('decline', user._id, user.senderUserId)">Decline</button>
                    </div>
                </div>
            </Simplebar>
        </div>
        
    </div>
</template>

<script>
// Components
import Simplebar from 'simplebar-vue'

// Libs
import axios from 'axios'

export default {
    data() {
        return {
            activePage: 1,
            searchUserModel: '',
            searchUserError: '',
            searchUserResults: [],
            key: 0,

            friendRequestsResults: [],
           
        }
    },
    components: {
        Simplebar
    },
    mounted() {
        this.findRequests()
    },
    methods: {
        // For viewing request
        findRequests() {
            this.friendRequestsResults = []
            let config = {
                headers: {
                    Authorization: this.$auth.getToken('local')
                }
            }
            axios.get(process.env.API_URL + '/friend-actions/request' ,config)
            .then((res) => {
                this.friendRequestsResults = res.data
            })
            .catch((err) => {
                console.log(err)
            })
        },
        respondToRequest(action, requestId, senderUserId) {
            let config = {
                headers: {
                    Authorization: this.$auth.getToken('local')
                }
            }
            if(action === 'accept') {
                axios.post(process.env.API_URL + '/friend-actions/request/accept', {
                    requestId: requestId,
                    senderUserId: senderUserId

                } ,config)
                .then((res) => {
                    let requestIndex = this.friendRequestsResults.findIndex(x => x._id === requestId)
                    this.friendRequestsResults.splice(requestIndex, 1)

                    this.$store.dispatch('loadFriendListData')
                    this.$store.commit('decrementFriendRequestTotal')
                    this.$socketIo.emit('newFriend', {
                        senderUserId: senderUserId,
                        userId: this.$auth.user._id
                    });
                })
                .catch((err) => {
                    console.log(err)
                })
            } 
            if(action === 'decline') {
                axios.post(process.env.API_URL + '/friend-actions/request/decline', {
                    requestId: requestId
                } ,config)
                .then((res) => {
                    let requestIndex = this.friendRequestsResults.findIndex(x => x._id === requestId)
                    this.friendRequestsResults.splice(requestIndex, 1)
                })
                .catch((err) => {
                    console.log(err)
                })
            }
        },

        // For sending request
        verifyUsername() {
            if(this.searchUserModel.length > 1 && this.searchUserModel.length < 16) {
                var regex = /^[a-zA-Z0-9 ?!$-_]+(?:-[a-zA-Z0-9 ?!$-_]+)*$/
                if(regex.test(this.searchUserModel)) {
                    return true
                } else {
                    return false
                }
            } else {
                return false
            }
        },
        searchUser() {
            this.searchUserError = false
            this.searchUserResults = []
            if(this.verifyUsername()) {
                let config = {
                    headers: {
                        Authorization: this.$auth.getToken('local')
                    }
                }
                axios.get(process.env.API_URL + '/friend-actions/lookup/'+encodeURI(this.searchUserModel), config)
                .then((res) => {
                    this.searchUserResults = res.data
                })
                .catch((err) => {
                    if(err.response.status === 404) {
                        this.searchUserError = 'No user found!'
                    } 
                    if(err.response.status === 500) {
                        this.searchUserError = 'There was an unknown error!'
                    } 
                })
            } else {
                this.searchUserError = 'Make sure to enter a valid username or tag!'
            }
        },
        sendFriendRequest(user) {
            let config = {
                headers: {
                    Authorization: this.$auth.getToken('local')
                }
            }
            axios.post(process.env.API_URL + '/friend-actions/request', {
                addUser: user._id,
                usersUsername: this.$auth.user.username,
                usersGamerTag: this.$auth.user.gamerTag,  
                usersAccentColor: this.$auth.user.accentColor, 
                usersProfileImage: this.$auth.user.profileImage,  
                usersExperience: this.$auth.user.experience
            },config)
            .then((res) => {
                let userIndex = this.searchUserResults.findIndex(x => x._id === user._id)
                this.searchUserResults[userIndex].requestSent = true
                this.key++
                this.$socketIo.emit('friendRequestPing', {
                    addUser: user._id
                });
            })
            .catch((err) => {
                if(err.response.status === 409) {
                    if(err.response.data === 'friends') {
                        let userIndex = this.searchUserResults.findIndex(x => x._id === user._id)
                        this.searchUserResults[userIndex].friendsAlready = true
                    }
                    if(err.response.data === 'duplicate') {
                        let userIndex = this.searchUserResults.findIndex(x => x._id === user._id)
                        this.searchUserResults[userIndex].requestSent = true
                    }
                    this.key++
                } 
            })
        }
    }
}
</script>

<style scoped>
.modalInnerCon {
    width: 100%;
    height: 299px;
    border-radius: 10px;
    background-color: var(--background-1);
    padding: 10px;
}
/* Page Btn Section */
.buttonCon {
    width: 100%;
    display: flex;
    justify-content: space-between;
} 
.pageBtn {
    width: calc(50% - 5px);
    background-color: var(--background-2);
    border: none;
    height: 40px;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    color: var(--text-1);
    cursor: pointer;
    position: relative;
} 
.pageBtn.activeBtn {
    background-color: var(--accent-1);
}
.friendRequestCount {
    position: absolute;
    top: -3px;
    right: -3px;
    background-color: var(--accent-1);
    color: #FFF;
    font-size: 12px;
    font-weight: bold;
    height: 15px;
    width: 15px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.pageBtn.activeBtn .friendRequestCount {
    background-color: #FFF;
    color: var(--background-1);
}

/* Action Pages */
.actionCon {
    padding-top: 10px;
}
.actionConBody {
    height: 181px;
}
.errorP {
    color: var(--accent-1);
}
/* PAge 1 */
.inputWrapper {
    display: flex;
} 
.inputWrapper .inputStyle {
    width: calc(100% - 50px);
    margin-right: 10px;
}
.searchTagBtn {
    width: 40px;
    height: 40px;
    background-color: var(--accent-2);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;
}
.searchTagBtn:hover {
    background-color: var(--accent-2-hover);
}
/* User */
.userResults {
    background-color: var(--background-2);
    padding: 10px;
    border-radius: 5px;
    display: flex;
    margin-bottom: 5px;
} 
.userResults:last-child {
    margin-bottom: 0;
}
.userProfilePic {
    height: 30px;
    width: 30px;
    min-width: 30px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #FFEC01;
} 
.userTextarea {
    padding-left: 10px;
} 
.usernameP {
    color: var(--text-1);
    font-size: 14px;
    font-weight: bold;
} 
.usernameP span {
    color: var(--text-2);
    font-weight: normal;
}
.experienceP {
    color: var(--text-2);
    font-size: 14px;
    margin-top: 2px;
} 
.sendRequestBtn {
    padding: 4px 20px;
    background-color: var(--accent-2);
    cursor: pointer;
    transition: 0.2s;
    border: none;
    border-radius: 5px;
    font-weight: bold;
    margin-top: 10px;
    margin-right: 5px;
}
.sendRequestBtn:hover {
    background-color: var(--accent-2-hover);
}
.declineBtn {
    background-color: var(--accent-1);
    color: #FFF;
}
.declineBtn:hover {
    background-color: var(--accent-1-hover);
}

/* page 2 */
.refreshFriendRequestsBtn {
    height: 40px;
    margin-bottom: 10px;
    width: 100%;
    background-color: var(--accent-2);
    transition: 0.2s;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    font-weight: bold;
}
.refreshFriendRequestsBtn:hover {
    background-color: var(--accent-2-hover);
}
</style>

<style>
.actionConBody .simplebar-content {
    height: 100%;
}
</style>