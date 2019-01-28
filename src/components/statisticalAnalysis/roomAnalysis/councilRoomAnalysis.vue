<template>
  <div class="roomAnalysis-wrapper">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
      <el-menu-item index="1" @click="activeIndex='1'">时间分布统计</el-menu-item>
      <el-menu-item index="2" @click="activeIndex='2'">容量分布统计</el-menu-item>
    </el-menu>
    <div class="roomAnalysis-content">
      <time-analysis v-if="activeIndex==='1'"></time-analysis>
      <capacity-analysis v-else-if="activeIndex==='2'"></capacity-analysis>
    </div>
  </div>
</template>

<script>
import timeAnalysis from "./timeAnalysis.vue";
import capacityAnalysis from "./capacityAnalysis.vue";

export default {
  components: {
    "time-analysis": timeAnalysis,
    "capacity-analysis": capacityAnalysis
  },
  data() {
    return {
      activeIndex: "1"
    };
  }
};
</script>

<style lang="scss" scoped>
.roomAnalysis-wrapper {
}
</style>