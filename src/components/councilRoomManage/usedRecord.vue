<template>
  <div class="roomUsedRecord-wrapper">
    <!-- 搜索 -->
    <InfoSearch @InfoSearch="roomUsedRecordSearch" class="info-search">
      <el-input placeholder="请输入会议室名称" v-model="councilRoomName" class="search-item">
        <template slot="prepend">会议室名称</template>
      </el-input>
      <el-input placeholder="请输入最少容纳人数" v-model="administrator" class="search-item">
        <template slot="prepend">管理员</template>
      </el-input>
      <div class="roomUsedTime search-item">
        <span class="label">时间段</span>
        <el-date-picker
          v-model="roomUsedTime"
          type="daterange"
          align="right"
          unlink-panels
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </InfoSearch>
    <!-- 表格 -->
    <div class="roomUsedRecord-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="roomUsedRecord-result">
        <el-table :data="usedRecordInfo" stripe>
          <el-table-column prop="roomName" label="会议室名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="administrator" label="管理员" header-align="center" align="center"></el-table-column>
          <el-table-column prop="adminContact" label="管理员联系方式" header-align="center" align="center"></el-table-column>
          <el-table-column prop="visitArriveTime" label="开始时间" header-align="center" align="center"></el-table-column>
          <el-table-column prop="visitLeaveTime" label="结束时间" header-align="center" align="center"></el-table-column>
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
import { $_splitField, dateFormate } from "@/utils";

export default {
  components: {
    InfoSearch
  },
  props: {},
  mixins: [Fetch],
  data() {
    return {
      councilRoomName: "",
      administrator: "",
      roomUsedTime: "",
      usedBeginTime: "",
      usedEndTime: "",
      usedRecordInfo: [],
      recordNum: 0
    };
  },
  created() {
    this.pageSize = 8;
    this.pageCount = 5;
    // 页面初始化信息
    this.$_fetch_roomUsedRecordInfo().then(res => {
      this.usedRecordInfo = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
      $_splitField(this.usedRecordInfo);
      this.$_formateTime(this.usedRecordInfo);
    });
  },
  mounted() {},
  computed: {},
  methods: {
    // 格式化时间
    $_formateTime(usedInfo) {
      if (!usedInfo) return;
      for (let item of usedInfo) {
        // 修改时间
        item.visitArriveTime = dateFormate(
          item.visitArriveTime,
          "yyyy-MM-dd hh:mm:ss"
        );
        item.visitLeaveTime = dateFormate(
          item.visitLeaveTime,
          "yyyy-MM-dd hh:mm:ss"
        );
      }
    },
    // 条件查询
    roomUsedRecordSearch() {
      this.$_fetch_roomUsedRecordInfo({
        roomName: this.councilRoomName,
        roomManager: this.administrator,
        visitArriveTime: this.usedBeginTime,
        visitLeaveTime: this.usedEndTime
      }).then(res => {
        this.usedRecordInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.usedRecordInfo);
        this.$_formateTime(this.usedRecordInfo);
      });
    },
    // excel导出
    exportExcel() {
      this.$_fetch_roomUsedRecordInfo({
        roomName: this.councilRoomName,
        roomManager: this.administrator,
        visitArriveTime: this.usedBeginTime,
        visitLeaveTime: this.usedEndTime
      }).then(res => {
        let excelData = res.pageBean.dataList;
        this.$_formateTime(excelData);
        let fileName = "hysUsedRecordInfo";
        let headers = "姓名,管理员,管理员联系方式,开始时间,结束时间,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["姓名"] = excelData[i].roomName;
          temp["管理员"] = excelData[i].administrator;
          temp["管理员联系方式"] = excelData[i].adminContact;
          temp["开始时间"] = excelData[i].visitArriveTime;
          temp["结束时间"] = excelData[i].visitLeaveTime;
          json.push(temp);
        }
        json = JSON.stringify(json);
        this.$_fetch_exportExcel({ fileName, headers, json });
      });
    },
    // 分页
    currentChange(num) {
      this.$_fetch_roomUsedRecordInfo({
        pageNum: num,
        roomName: this.councilRoomName,
        roomManager: this.administrator,
        visitArriveTime: this.usedBeginTime,
        visitLeaveTime: this.usedEndTime
      }).then(res => {
        this.usedRecordInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.usedRecordInfo);
        this.$_formateTime(this.usedRecordInfo);
      });
    }
  },
  watch: {
    roomUsedTime() {
      this.usedBeginTime = dateFormate(
        this.roomUsedTime[0].getTime(),
        "yyyy-MM-dd"
      );
      this.usedEndTime = dateFormate(
        this.roomUsedTime[1].getTime(),
        "yyyy-MM-dd"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.roomUsedRecord-wrapper {
  .info-search {
    .search-item {
      margin-top: 5px;
      margin-left: 5px;
      width: 300px;
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
    .roomUsedTime {
      display: inline-block;
      height: 40px;
      width: 480px;
      margin-left: 5px;
      /deep/ .el-input__inner {
        width: 380px;
      }
    }
  }
  .roomUsedRecord-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .roomUsedRecord-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>