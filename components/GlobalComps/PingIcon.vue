<template>
    <div>
        <div class="pingCon">
            <div class="pingBar bar1" :class="{ 'badCon' : bar1, 'okayCon' : bar2, 'betterCon' : bar3, 'goodCon' : bar4 }"></div> 
            <div class="pingBar bar2" :class="{ 'okayCon' : bar2, 'betterCon' : bar3, 'goodCon' : bar4 }"></div>
            <div class="pingBar bar3" :class="{ 'betterCon' : bar3, 'goodCon' : bar4 }"></div>
            <div class="pingBar bar4" :class="{ 'goodCon' : bar4 }"></div>
        </div>
        
    </div>
</template>

<script>
export default {
    props: {
        ping: Number
    },
    computed: {
        bar1() {
            if(this.ping >= 140) {
                return true
            } else {
                return false
            }
        },
        bar2() {
            if(this.ping >= 100 && this.ping < 140) {
                return true
            } else {
                return false
            }
        },
        bar3() {
            if(this.ping > 60 && this.ping < 100) {
                return true
            } else {
                return false
            } 
        },
        bar4() {
            if(this.ping <= 60) {
                return true
            } else {
                return false
            } 
        }
    }
}
</script>

<style scoped>
.pingCon {
    display: flex;
    align-items: flex-end;
    margin-right: -2px;
}
.pingBar {
    width: 3px;
    margin-right: 2px;
    background-color: #B8B8B8;
}
.bar1 {height: 6px;}
.bar2 {height: 8px;}
.bar3 {height: 10px;}
.bar4 {height: 12px;}
.badCon { background-color: var(--accent-1) !important;}
.okayCon { background-color: #FF9441 !important;}
.betterCon { background-color: #FFEC01 !important; }
.goodCon{ background-color: var(--accent-2) !important;}

.pingText {
    font-size: 10px;
    color: #FFF;
    text-align: center;
}
</style>