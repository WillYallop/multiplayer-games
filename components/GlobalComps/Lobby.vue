<template>
    <div class="lobbyWrapper">

        <div class="lobbyHeaderCon">
            <p class="lobbyHeaderP"><fa class="fas" :icon="['fa', 'users']"/> Lobby <span class="highlightTextP">0/8</span></p>
            <button class="deleteLobbyBtn" v-on:click="$store.dispatch('deleteLobby')"><fa class="fas" :icon="['fa', 'times']"/></button>
        </div>
     
        <Simplebar class="lobbyBody" data-simplebar-auto-hide="true">
            <div v-if="!loading" class="lobbyBodyInner">
                <!-- Lobby -->
                <div v-if="lobby" class="lobbyCon">
                    
                    <div class="topHalfCon">
                        <!-- Player Display -->
                        <div class="playerCon" :key="player._id" v-for="player in players" :class="{ 'readyUp' : isReadyUp(player._id) }">
                            <div class="playerLeftCol">
                                <div class="imgCon">
                                    <img :src="player.profileImage" class="playerIcon" :style="{ border: `2px solid ${player.accentColor}`, 'background-color': `url(${player.accentColor})` }">
                                    <div class="adminCrownCon" v-if="player._id === lobby.adminId">
                                        <fa class="fas" :icon="['fa', 'crown']"/>
                                    </div>
                                </div>
                                <div class="playerTextarea">
                                    <p class="playerName">{{player.username}}</p>
                                    <p class="playerExperience">{{player.experience}}</p>
                                </div>
                            </div>
                            <div class="playerRightCol">
                                <PingIcon
                                :ping="returnPing(player._id)"/>
                                <button v-if="player._id != lobby.adminId" class="removePlayerBtn"><fa class="fas" :icon="['fa', 'times']"/></button>
                            </div>
                        </div>
                        <p style="color: #FFF;">{{lobby}}</p>
                    </div>
                    <div class="botHalfCon">
                        <!-- Ready up / ready down button -->
                        <button class="btnStylised" aria-label="Sign In"><span class="underlineSpan"></span>Ready Up</button>
                    </div>
                    
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
import PingIcon from '@/components/GlobalComps/PingIcon'

export default {
    data() {
        return {
            loading: true,
            pingInterval: null,
            pingIntervalActive: false

        }
    },
    components: {
        Simplebar,
        PingIcon
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
                if(!this.pingIntervalActive) {
                    this.pingIntervalActive = true
                    this.pingInterval = setInterval(this.checkPing, 60000)
                }
            } else {
                clearInterval(this.pingInterval)
                this.pingInterval = null  
                this.pingIntervalActive = false
            }
        },
        isReadyUp(id) {
            var playerIndex = this.lobby.players.findIndex(item => item.playerId === this.$auth.user._id)
            return this.lobby.players[playerIndex].playerReady
        },
        returnPing(id) {
            var playerIndex = this.lobby.players.findIndex(item => item.playerId === this.$auth.user._id)
            return this.lobby.players[playerIndex].ping
        }

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
    justify-content: space-between;
    align-items: center;
}
.lobbyHeaderP {
    color: var(--text-1);
    font-weight: bold;
}
.lobbyHeaderP .fas {
    margin-right: 5px;
}
.deleteLobbyBtn {
    background-color: transparent;
    height: 30px;
    width: 30px;
    border: none;
    cursor: pointer;
}   
.fas {
    transition: 0.2s;
    font-size: 20px;
    color: var(--text-2);
}
.deleteLobbyBtn:hover .fas {
    color: var(--accent-1);
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
    display: flex;
    flex-wrap: wrap;
}
/* Top Half */
.topHalfCon {
    width: 100%;
    align-self: flex-start;
    padding: 20px;
}
/* PLayer Display */
.playerCon {
    width: 100%;
    border: 2px solid var(--accent-1);
    background-color: #0F1721;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
} 
.playerCon.readyUp {
    border: 2px solid var(--accent-2);
}
.playerLeftCol {
    display: flex;
    align-items: center;
} 
.imgCon  {
    width: 30px;
    height: 30px;
    position: relative;
}
.playerIcon {
    height: 30px;
    width: 30px;
    min-width: 30px;
    object-fit: cover;
    border-radius: 50%;
} 
.adminCrownCon {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
}
.adminCrownCon .fas {
    color: #FFEC01;
    font-size: 10px;
}
.playerTextarea {
    padding-left: 10px;
} 
.playerName {
    color: var(--text-1);
    font-size: 14px;
    font-weight: bold;
} 
.playerExperience {
    font-size: 14px;
    color: var(--text-2);
}
.playerRightCol {
    display: flex;
    align-items: center;
}
.removePlayerBtn {
    height: 30px;
    width: 30px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    margin-left: 5px;
}
.removePlayerBtn .fas {
    color: var(--text-2);
}
.removePlayerBtn:hover .fas {
    color: var(--accent-1);
}


/* Bottom Half */
.botHalfCon {
    width: 100%;
    align-self: flex-end;
    padding: 20px;
}
.botHalfCon .btnStylised {
    width: 100%;
}

</style>

<style>
.lobbyBody .simplebar-content {
    height: 100%;
}
</style>