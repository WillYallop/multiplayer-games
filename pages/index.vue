<template>
  <div class="pageCon">
    <SiteHeader/>
    <Sidebar/>
    <div class="gamesPreviewCon padHori padVert">

      <!-- Game Preview for -->
      <div class="gameCon" :key="game.name" v-for="game in gamesData"> 
        <div class="gameConInner">
          <div class="gameImg" :style="{ 'background-image' : `url(${game.image})` }">
            <div class="glass"></div>
          </div>
          <div class="gameInfoCon">
            <p class="gameTitleP">{{game.title}}</p>
            <div class="gamePlayersIconCon">
              <fa class="fas" :icon="['fa', 'users']"/>
              <p class="playersP">{{game.min_players}}-{{game.max_players}}</p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <SiteModal/>

  </div>
</template>

<script>
// Componenets
import SiteHeader from '@/components/GlobalComps/Header'
import Sidebar from '@/components/GlobalComps/Sidebar'
import SiteModal from '@/components/GlobalComps/SiteModal'

// Data
import games from '@/components/games.json'

export default {
  middleware: 'auth-logged-in',
  data() {
    return {
      gamesData: games

    }
  },
  components: {
    SiteHeader,
    Sidebar,
    SiteModal
  },
  methods: {

  }
}
</script>

<style scoped>
/* Game */
.gamesPreviewCon {
  display: flex;
  width: calc(100% + 20px);
  margin-left: -10px;
  margin-top: -10px;
}
.gameCon {
  width: 33.33% ;
  padding: 10px;
}
.gameConInner {
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}
.gameImg {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.glass {
  width: 160%;
  height: 200px;
  opacity: .1;
  background: #fff;
  position: absolute;
  top: -114px;
  left: -200px;
  z-index: 9;
  border-radius: 50%;
  transition: 0.2s;
}
.gameImg:hover .glass {
  height: 250px;
}
.gameInfoCon {
  background-color: var(--background-2);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
}
.gameTitleP {
  font-size: 16px;
  color: var(--text-1);
}
.gamePlayersIconCon {
  padding-left: 10px;
}
.gamePlayersIconCon .fas {
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
