<template>
    <header class="siteHeaderCon" :class="{ 'lobbyActive' : lobbyStatus }">
        <img class="siteLogo" src="../../assets/images/siteLogo.svg">
        <div class="rightSide">
            <!-- Notifications -->
            <div class="notificationCon">
                <button class="notificationBtn"><fa class="fas" :icon="['fa', 'bell']"/></button>
            </div>
            <!-- User -->
            <div class="userBtnContainer">
                <div class="userDropwdownBtn">  
                    <div class="buttonSection" v-on:click="userDropdown = !userDropdown" :class="{ 'dropdownActive' : userDropdown }" ref="closeDropBtn">
                        <div class="profileDetailsCon" v-if="this.$store.state.auth.loggedIn">
                            <img src="https://avatarfiles.alphacoders.com/865/86518.png" class="userProfilePic">
                            <p>{{$auth.user.username}}</p>
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
            userDropdown: false
        }
    },
    components: {

    },
    computed: {
        lobbyStatus() {
            return this.$store.state.siteFunction.lobbyStatus
        }
    },
    methods: {
        closeUserDropdown() {
            this.userDropdown = !this.userDropdown
        },
        signOut() {
            this.$auth.logout()
            .then(() => {
                this.$router.go()
            })
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.profileDetailsCon p {
    color: var(--text-2);
    font-size: 14px;
    padding-left: 5px;
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
    background-color: var(--accent-1);
    border-radius: 0 0 5px 5px;
    overflow: hidden;
}
.dropdownLink {
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
.dropdownLink:last-child {
    border-bottom: none;
}
.dropdownLink:hover {
    background-color: var(--accent-1-hover);
}
</style>
