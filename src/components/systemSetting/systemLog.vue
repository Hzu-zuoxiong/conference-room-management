<template>
  <div class="systemLog-wrapper">
    <InfoSearch @InfoSearch="systemLogSearch" class="info-search">
      <el-input placeholder="请输入用户名" v-model="adminId" class="search-item">
        <template slot="prepend">用户名</template>
      </el-input>
      <div class="systemLog search-item">
        <span class="systemLog label">操作类型</span>
        <el-select v-model="purpose" placeholder="请选择" class="select">
          <el-option label="请选择操作类型" value></el-option>
          <el-option label="更新" value="更新"></el-option>
          <el-option label="删除" value="删除"></el-option>
          <el-option label="导出excel" value="导出excel"></el-option>
        </el-select>
      </div>
      <div class="systemLogTime search-item">
        <span class="label">操作时间</span>
        <el-date-picker
          v-model="systemLogTime"
          value-format="yyyy-MM-dd"
          type="date"
          placeholder="选择日期"
        ></el-date-picker>
      </div>
    </InfoSearch>

    <!-- 表格 -->
    <div class="systemLog-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="systemLog-result">
        <el-table :data="sytemLogInfo" stripe>
          <el-table-column prop="adminId" label="用户名" header-align="center" align="center"></el-table-column>
          <el-table-column prop="operateTime" label="操作时间" header-align="center" align="center"></el-table-column>
          <el-table-column prop="operateIp" label="IP" header-align="center" align="center"></el-table-column>
          <el-table-column prop="operateKind" label="操作类型" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="operateState"
            width="450"
            label="说明"
            header-align="center"
            align="center"
          ></el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :pager-count="pageCount"
            @current-change="currentChange"
            :total="recordNum"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InfoSearch from "comm/InfoSearch.vue";
import Fetch from "mixins/fetch";
import { dateFormate, Excelpost } from "@/utils";

export default {
  components: {
    InfoSearch
  },
  props: {},
  mixins: [Fetch],
  data() {
    return {
      adminId: "",
      purpose: "",
      systemLogTime: "",
      sytemLogInfo: [],
      recordNum: 0
    };
  },
  created() {
    this.pageSize = 8;
    this.pageCount = 5;
    // 页面初始化数据
    this.$_fetch_systemLogInfo().then(res => {
      this.sytemLogInfo = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
      this.$_formateData(this.sytemLogInfo);
    });
  },
  mounted() {},
  computed: {},
  methods: {
    // 格式化时间
    $_formateData(sytemLogInfo) {
      if (!sytemLogInfo) return;
      for (let item of sytemLogInfo) {
        // 修改时间
        item.operateTime = dateFormate(item.operateTime, "yyyy-MM-dd hh:mm:ss");
      }
    },
    // 条件查询
    systemLogSearch() {
      this.$_fetch_systemLogInfo({
        adminId: this.adminId,
        operateKind: this.purpose,
        beginTime: this.systemLogTime
      }).then(res => {
        this.sytemLogInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.$_formateData(this.sytemLogInfo);
      });
    },
    // 导出excel
    exportExcel() {
      this.$_fetch_systemLogInfo({
        pageNum: -1,
        adminId: this.adminId,
        operateKind: this.purpose,
        beginTime: this.systemLogTime
      }).then(res => {
        let excelData = res.pageBean.dataList;
        this.$_formateData(excelData);
        let fileName = "systemLog";
        let headers = "用户名,操作时间,IP,操作类型,说明,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["用户名"] = excelData[i].adminId;
          temp["操作时间"] = excelData[i].operateTime;
          temp["IP"] = excelData[i].operateIp;
          temp["操作类型"] = excelData[i].operateKind;
          temp["说明"] = excelData[i].operateState;
          json.push(temp);
        }
        json = JSON.stringify(json);
        Excelpost({ fileName, headers, json });
      });
    },
    // 分页
    currentChange(num) {
      this.$_fetch_systemLogInfo({
        pageNum: num,
        adminId: this.adminId,
        operateKind: this.purpose,
        beginTime: this.systemLogTime
      }).then(res => {
        this.sytemLogInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.$_formateData(this.sytemLogInfo);
      });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.systemLog-wrapper {
  .info-search {
    .search-item {
      margin-top: 5px;
      margin-left: 5px;
      width: 300px;
    }
    .systemLog {
      display: inline-block;
      width: 280px;
    }
    .label {
      display: inline-block;
      width: 80px;
      height: 40px;
      line-height: 39px;
      text-align: center;
      border: 1px solid #dcdfe6;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-right: none;
      background: #f5f7fa;
      color: #909399;
    }
    /deep/ .el-input__inner {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .systemLogTime {
      display: inline-block;
      height: 40px;
      margin-left: 5px;
    }
  }
  .systemLog-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .systemLog-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>