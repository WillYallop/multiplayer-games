<template>
    <div class="lobbyWrapper">

        <div class="lobbyHeaderCon">
            <p class="lobbyHeaderP"><fa class="fas" :icon="['fa', 'users']"/> Lobby <span class="highlightTextP">0/8</span></p>
        </div>
     
        <Simplebar class="lobbyBody" data-simplebar-auto-hide="true">
            <!-- Lobby -->
            <div v-if="hasLobby" class="lobbyCon">

            </div>
            <!-- Create Lobby -->
            <div v-else class="createLobbyCon">
                <button class="createLobbyBtn" v-on:click="createLobby"><fa class="fas" :icon="['fa', 'plus']"/></button>
                <p class="createLobbyP">Create a new lobby!</p>
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
            hasLobby: false,

        }
    },
    components: {
        Simplebar
    },
    methods: {
        createLobby() {
            this.$store.dispatch('createLobby')
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
</style>

<style>
.lobbyBody .simplebar-content {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>