<template>
  <div class="visitorAnalysis-wrapper">
    <el-menu default-active="behaviorAnalysis" class="el-menu-demo" mode="horizontal" router>
      <el-menu-item index="behaviorAnalysis" :visitorTime="visitorTime">访客行为统计</el-menu-item>
      <el-menu-item index="attendanceAnalysis" :visitorTime="visitorTime">访客考勤统计</el-menu-item>
      <el-menu-item index="3" class="select">
        <el-select v-model="visitorTime" placeholder="选择查看时间">
          <el-option label="近7天" value="7"></el-option>
          <el-option label="近15天" value="15"></el-option>
          <el-option label="近30天" value="30"></el-option>
          <el-option label="全部" value="-1"></el-option>
        </el-select>
      </el-menu-item>
    </el-menu>
    <div class="visitorAnalysis-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visitorTime: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.visitorAnalysis-wrapper {
  position: relative;
  .select {
    position: absolute;
    right: 0;
    top: 0;
  }
}
</style>