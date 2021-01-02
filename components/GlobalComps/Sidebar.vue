<template>
    <div>
        <!-- Users List -->
        <div class="lobbyCon" :class="{ 'active' : lobbyStatus }">
            <Lobby/>
        </div>
        <!-- Users List -->
        <div class="userListCon">
            <!-- Toggle Lobby Btn -->
            <div class="lobbyToggleBtnCon">
                <button v-if="lobbyStatus" class="toggleLobbyBtn" v-on:click="$store.commit('toggleLobby')"><fa class="fas" :icon="['fa', 'chevron-right']"/></button>
                <button v-else class="toggleLobbyBtn" v-on:click="$store.commit('toggleLobby')">
                    <fa class="fas" :icon="['fa', 'users']"/> 
                    <div class="lobbyCountCon">
                        <p class="highlightTextP">0/8</p>
                    </div>
                </button>
            </div>
            <!-- Simplebar -->
            <div class="overflowCon" data-simplebar-auto-hide="true">
                <!-- Add User Btn -->
                <div class="addUserBtnCon">
                    <button class="addUserBtn" v-on:click="$store.commit('setModalComponent', 'FriendActions')"><fa class="fas" :icon="['fa', 'plus']"/><div class="friendRequestTotal" v-if="friendRequestTotal > 0"><p>{{friendRequestTotal}}</p></div></button>
                </div>
                <div class="userListIconCon" ref="userListIconCon">
                    <div class="userCon" @contextmenu="handler($event, friend)" v-on:click="handler($event, friend)" :key="friend._id" v-for="friend in friendsList" :style="{ 'background-image' : `url(${friend.profileImage})`, 'border' : `3px solid ${friend.accentColor}`, 'background-color' : friend.accentColor }">
                        <div class="userStatusCon" :class="{ 'online' : friend.status === 'online' }"></div>
                    </div>
                </div>
            </div>

            <!-- User action box -->
            <div class="userActionBoxCon" :style="actionMenuPos" v-if="showUserActionBox" v-closable="{exclude: ['userListIconCon'], handler: 'closeUserActionBox'}">
                <nuxt-link class="userActionBoxLink" @click.native="showUserActionBox = false" :to="'/user/'+selectedFriendId">View Profile <fa class="fas" :icon="['fa', 'user']"/></nuxt-link>
                <p class="userActionBoxLink" v-on:click="addToLobby(selectedFriendId); showUserActionBox = false">Add To Lobby <fa class="fas" :icon="['fa', 'plus']"/></p>
            </div>

        </div>
    </div>
</template>

<script>
// Libs
import io from 'socket.io-client'

// Components
import Simplebar from 'simplebar-vue'
import Lobby from '@/components/GlobalComps/Lobby'

export default {
    data() {
        return {
            showUserActionBox: false,
            actionMenuPos: '',
            selectedFriendId: ''
        }
    },
    components: {
        Simplebar,
        Lobby,

    },
    mounted() {
        this.$store.dispatch('loadFriendListData')
        this.$store.dispatch('loadFriendRequestData')

        // Handle friend request ping
        this.$socketTest.on('friendRequestPing', data => {
            this.$store.commit('incrementFriendRequestTotal')
        });
        // Handle new friend added
        this.$socketTest.on('newFriend', data => {
            console.log(data)
            this.$store.commit('addNewFriend', data)
        });
    },
    computed: {
        lobbyStatus() {
            return this.$store.state.siteFunction.lobbyStatus
        },
        friendsList() {
            return this.$store.state.friends.friendsList
        },
        friendRequestTotal() {
            return this.$store.state.friends.friendRequestTotal
        }
    },
    methods: {
        handler(e, friend) {
            this.showUserActionBox = !this.showUserActionBox
            this.actionMenuPos = `top: ${e.clientY}px; left: ${e.clientX - 200}px;`
            this.selectedFriendId = friend._id
            e.preventDefault();
        },
        closeUserActionBox() {
            this.showUserActionBox = false
        },
        addToLobby(userId) {
            console.log(userId)
        }
    }
}
</script>

<style scoped>
/* User list */
.userListCon {
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 60px;
    border-left: 1px solid var(--border);
    background-color: var(--background-1);
    z-index: 20;
}
.lobbyToggleBtnCon {
    height: 60px;
    width: 100%;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;
    align-items: center;
} 
.toggleLobbyBtn {
    height: 40px;
    width: 40px;
    background-color: transparent;
    border: none;
    position: relative;
    cursor: pointer;
}
.toggleLobbyBtn .fas {
    color: var(--text-2);
    font-size: 20px;
    transition: 0.2s;
}
.toggleLobbyBtn:hover .fas {
    color: var(--accent-1);
}
.lobbyCountCon {
    position: absolute;
    top: 30px;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
}
.highlightTextP {
    font-size: 12px;
    font-weight: bold;
}

/* Overflow */
.overflowCon {
    height: calc(100% - 60px);
    overflow-x: visible !important;
    overflow-y: scroll;
    
    position: relative;
}
.overflowCon::-webkit-scrollbar {
  display: none;
}
.overflowCon {
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Add User */
.addUserBtnCon {
    height: 60px;
    width: 100%;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
} 
.addUserBtn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--background-2);
    border: none;
    cursor: pointer;
}
.addUserBtn .fas {
    color: var(--text-1);
    transition: 0.2s;
    font-size: 16px;
}
.addUserBtn:hover .fas {
    color: var(--accent-1);
}
.friendRequestTotal {
    height: 20px;
    width: 20px;
    position: absolute;
    bottom: 5px;
    right: 5px;
    background-color: var(--accent-1);
    color: #FFF;
    font-size: 14px;
    border-radius: 50%;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* User list */
.userListIconCon {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0;
} 
.userCon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #194F6B;
    margin: 0 0 5px;
    position: relative;
    background-size: cover;
    background-position: center;
    cursor: pointer;
}
.userCon:last-child {
    margin-bottom: 0;
}
.userStatusCon {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 10px;
    height: 10px;
    border: 1px solid black;
    border-radius: 50%;
}
.online {background-color: var(--accent-2);} 
.idle {background-color: #FF8A15;}
.offline {background-color: var(--accent-1);} 

/* User action menue */
.userActionBoxCon {
    position: fixed;
    width: 200px;
    top: 100px;
    right: 300px;
    background-color: var(--accent-1);
    border-radius: 5px;

    overflow: hidden;
}
.userActionBoxLink {
    display: block;
    width: 100%;
    padding: 5px 10px;
    border-bottom: 1px solid #E93C49;
    color: var(--text-1);
    font-size: 16px;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    background-color: var(--accent-1);
    transition: 0.2s;
    cursor: pointer;
}
.userActionBoxLink:last-child {
    border-bottom: none;
}
.userActionBoxLink:hover {
    background-color: var(--accent-1-hover);
}

/* Lobby Container */
.lobbyCon {
    position: fixed;
    right: -290px;
    bottom: 0;
    top: 0;
    width: 350px;
    height: 100%;
    background-color: var(--background-1);
    border-left: 1px solid var(--border);
    transition: 0.2s;
    z-index: 10;
}
.lobbyCon.active {
    right: 60px;
}
</style>
