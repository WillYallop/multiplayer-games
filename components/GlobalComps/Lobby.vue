<template>
    <div class="lobbyWrapper">

        <div class="lobbyHeaderCon">
            <p class="lobbyHeaderP"><fa class="fas" :icon="['fa', 'users']"/> Lobby <span class="highlightTextP">0/8</span></p>
        </div>
     
        <Simplebar class="lobbyBody" data-simplebar-auto-hide="true">
            <div v-if="!loading" class="lobbyBodyInner">
                <!-- Lobby -->
                <div v-if="lobby" class="lobbyCon">
                    {{lobby}}
                    {{players}}
                    <button v-on:click="$store.dispatch('deleteLobby')">x</button>
                </div>
                <!-- Create Lobby -->
                <div v-else class="createLobbyCon">
                    <button class="createLobbyBtn" v-on:click="$store.dispatch('createLobby')"><fa class="fas" :icon="['fa', 'plus']"/></button>
                    <p class="createLobbyP">Create a new lobby!</p>
                </div>
            </div>
            <div v-else class="">
                <p>Loading...</p>
            </div>
        </Simplebar>
        
    </div>
</template>

<script>
// Libs
import axios from 'axios'

// Components
import Simplebar from 'simplebar-vue'

export default {
    data() {
        return {
            loading: true,
            pingInterval: null

        }
    },
    components: {
        Simplebar
    },
    mounted() {
        this.$store.dispatch('loadLobby')
        .then((response) => {
            this.loading = false
            this.togglePingCheckInterval()
        })
    },
    computed: {
        lobby() {
            return this.$store.state.lobby.lobby
        },
        players() {
            return this.$store.state.lobby.players
        }
    },
    methods: {
        checkPing() {
            this.$store.dispatch('checkPing')
        },
        togglePingCheckInterval() {
            if(this.lobby != false) {
                this.pingInterval = setInterval(this.checkPing, 60000)
            } else {
                clearInterval(this.pingInterval)
                this.pingInterval = null  
            }
        },

    },
    watch: {
        lobby() {
            this.togglePingCheckInterval()
        }
    }

}
</script>

<style scoped>
.lobbyWrapper {
    width: 100%;
    height: 100%;
}
.lobbyHeaderCon {
    padding: 0 20px;
    height: 60px;
    width: 100%;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
}
.lobbyHeaderP {
    color: var(--text-1);
    font-weight: bold;
}
.lobbyHeaderP .fas {
    margin-right: 5px;
}

/* Lobby Body */
.lobbyBody {
    height: calc(100% - 60px);
} 
.lobbyBodyInner {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
/* Create Lobby */
.createLobbyCon {
    text-align: center;
} 
.createLobbyBtn {
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: var(--accent-1);
    border: none;
    margin-bottom: 10px;
    color: #FFF;
    font-size: 18px;
    cursor: pointer;
} 
.createLobbyBtn:hover {
    background-color: var(--accent-1-hover);
}
.createLobbyP {
    color: var(--text-1);
    font-weight: bold;
}

/* Lobby */
.lobbyCon {
    height: 100%;
}

</style>

<style>
.lobbyBody .simplebar-content {
    height: 100%;
}
</style>