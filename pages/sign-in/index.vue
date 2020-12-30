<template>
    <div>
        <div class="signInCon">

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
                    <h1>Sign In to Party Games</h1>
                    <p class="subtitleP">Dont have an account? <nuxt-link to="/sign-up">Sign up here!</nuxt-link></p>
                    <div class="inputContainer">
                        <label for="emailIn">Email</label>
                        <input type="text" id="emailIn" class="inputStyle" autocomplete="email" v-model="credentials.email">
                        <label for="passwordIn">Password</label>
                        <input type="password" id="passwordIn" autocomplete="current-password" class="inputStyle" v-model="credentials.password">
                        <p style="font-size: 14px; text-decoration: underline; cursor: pointer;">Forgot Password</p>
                    </div>

                    <button class="btnStylised" v-on:click="signIn" aria-label="Sign In"><span class="underlineSpan"></span>Sign In</button>
                    <div class="errorMsgCon" v-if="errorMsg">
                        <p>{{errorMsg}}</p>
                    </div>

                    <p class="footerP"><nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link> and <nuxt-link to="/terms-conditions">Terms & Conditions</nuxt-link> apply</p>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showParticles: false,
            credentials: {
                email: '',
                password: ''
            },
            errorMsg: false
        }
    },
    mounted() {
        this.showParticles = true
    },
    components: {

    },
    methods: {
        signIn() {
            this.errorMsg = false
            try {
                this.$auth.loginWith('local', { 
                    data: this.credentials 
                }).then(() => {
                    this.$router.push('/')
                })
                .catch((err) => {
                    if(err.response.status == 401) {
                        this.errorMsg = 'Sign in attempt failed!'
                    }
                    if(err.response.status == 429) {
                        this.errorMsg = 'Too many requests! Please try again later.'
                    }
                    if(err.response.status == 500) {
                        this.errorMsg = 'Sign in attempt failed!'
                    }
                })
            } catch(err) {
                console.log(err)
            }
        },
    }
}
</script>

<style scoped>
.signInCon {
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
} 
.inputContainer label {
    font-size: 14px;
    color: var(--text-2);
}
.inputStyle {
    width: 100%;
    background-color: #FAFAFA;
    border: none;
    border-radius: 5px;
    margin-top: 5px;
    margin-bottom: 10px;
    padding: 0 10px;
    height: 40px;
    font-size: 16px;
    -webkit-appearance: none;
}   
.btnStylised {
    margin-top: 20px;
    width: 100%;
}

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
    .signInCon {flex-direction: column; min-height: auto;}
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