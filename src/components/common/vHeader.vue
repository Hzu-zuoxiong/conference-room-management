<template>
  <div class="header-wrapper clearfix">
    <el-menu
      class="el-menu"
      mode="horizontal"
      @select="handleSelect"
      background-color="#23262E"
      text-color="#fff"
      active-text-color="#fff"
    >
      <a href="javascript:;" @click="toggleSide">
        <img src="~images/nav.png" alt="导航logo">
      </a>
      <h1 class="title">掌上智能访客及会议室管理系统</h1>
      <el-submenu index="2" class="right">
        <template slot="title">系统管理员</template>
        <el-menu-item index="2-1">修改密码</el-menu-item>
        <el-menu-item index="2-2">退出登陆</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "vHeader",
  data() {
    return {};
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    // 显示隐藏侧边栏
    toggleSide() {
      this.$bus.$emit("sideVisible");
    }
  }
};
</script>

<style lang="scss" scoped>
.clearfix {
  clear: both;
}
.header-wrapper {
  width: 100%;
  height: 60px;
  font-size: 16px;
  .el-menu {
    border: none;
    img {
      float: left;
      width: 30px;
      margin-top: 15px;
      margin-left: 15px;
      cursor: pointer;
    }
    .title {
      display: inline-block;
      float: left;
      margin: 0;
      margin-left: 25px;
      font-weight: 500;
      font-size: 18px;
      line-height: 60px;
      color: #c2c2c2;
      cursor: pointer;
    }
    .right {
      float: right;
      margin-right: 30px;
    }
  }
}
</style>