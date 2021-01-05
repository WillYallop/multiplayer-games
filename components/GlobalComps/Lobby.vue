<template>
    <div class="lobbyWrapper">

        <div class="lobbyHeaderCon">
            <p class="lobbyHeaderP"><fa class="fas" :icon="['fa', 'users']"/> Lobby <span class="highlightTextP">0/8</span></p>
            <div v-if="lobby" class="lobbyBtnCon">
                <button v-if="$auth.user._id === lobby.adminId" class="deleteLobbyBtn" v-on:click="$store.dispatch('deleteLobby')"><fa class="fas" :icon="['fa', 'times']"/></button>
                <button v-else class="deleteLobbyBtn" v-on:click="$store.dispatch('leaveLobby')"><fa class="fas" :icon="['fa', 'times']"/></button>
            </div>
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
                                <button v-if="player._id != lobby.adminId && $auth.user._id === lobby.adminId" class="removePlayerBtn"><fa class="fas" :icon="['fa', 'times']"/></button>
                            </div>
                        </div>
                    </div>

                    <div class="botHalfCon">
                        <!-- Game Selected -->
                        <div class="gamePreviewCon">
                            <div v-if="lobby.selectedGame.game" class="gamePreInnerCon">
                                <div class="gamePreLeftCon">
                                    <img :src="lobby.selectedGame.image" class="gameIcon">
                                    <div class="gamePreTextarea">
                                        <p class="gameTitleP">Game Selected:</p>
                                        <p class="gameP">{{lobby.selectedGame.title}}</p>
                                    </div>
                                </div>
                                <div class="gamePrePlayerCap">
                                    <fa class="fas" :icon="['fa', 'users']"/>
                                    <p class="playersP">{{lobby.selectedGame.min_players}}-{{lobby.selectedGame.max_players}}</p>
                                </div>
                            </div>
                            <div v-else class="gamePreInnerCon">
                                <div class="gamePreLeftCon">
                                    <div class="emptyGameIcon"></div>
                                    <div class="gamePreTextarea">
                                        <p class="gameTitleP">Game Selected:</p>
                                        <p class="gameP">No game selected!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="botHalfBotCon">
                            <!-- Ready up / ready down button -->
                            <button class="btnStylised" :class="{ 'greenBtnStylised': readyStatus() }" v-on:click="$store.dispatch('readyToggle', readyStatus())"><span class="underlineSpan"></span> <span v-if="readyStatus()">Ready</span><span v-else>Not Ready</span></button>
                            <button v-if="playersReady && $auth.user._id === lobby.adminId" class="btnStylised greenBtnStylised" style="margin-top: 10px;" v-on:click="$store.dispatch('startTimer')"><span class="underlineSpan"></span> Start Game</button>
                        </div>
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
import lobby from '~/store/modules/lobby'

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

        // Listen to players joining lobby
        this.$socketIo.on('personJoinedLobby', data => {
            this.$store.commit('addPlayerToLobby', data)
        });

        // Listen to players leaving lobby
        this.$socketIo.on('personLeftLobby', data => {
            this.$store.commit('personLeftLobby', data)
        });

        // Admin deleted lobby
        this.$socketIo.on('adminDeletedLobby', data => {
            this.$store.dispatch('lobbyEnded')
        });

        // Make users send their ping, when a user rejoins the lobby socket
        this.$socketIo.on('updatePingRequest', data => {
            this.$store.dispatch('checkPing')
        });

        // Update lobby players with users ping
        this.$socketIo.on('sendUserPingToLobby', data => {
            this.$store.commit('updateUsersPing', data)
        });

        // Toggle players ready up status 
        this.$socketIo.on('playerReadyToggle', data => {
            this.$store.commit('updatePlayersReadyStatus', data)
        });

        // Admin set lobby game
        this.$socketIo.on('setLobbyGame', data => {
            this.$store.commit("setLobbyGame", data);
        });
    },
    computed: {
        lobby() {
            return this.$store.state.lobby.lobby
        },
        players() {
            return this.$store.state.lobby.players
        },
        playersReady () {
            let playersReady = false
            for(var i = 0; i < this.lobby.players.length; i++) {
                this.lobby.players[i].playerReady ? playersReady = true : playersReady = false
                if(!playersReady) {
                    break
                }
            }
            return playersReady
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
            var playerIndex = this.lobby.players.findIndex(item => item.playerId === id)
            return this.lobby.players[playerIndex].playerReady
        },
        returnPing(id) {
            var playerIndex = this.lobby.players.findIndex(item => item.playerId === id)
            return this.lobby.players[playerIndex].ping
        },
        readyStatus() {
            var player = this.lobby.players.find(item => item.playerId === this.$auth.user._id)
            return !player.playerReady
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
    margin-bottom: 5px;
} 
.playerCon:last-child {
    margin-bottom: 0;
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
    
}
.botHalfBotCon {
    padding: 20px;
}
.botHalfBotCon .btnStylised {
    width: 100%;
}

/* Game Preview */
.gamePreviewCon {
    border-top: 1px solid var(--border);
    padding: 20px 20px 0;
} 
.gamePreInnerCon {
    display: flex;
    justify-content: space-between;
} 
.gamePreLeftCon {
    display: flex;
    align-items: center;
} 
.gameIcon {
    height: 50px;
    width: 50px;
    min-width: 50px;
    border-radius: 5px;
    object-fit: cover;
    background-color: #0F1721;
} 
.emptyGameIcon {
    height: 50px;
    width: 50px;
    min-width: 50px;
    border-radius: 5px;
    background-color: #0F1721;
} 
.gamePreTextarea {
    padding-left: 10px;
} 
.gameTitleP {
    color: var(--text-1);
} 
.gameP {
    color: var(--text-2);
} 
.gamePrePlayerCap {
  padding-left: 10px;
}
.gamePrePlayerCap .fas {
  color: var(--accent-1);
  font-size: 14px;
}
.playersP {
  color: var(--accent-1);
  font-size: 12px;
  font-weight: bold;
  margin-top: -2px;
}

</style>

<style>
.lobbyBody .simplebar-content {
    height: 100%;
}
</style>