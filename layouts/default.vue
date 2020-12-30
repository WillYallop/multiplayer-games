<template>
  <div>
    <Nuxt :class="{ 'lobbyActive' : lobbyStatus }"/>
  </div>
</template>

<script>
export default {
  computed: {
    lobbyStatus() {
      return this.$store.state.siteFunction.lobbyStatus
    }
  },
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap');

html {
  -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
  -webkit-tap-highlight-color: transparent !important;
  height: 100%;
}
body {
  margin: 0;
  font-family: 'Ubuntu', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  min-height: 100%;
  height: 100%;
  background-color: var(--background);
}

input {-webkit-appearance: none;}
textarea {font-family: 'Ubuntu', sans-serif;}
button:focus {outline: none;}
input:focus {outline: none;}
textarea:focus {outline: none;}
select:focus {outline: none;}
::selection {background-color: #FF4654; color: #FFF;}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

/* Variables */
:root {
  --background: #101823;
  --background-1: #090D14;
  --background-2: #1B293C;

  --border: #1B293C;

  --accent-1: #FF4654;
  --accent-1-hover: #E93C49;
  --accent-2: #1CD15C;

  --text-1: #FFF;
  --text-2: #C9D1D9;

}

/* Page */
.pageCon {
  padding: 60px 60px 0 0;
  transition: 0.2s;
}
.pageCon.lobbyActive {
  padding: 60px 410px 0 0;
}

/* Global */
.highlightTextP {color: var(--accent-1);}
.padHori {
  padding-left: 20px;
  padding-right: 20px;
}
.padVert {
  padding-top: 20px;
  padding-bottom: 20px;
}
.simplebar-scrollbar:before {
  background: #FFF;
}

/* Stylised Animated BTN */
.btnStylised {
  background-color: var(--accent-1);
  border: none;
  border-radius: 20px 2px 20px 2px;
  padding: 10px 60px 12px;
  color: #FFF;
  cursor: pointer;
  transition: 0.3s;
  position: relative;
  font-weight: bold;
  font-size: 16px;
  transition-property: border-radius;
}
.btnStylised:hover {
  border-radius: 2px 20px 2px 20px;
}
.underlineSpan {
  position: absolute;
  bottom: 6px;
  left: 6px;
  width: 20%;
  height: 2px;
  background-color: #FFF;
  transition: 0.3s;
}
.btnStylised:hover .underlineSpan {
  width: 80%;
  left: 12px;
}
</style>
