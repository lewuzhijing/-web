<template>
  <div id="app">
<!--      <el-button>这是一个element按钮</el-button>-->
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import IndexPage from './components/Index.vue'


export default {
  name: 'App',
  components: {},
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('CurUser')),
    }

  },
  watch:{
    '$store.state.menu':{
      handler(val,old){
        if(!old && this.user && this.user.no){
          this.$store.commit("setMenu",val)
        }

      },
      immediate:true
    }
  }
}
</script>

<style>
#app {
    height: 100%;
}
</style>
