<template>
  <div class="visitorAnalysis-wrapper">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="activeIndex = '1'">访客行为统计</el-menu-item>
      <el-menu-item index="2" @click="activeIndex = '2'">访客考勤统计</el-menu-item>
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
      <behavior-analysis v-if="activeIndex === '1'" :visitorTime="visitorTime"></behavior-analysis>
      <attendance-analysis v-else-if="activeIndex === '2'" :visitorTime="visitorTime"></attendance-analysis>
    </div>
  </div>
</template>

<script>
import behaviorAnalysis from "./behaviorAnalysis.vue";
import attendanceAnalysis from "./attendanceAnalysis.vue";

export default {
  components: {
    "behavior-analysis": behaviorAnalysis,
    "attendance-analysis": attendanceAnalysis
  },
  data() {
    return {
      activeIndex: "1",
      visitorTime: "-1"
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