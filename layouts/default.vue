<template>
  <div>
    <Nuxt />
  </div>
</template>

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

/* Global */
.highlightTextP {color: var(--accent-1);}

.simplebar-scrollbar:before {
  background: #FFF;
}
</style>
