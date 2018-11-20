<template>
  <div>
    <h1>basePage</h1>
    <router-view></router-view>
  </div>
</template>
<script>
import Tabbar from './tabbar'

export default {
  name: 'basePage',
  components: {
    Tabbar
  },
  data() {
    return {
      msg: 123
    }
  },
  mounted() {
    console.log('input basePage');
  }
}

</script>
