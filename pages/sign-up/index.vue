<template>
    <div>
        <div class="signUpCon">

            <div class="mobileHeader">
                <nuxt-link to='/' class="headerLogoImg"><img class="headerLogoImg" src="../../assets/images/siteLogo.svg" alt="Bassline Promotions Logo"></nuxt-link>
                <nuxt-link to="/" class="homeBtn"><fa class="fas" :icon="['fas', 'home']"/></nuxt-link>
            </div>
        
            <div class="col1">
                <!-- Particals -->
                <client-only>
                    <vue-particles class="particalBackground" v-if="showParticles"
                        color="#dedede"
                        :particleOpacity="0.7"
                        :particlesNumber="150"
                        shapeType="circle"
                        :particleSize="4"
                        linesColor="#dedede"
                        :linesWidth="2"
                        :lineLinked="true"
                        :lineOpacity="0.4"
                        :linesDistance="150"
                        :moveSpeed="3"
                        :hoverEffect="false"
                        hoverMode="repulse"
                        :clickEffect="false"
                        clickMode="repulse"/>
                </client-only>
            </div>
            <div class="col2">
                <div class="col2Header">
                    <nuxt-link to='/' class="headerLogoImg"><img class="headerLogoImg" src="../../assets/images/siteLogo.svg" alt="Bassline Promotions Logo"></nuxt-link>
                    <nuxt-link to="/" class="homeBtn"><fa class="fas" :icon="['fas', 'home']"/></nuxt-link>
                </div>
                <div class="col2ContentCon">
                    <h1>Sign Up to Party Games</h1>
                    <p class="subtitleP">Have an account already? <nuxt-link to="/sign-in">Sign in here!</nuxt-link></p>
                    <div class="inputContainer">
                        <div class="inputCol">
                            <label for="fNamnIn">First Name</label>
                            <input type="text" id="fNamnIn" class="inputStyle" v-model="credentials.first_name" :class="{ 'inputNoData' : verifyFirstName === false }">
                        </div> 
                        <div class="inputCol">
                            <label for="lNameIn">Last Name</label>
                            <input type="text" id="lNameIn" class="inputStyle" v-model="credentials.last_name" :class="{ 'inputNoData' : verifyLastName === false }">
                        </div>
                        <label for="usernameIn">Username</label>
                        <input type="text" id="usernameIn" class="inputStyle" v-model="credentials.username" :class="{ 'inputNoData' : verifyUsername === false }">
                        <label for="emailIn">Email</label>
                        <input type="text" id="emailIn" class="inputStyle" v-model="credentials.email" :class="{ 'inputNoData' : verifyEmail === false }">

                        <label for="passwordIn">Password</label>
                        <div class="inputWrapper">
                            <input :type="passwordType" id="passwordIn" class="inputStyle" v-model="credentials.password" :class="{ 'inputNoData' : verifyPassword === false }">
                            <div class="passInputIconCon" style="cursor: pointer;" v-on:click="showPassword">
                                <fa class="fas" :icon="['fas', 'eye']"/>
                            </div>
                            <div class="passInputIconCon">
                                <fa class="fas" :icon="['fas', 'unlock-alt']" :class="{ 'strongPas' : passwordStrength === 'strong', 'mediumPas' : passwordStrength === 'medium', 'weakPas' : passwordStrength === 'weak', 'noPas' : passwordStrength === false }"/>
                            </div>
                        </div>  
                        
                        <label for="passwordRepeatIn">Password Repeat</label>
                        <input :type="passwordType" id="passwordRepeatIn" class="inputStyle" v-model="credentials.password_repeat" :class="{ 'inputNoData' : verifyPassword === false }">
                    </div>  
                    
                    <div class="errorMsgContainer" v-if="emptyFields.length > 0">
                        <ul class="errorMsgUl">
                            <li :key="field" v-for="field in emptyFields">{{field}}</li>
                        </ul>
                    </div>

                    <button :disabled="loadingSpinner" class="btnStylised" v-on:click="signUp" aria-label="Sign In"><span class="underlineSpan"></span><span v-if="loadingSpinner">Creating Account <img src="../../assets/images/loadingIndicator.gif" class="loadingImg"></span><span v-else>Sign Up</span></button>

                    <p class="footerP"><nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link> and <nuxt-link to="/terms-conditions">Terms & Conditions</nuxt-link> apply</p>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
// Libs
import axios from 'axios'

export default {
    data() {
        return {
            loadingSpinner: false,
            showParticles: false,
            credentials: {
                first_name: '', 
                last_name: '', 
                username: '',
                email: '', 
                password: '', 
                password_repeat: '',
                userCountry: '',
                userIp: '',
                userCity: ''
            },
            fieldsVerified: [false, false, false, false, false],
            // 
            passwordType: 'password',
            emptyFields: []
        }
    },
    mounted() {
        this.showParticles = true
        axios.get('https://ipinfo.io?token=b0132d6894662b')
        .then((response) => { 
            this.credentials.userIp = response.data.ip
            this.credentials.userCountry = response.data.country
            this.credentials.userCity = response.data.city
        })
        .catch((err) => {
            console.log(err)
        })
    },
    components: {

    },
    computed: {
        // Verify
        verifyFirstName() {
            if(this.credentials.first_name.length > 0) {
                var regex = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/
                if(regex.test(this.credentials.first_name)) {
                    this.fieldsVerified[0] = true
                    return true
                } else {
                    this.fieldsVerified[0] = false
                    return false
                }
            } else {
                this.fieldsVerified[0] = false
                return false
            }
        },
        verifyLastName() {
            if(this.credentials.last_name.length > 0) {
                var regex = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/
                if(regex.test(this.credentials.last_name)) {
                    this.fieldsVerified[1] = true
                    return true
                } else {
                    this.fieldsVerified[1] = false
                    return false
                }
            } else {
                this.fieldsVerified[1] = false
                return false
            }
        },
        verifyUsername() {
            if(this.credentials.username.length > 1 && this.credentials.username.length < 16) {
                var regex = /^[a-zA-Z0-9 ?!$-_]+(?:-[a-zA-Z0-9 ?!$-_]+)*$/
                if(regex.test(this.credentials.username)) {
                    this.fieldsVerified[2] = true
                    return true
                } else {
                    this.fieldsVerified[2] = false
                    return false
                }
            } else {
                this.fieldsVerified[2] = false
                return false
            }
        },
        verifyEmail() {
            if(this.credentials.email.length > 0) {
                var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if(regex.test(this.credentials.email)) {
                    this.fieldsVerified[3] = true
                    return true
                } else {
                    this.fieldsVerified[3] = false
                    return false
                }
            } else {
                this.fieldsVerified[3] = false
                return false
            }
        },
        verifyPassword() {
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
            if(this.credentials.password === this.credentials.password_repeat) {
                if(this.credentials.password.length >= 4) {
                    if(strongRegex.test(this.credentials.password)) {
                        this.fieldsVerified[4] = true
                        return 'strong'
                    } else if (mediumRegex.test(this.credentials.password)) {
                        this.fieldsVerified[4] = true
                        return 'medium'
                    } else {
                        this.fieldsVerified[4] = false
                        return 'weak'
                    }
                } else {
                    this.fieldsVerified[4] = false
                    return false
                }
            } else {
                this.fieldsVerified[4] = false
                return false
            }
        },
        passwordStrength() {
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})");
            if(this.credentials.password.length >= 4) {
                if(strongRegex.test(this.credentials.password)) {
                    return 'strong'
                } else if (mediumRegex.test(this.credentials.password)) {
                    return 'medium'
                } else {
                    return 'weak'
                }
            } else {
                return false
            }
        },
    },
    methods: {
        verifyDataHandler() {
            let checker = arr => arr.every(Boolean);
            if(checker(this.fieldsVerified)) {
                return true
            } else {
                return false
            }  
        },
        signUp() {
            this.loadingSpinner = true
            this.emptyFields = []
            if(this.verifyDataHandler()) {
                // Sign up
                axios.post(process.env.API_URL + '/user/signup', this.credentials)
                .then((res) => {
                    //Sign In
                    this.$auth.loginWith('local', { 
                        data: this.credentials
                    })
                    .then(() => {
                        this.$router.push('/')
                    })
                })
                .catch((err) => {
                    this.loadingSpinner = false
                    if(err) {
                        if(err.response.status === 409) {
                            this.emptyFields.push('A user with that email already exists')
                        }
                        if(err.response.status === 500) {
                            this.emptyFields.push('There was an unknown error creating your account')
                        }
                    }
                })
            } else {
                this.loadingSpinner = false
                if(!this.fieldsVerified[0]) {
                    this.emptyFields.push('Add a valid first name')
                }
                if(!this.fieldsVerified[1]) {
                    this.emptyFields.push('Add a valid last name')
                }
                if(!this.fieldsVerified[2]) {
                    this.emptyFields.push('Add a valid username')
                }
                if(!this.fieldsVerified[3]) {
                    this.emptyFields.push('Add a valid email')
                }
                if(!this.fieldsVerified[4]) {
                    this.emptyFields.push('Add valid password')
                }
            }
        },
        //Password
        showPassword() {
            if(this.passwordType === 'text') {
                this.passwordType = 'password'
            } else if(this.passwordType === 'password') {
                this.passwordType = 'text'
            }
        },
    }
}
</script>

<style scoped>
.signUpCon {
    width: 100%;
    height: 100%;
    min-height: 100vh;
    background-color: var(--accent-1);
    display: flex;
    flex-wrap: wrap;
} 
/* Col 1 Styles */
.col1 {
    width: calc(100% - 800px);
    background-color: var(--accent-1);
    height: 100%;
    min-height: 100vh;
    display: flex;
    align-items: center;
} 
.particalBackground {
    height: 100%;
    width: 100%;
}

/* Col 2 Styles */
.col2 {
    width: 800px;
    height: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: var(--background);
    position: relative;
} 
.col2Header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 30px;
    height: 60px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    background-color: var(--background);
} 
.headerLogoImg {
    height: 30px;
} 
.homeBtn {
    padding: 10px 25px;
    background-color: #EBEBEB;
    border: none;
    border-radius: 20px;
    margin-left: 10px;
    cursor: pointer;
    position: relative;
    transition: 0.3s;
    text-decoration: none;
}
.homeBtn:hover {
    background-color: #DCDCDC;
}
.homeBtn .fas {
    font-size: 16px;
    color: #1F1E1E;
}
.col2ContentCon {
    padding: 50px 30px;
    max-width: 560px;
    width: 100%;
    margin: 60px auto 0;
} 
.col2ContentCon h1 {
    font-size: 20px;
    margin-bottom: 5px;
    color: var(--text-1);
} 
.subtitleP {
    color: var(--text-2);
} 
.subtitleP a {
    font-weight: bold;
    color: var(--accent-1);
    text-decoration: none;
}
.inputContainer {
    margin-top: 40px;
    color: var(--text-1);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
} 
.inputContainer label {
    font-size: 14px;
    color: var(--text-2);
}
.inputCol {
    width: calc(50% - 10px);
}
.inputStyle {
    margin-top: 5px;
}    
.inputNoData:focus {
    border: 2px solid var(--accent-1);
}
.btnStylised {
    margin-top: 20px;
    width: 100%;
}
.loadingImg {
    height: 16px;
    width: 16px;
    margin-left: 10px;
}

/* Error */
.errorMsgContainer {
    margin-top: 20px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-2);
}
.errorMsgUl {
    margin: 0;
    padding-left: 20px;
    color: #FFF;
}
.errorMsgUl li {
    font-size: 14px;
}

/* input overlay */
.inputWrapper {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
}
.inputWrapper .inputStyle {
    width: calc(100% - 90px);
}
.passInputIconCon {
    margin-top: 5px;
    height: 40px;
    width: 40px;
    margin-left: 10px;
    background-color: #F2F2F2;
    border: 1px solid #DCDCDC;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.passInputIconCon .fas {
    font-size: 14px;
    color: #0c0909;
}
.passInputIconCon p {
    font-size: 12px;
}
.strongPas {color: #06D67B !important;} 
.mediumPas {color: #FD9D53 !important;} 
.weakPas {color: #FF2273 !important;} 
.noPas {color: #FF2273 !important;} 


.footerP {
    margin-top: 40px;
    color: var(--text-2);
    font-size: 14px;
}
.footerP a {
    font-weight: bold;
    color: var(--accent-1);
    text-decoration: none;
}

.headerMobile {display: none;}

.errorMsgCon {
    margin: 20px 0 0;
    text-align: center;
}
.errorMsgCon p {
    color: var(--accent-1);
}

/* Mobile header */
.mobileHeader {
    width: 100%;
    background-color: var(--background);
    height: 60px;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: none;
}


@media only screen and (max-width: 1350px) {
    .col1 {width: calc(100% - 560px);}
    .col2 {width: 560px;}
}
@media only screen and (max-width: 1024px) {
    .col1 {display: none;}
    .col2 {width: 100%;}
}
@media only screen and (max-width: 820px) {
    .headerMobile {display: flex;}
    .signUpCon {flex-direction: column; min-height: auto;}
    .mobileHeader {display: flex;}
    .col1 {width: 100%;height: 200px;min-height: auto; display: flex;}
    .imgContainer {padding: 0; height: auto; width: 90%; margin-top: 60%;}
    
    .col2 {width: 100%;height: auto;min-height: auto; border-radius: 20px 20px 0 0; overflow: hidden;}
    .col2Header {display: none;}
    .col2ContentCon {margin-top: 0;}
}
@media only screen and (min-width: 520px) {
    .col1 {height: 250px;}
}
</style>