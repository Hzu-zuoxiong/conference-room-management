<template>
  <div class="InfoSearch-wrapper">
    <div class="info-search">
      <slot></slot>
      <el-button type="primary" class="info-search-btn" @click="emitSearch">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    emitSearch() {
      this.$emit("InfoSearch");
    }
  }
};
</script>

<style lang="scss" scoped>
.InfoSearch-wrapper {
  .info-search {
    margin-top: 15px;
    .info-search-btn {
      margin-left: 5px;
    }
  }
}
</style>