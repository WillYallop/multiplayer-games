<template>
    <div class="modalCon" v-if="modalStatus">
        <Simplebar class="modalOverflow" data-simplebar-auto-hide="true" >
            <div class="modalWrapper">

                <div class="modalContent">
                    <component v-bind:is="currentComp"/>
                </div>

                <div class="modalBackground" v-on:click="$store.commit('toggleModal')"></div>
            </div>
        </Simplebar>
    </div>
</template>

<script>
// Components
import Simplebar from 'simplebar-vue'
import FriendActions from '@/components/ModalComps/FriendActions'

export default {
    data() {
        return {

        }
    },
    components: {
        Simplebar,
        FriendActions
    },
    computed: {
        modalStatus() {
            return this.$store.state.siteFunction.modalInfo.status
        },
        currentComp() {
            return this.$store.state.siteFunction.modalInfo.component
        }
    },
    methods: {

    }
}
</script>

<style scoped>
.modalCon {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(38, 47, 58, 0.8);
    z-index: 1200;
}
.modalOverflow {
    height: 100%;
}
.modalWrapper {
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.modalBackground {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 10;
    cursor: pointer;
}
/* COntent */
.modalContent {
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    z-index: 20;
    position: relative;
}
</style>

<style>
.modalOverflow .simplebar-content {
    height: 100%;
}
</style>