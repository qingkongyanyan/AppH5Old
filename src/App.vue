<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <!-- v-show="!$route.meta.keepAlive" -->
    <router-view  style="height:13.3rem;padding-bottom: 1rem;"></router-view>

    <!-- <keep-alive v-show="$route.meta.keepAlive">
      <router-view style="height:13.3rem;overflow: hidden;"></router-view>
    </keep-alive> -->

  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
}
</style>
