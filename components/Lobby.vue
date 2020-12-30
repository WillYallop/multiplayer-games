<template>
  <div class="lobbyWrapper">
      <div class="lobbyHeaderCon">
          <p class="lobbyHeaderP"><fa class="fas" :icon="['fa', 'users']"/> Lobby <span class="highlightTextP">1/8</span></p>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    components: {

    },
    methods: {

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
</style>
