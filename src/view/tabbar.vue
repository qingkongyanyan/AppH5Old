<template>
  <div class="tab-bar">
    <a href="javascript:;"
      ref="subTabbar"
      id="subTabbar"
      class="tabbar-item"
      v-for="(item,i) in tabbarData"
      :key="i"
      :class="i===index?'tabbar-active':''"
      @click="clickTab(i,item.path)"
    >
      <p class="secoo-tabbar-label">
        <!-- 显示 label -->
        <span>{{item.label}}</span>
      </p>
    </a>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        tabbarData:[
          {
            label:'首页',
            path:'home',
            class:''
          },
          {
            label:'业务',
            path:'businessList',
            class:''
          },
          {
            label:'我的',
            path:'mine',
            class:''
          }
        ]
      }
    },
    computed:{
      index(){
        switch(this.$route.name){
          case 'Home':
            return 0;
          case 'businessList':
            return 1;
          case 'Mine':
            return 2;
        }
      }
    },
    mounted(){
      console.log('进入 tabbar');
    },
    methods:{
      // 点击 tabItem
      clickTab(i,path){
        console.log(i,path);
        this.$router.push(path);
      }
    }
  }
</script>