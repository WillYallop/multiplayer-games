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
            <Simplebar class="overflowCon" data-simplebar-auto-hide="true">
                <!-- Add User Btn -->
                <div class="addUserBtnCon">
                    <button class="addUserBtn" v-on:click="$store.commit('setModalComponent', 'FriendActions')"><fa class="fas" :icon="['fa', 'plus']"/></button>
                </div>
                <div class="userListIconCon">
                    <div class="userCon" :key="friend._id" v-for="friend in friendsList" :style="{ 'background-image' : `url(${friend.profileImage})`, 'border' : `3px solid ${friend.accentColor}`, 'background-color' : friend.accentColor }" v-on:click="$router.push('/user/'+friend._id)">
                        <div class="userStatusCon" :class="{ 'online' : friend.status === 'online' }"></div>
                    </div>
                    <button v-on:click="send">g</button>
                </div>
            </Simplebar>

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
  
        }
    },
    components: {
        Simplebar,
        Lobby,

    },
    mounted() {
        this.$store.dispatch('loadFriendListData')

        // handle the event sent with socket.send()
        this.$socketTest.on('friendRequest', data => {
            console.log(data);
        });

    },
    computed: {
        lobbyStatus() {
            return this.$store.state.siteFunction.lobbyStatus
        },
        friendsList() {
            return this.$store.state.friends.friendsList
        },
    },
    methods: {
        send() {
            // or with emit() and custom event names
            this.$socketTest.emit('friendRequest', 'Hello there!');
        },
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
}

/* Add User */
.addUserBtnCon {
    height: 60px;
    width: 100%;
    border-bottom: 1px solid var(--border);
    display: flex;
    justify-content: center;
    align-items: center;
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

<style>
.overflowCon .simplebar-content {
    height: 100%;
}
</style>