<template>
  <div class="index-wrapper">
    <v-header class="index-header"></v-header>
    <div class="content-wrapper">
      <v-aside class="content-aside"></v-aside>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "comm/vHeader";
import vAside from "comm/vAside";

export default {
  name: "index",
  components: {
    vHeader,
    vAside
  },
  props: {},
  data() {
    return {
      num: 0
    };
  },
  created() {},
  mounted() {
    this.$bus.$on("sideVisible", () => {
      this.num++;
      let aside = document.querySelectorAll(".content-aside")[0];
      let content = document.querySelectorAll(".content")[0];
      if (this.num % 2) {
        aside.style.width = 200 + "px";
        content.style.marginLeft = 200 + "px";
      } else {
        aside.style.width = 65 + "px";
        content.style.marginLeft = 65 + "px";
      }
    });
  },
  computed: {},
  methods: {},
  watch: {}
};
</script>

<style lang="scss" scoped>
.index-wrapper {
  position: relative;
  height: 100%;
  .index-header {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
  }
  .content-wrapper {
    margin-top: 60px;
    height: 100%;
    .content-aside {
      width: 65px;
      transition: all 0.5s;
    }
    .content {
      margin-left: 65px;
      padding: 10px;
      transition: all 0.5s;
    }
  }
}
</style>