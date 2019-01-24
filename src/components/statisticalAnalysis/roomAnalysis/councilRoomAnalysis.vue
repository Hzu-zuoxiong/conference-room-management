<template>
  <div class="roomAnalysis-wrapper">
    <el-menu default-active="timeAnalysis" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="timeAnalysis">时间分布统计</el-menu-item>
      <el-menu-item index="capacityAnalysis">容量分布统计</el-menu-item>
    </el-menu>
    <div class="roomAnalysis-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.roomAnalysis-wrapper {
}
</style>