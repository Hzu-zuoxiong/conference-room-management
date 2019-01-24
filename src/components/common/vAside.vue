<template>
  <div class="aside-wrapper">
    <div class="aside-menu">
      <el-menu
        class="el-menu-vertical"
        background-color="#393D49"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        :collapse="sideVisible"
        active-text-color="#ffd04b"
        unique-opened
        router
        collapse-transition
      >
        <el-menu-item index="IndexPage">
          <i class="el-icon-document"></i>
          <span slot="title">后台首页</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-view"></i>
            <span>访客管理</span>
          </template>
          <el-menu-item index="VisitorInfo">详细信息</el-menu-item>
          <el-menu-item index="VisitorAppointmentInfo">预约信息</el-menu-item>
          <el-menu-item index="AccessRecord">访问记录</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>会议室管理</span>
          </template>
          <el-menu-item index="councilRoomInfo">详细信息</el-menu-item>
          <el-menu-item index="councilRoomAppointmentInfo">预订信息</el-menu-item>
          <el-menu-item index="usedRecord">使用记录</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-picture"></i>
            <span>统计分析</span>
          </template>
          <el-menu-item index="councilRoomAnalysis">会议室统计分析</el-menu-item>
          <el-menu-item index="visitorActionAnalysis">访客行为分析</el-menu-item>
        </el-submenu>
        <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-view"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item index="userInfo">详细信息</el-menu-item>
        </el-submenu>
        <el-submenu index="6">
          <template slot="title">
            <i class="el-icon-setting"></i>
            <span>系统设置</span>
          </template>
          <el-menu-item index="systemLog">操作日志</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sideVisible: true
    };
  },
  mounted() {
    this.$bus.$on("sideVisible", () => {
      this.sideVisible = !this.sideVisible;
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style lang="scss" scoped>
.aside-wrapper {
  position: fixed;
  top: 60px;
  bottom: 0;
  height: 100%;
  background: #393d49;
  box-sizing: border-box;
  .aside-menu {
    height: 100%;
  }
  .el-menu-vertical {
    border: none;
  }
}
</style>