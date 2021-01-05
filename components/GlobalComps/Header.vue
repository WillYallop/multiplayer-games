<template>
    <header class="siteHeaderCon" :class="{ 'lobbyActive' : lobbyStatus }">
        <img class="siteLogo" src="../../assets/images/siteLogo.svg">
        <div class="rightSide">
            <!-- Notifications -->
            <div class="notificationCon">
                <button class="notificationBtn" ref="notificationBtn" v-on:click="notificationDropdown = !notificationDropdown"><fa class="fas" :icon="['fa', 'bell']"/></button>

                <!-- Notification Dropdown -->
                <div class="notificationDropdown" v-if="notificationDropdown" v-closable="{exclude: ['notificationBtn'], handler: 'closeNotificationDropdown'}">
                    <div v-if="notifications.length > 0" class="notificationBody">
                        <p class="notificationsP">You have {{notifications.length}} notification!</p>
                        <div class="forNotificationCon" :key="notification._id" v-for="notification in notifications">
                            <div class="notificationInner" v-if="notification.notificationType === 'lobby'">
                                <div class="notificationTextarea">
                                    <p class="notificationActionP">Join Lobby</p>
                                    <p class="notificationUserP">From {{notification.fromUsername}}</p>
                                </div>
                                <div class="notificationBtnArea">
                                    <button class="notificationDropdownBtn cancel" v-on:click="deleteNotification(notification._id)"><fa class="fas" :icon="['fa', 'times']"/></button>
                                    <button class="notificationDropdownBtn accept" v-on:click="joinLobby(notification._id, notification.lobbyId)"><fa class="fas" :icon="['fa', 'check']"/></button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div v-else class="notificationBody">
                        <p class="noNotificationsP">You have no notifications!</p>
                    </div>
                </div>
            </div>
            <!-- User -->
            <div class="userBtnContainer">
                <div class="userDropwdownBtn">  
                    <div class="buttonSection" v-on:click="userDropdown = !userDropdown" :class="{ 'dropdownActive' : userDropdown }" ref="closeDropBtn">
                        <div class="profileDetailsCon" v-if="this.$store.state.auth.loggedIn">
                            <img :src="$auth.user.profileImage" class="userProfilePic" :style="{ 'border' : `2px solid ${$auth.user.accentColor}`, 'background-color' : $auth.user.accentColor }">
                            <div class="textarea">
                                <p>{{$auth.user.username}}</p>
                                <p class="gamerTagP">Tag: {{$auth.user.gamerTag}}</p>
                            </div>
                        </div>
                        <fa class="fas toggleDropdownBtn" :icon="['fa', 'chevron-down']"/>
                    </div>
                    <div class="dropdownSection" v-if="userDropdown" v-closable="{exclude: ['closeDropBtn'], handler: 'closeUserDropdown'}">
                        <nuxt-link class="dropdownLink" to="/user">Profile <fa class="fas" :icon="['fa', 'user']"/></nuxt-link>
                        <nuxt-link class="dropdownLink" to="/settings">Settings <fa class="fas" :icon="['fa', 'cog']"/></nuxt-link>
                        <p class="dropdownLink" v-on:click="signOut()">Sign Out <fa class="fas" :icon="['fa', 'sign-out-alt']"/></p>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
export default {
    data() {
        return {
            userDropdown: false,
            notificationDropdown: false
        }
    },
    components: {

    },
    mounted() {
        // Load Notification data
        this.$store.dispatch('loadNotificationData')

        // Handle friend request ping
        this.$socketIo.on('newLobbyRequest', data => {
            this.$store.commit('pushNewNotificationObject', data)
        });
    },
    computed: {
        lobbyStatus() {
            return this.$store.state.siteFunction.lobbyStatus
        },
        notifications() {
            return this.$store.state.siteFunction.notifications
        }
    },
    methods: {
        closeUserDropdown() {
            this.userDropdown = false
        },
        closeNotificationDropdown() {
            this.notificationDropdown = false
        },
        signOut() {
            this.$auth.logout()
            .then(() => {
                this.$router.go()
            })
        },
        joinLobby(notificationId, lobbyId) {
            this.$store.dispatch('acceptLobbyRequest', {
                notificationId: notificationId,
                lobbyId: lobbyId
            })
        },
        deleteNotification(notificationId) {
            this.$store.dispatch('deleteNotification', notificationId)
        }
    }
}
</script>

<style scoped>
.siteHeaderCon {
    position: fixed;
    top: 0;
    left: 0;
    right: 60px;
    height: 60px;
    background-color: var(--background-1);
    border-bottom: 1px solid var(--border);
    transition: 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000;
}
.siteHeaderCon.lobbyActive {
    right: 410px;
}
/* Logo */
.siteLogo {
    height: 30px;
    padding-left: 20px;
}
/* Right Side */
.rightSide {
    display: flex;
}
/* Notification */
.notificationCon {
    height: 60px;
    width: 60px;
    border-left: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
} 
.notificationBtn {
    background-color: transparent;
    border: none;
    cursor: pointer;
}
.notificationBtn .fas {
    font-size: 18px;
    transition: 0.2s;
    color: var(--text-1);
}
.notificationBtn:hover .fas {
    color: var(--accent-1);
}
/* Notification Dropdown */
.notificationDropdown {
    position: absolute;
    top: 60px;
    right: 0;
    width: 300px;
    background-color: #FFF;
    border-radius: 5px;
    overflow: hidden;
    border: 1px solid #F2F2F2;
}
.notificationBody {
    width: 100%;
} 
.notificationsP {
    padding: 5px;
    border-bottom: 1px solid #F2F2F2;
    font-weight: bold;
    font-size: 14px;
}
.forNotificationCon {
    padding: 5px;
}
.notificationInner {
    padding: 5px;
    width: 100%;
    background-color: #F2F2F2;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
}
.notificationInner:last-child {
    margin-bottom: 0;
}
.notificationTextarea {
    padding-right: 10px;
}
.notificationActionP {
    font-weight: bold;
    font-size: 14px;
    color: #101010;
}
.notificationUserP {
    font-size: 14px;
    color: #757575;
    margin-top: 2px;
}
.notificationBtnArea {
    display: flex;
    align-items: center;
}
.notificationDropdownBtn {
    height: 30px;
    width: 30px;
    min-height: 30px;
    min-width: 30px;
    margin-left: 5px;
    border-radius: 50%;
    color: #FFF;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.2s;
    border: none;
}
.notificationDropdownBtn .fas {
    font-size: 14px;
}
.notificationDropdownBtn.cancel {
    background-color: var(--accent-1);
} 
.notificationDropdownBtn.cancel:hover {
    background-color: var(--accent-1-hover);
} 
.notificationDropdownBtn.accept {
    background-color: var(--accent-2);
}
.notificationDropdownBtn.accept:hover {
    background-color: var(--accent-2-hover);
} 
.noNotificationsP {
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #090D14;
}

/* User Dropdown */
.userBtnContainer {
    padding: 0 20px;
    border-left: 1px solid var(--border);
    display: flex;
    align-items: center;
}
.userDropwdownBtn {
    width: 180px;
    position: relative;
}
.buttonSection {
    background-color: var(--background);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
}
.buttonSection.dropdownActive {
    border-radius: 5px 5px 0 0;
}
.profileDetailsCon {
    display: flex;
    align-items: center;

}
.textarea {
    max-width: 110px;
    padding-left: 5px;
}
.textarea p {
    color: var(--text-2);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.gamerTagP {
    font-size: 12px !important;
}
.userProfilePic {
    height: 30px;
    width: 30px;
    object-fit: cover;
    border-radius: 50%;
    border: 2px solid #FFEC01;
}
.toggleDropdownBtn {
    color: #22344D;
    font-size: 14px;
    margin-left: 10px;
    margin-right: 5px;
}
/* Dropdown */
.dropdownSection {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    background-color: #FFFFFF;
    border: 1px solid #F2F2F2;
    border-radius: 0 0 5px 5px;
    padding: 5px;
    overflow: hidden;
}
.dropdownLink {
    display: block;
    width: 100%;
    padding: 5px 10px;
    color: #101010;
    font-size: 16px;
    text-decoration: none;
    display: flex;
    justify-content: space-between;
    background-color: #F2F2F2;
    transition: 0.2s;
    cursor: pointer;
    margin-bottom: 5px;
    border-radius: 5px;
}
.dropdownLink:last-child {
    margin-bottom: 0;
}
.dropdownLink:hover {
    background-color: #ECECEC;
}
.dropdownLink .fas {
    color: #848484;
}
</style>
