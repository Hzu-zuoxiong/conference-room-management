<template>
  <div class="accessRecord-wrapper">
    <!-- 搜索 -->
    <InfoSearch @InfoSearch="useRecordSearch" class="useRecord-search search-item">
      <el-input placeholder="请输入访客姓名" v-model="visitorName" class="el-input visitorName">
        <template slot="prepend">姓名</template>
      </el-input>
      <div class="appointPurpose search-item">
        <span class="appointPurposeLabel label">预约用途</span>
        <el-select v-model="Purpose" placeholder="请选择" class="select">
          <el-option
            v-for="appoint in appointPurpose"
            :key="appoint.tagId"
            :label="appoint.tagName"
            :value="appoint.tagId"
          ></el-option>
        </el-select>
      </div>
      <div class="useRecordTime search-item">
        <span class="useRecordTimeLabel label">时间段</span>
        <el-date-picker
          v-model="useRecordTime"
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
    <div class="useRecord-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="useRecord-result">
        <el-table :data="userRecords" stripe>
          <el-table-column prop="guestName" label="姓名" header-align="center" align="center"></el-table-column>
          <el-table-column prop="tagName" label="用途" header-align="center" align="center"></el-table-column>
          <el-table-column prop="roomName" label="会议室名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="roomPeople" label="容纳人数" header-align="center" align="center"></el-table-column>
          <el-table-column prop="roomArea" label="占地面积/㎡" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="visitArriveTime"
            label="开始时间"
            width="300px;"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="visitLeaveTime"
            label="结束时间"
            header-align="center"
            width="150px"
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
import { dateFormate } from "@/utils";

export default {
  components: {
    InfoSearch
  },
  data() {
    return {
      visitorName: "",
      appointPurpose: {},
      userRecords: [],
      recordNum: 0,
      Purpose: "",
      useRecordTime: "",
      beginTime: "",
      endTime: ""
    };
  },
  mixins: [Fetch],
  created() {
    this.pageSize = 8;
    this.pageCount = 5;
    // 获取预约用途下拉框数据
    this.$_fetch_appointPurpose().then(res => {
      this.appointPurpose = res.roomTagList;
    });
    // 获取页面初始化数据
    this.$_fetch_visitorUsedRecordInfo().then(res => {
      this.userRecords = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
      this.$_formateData(this.userRecords);
    });
  },
  mounted() {},
  computed: {},
  methods: {
    // 格式化时间
    $_formateData(useRecordTime) {
      if (!useRecordTime) return;
      for (let item of useRecordTime) {
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
    // 导出excel
    exportExcel() {
      this.$_fetch_visitorUsedRecordInfo({
        pageNum: -1,
        guestName: this.visitorName,
        tagId: this.Purpose,
        visitArriveTime: this.beginTime,
        visitLeaveTime: this.endTime
      }).then(res => {
        let excelData = res.pageBean.dataList;
        this.$_formateData(excelData);
        let fileName = "accessRecord";
        let headers =
          "姓名,用途,会议室名称,容纳人数,占地面积/㎡,开始时间,结束时间,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["姓名"] = excelData[i].guestName;
          temp["用途"] = excelData[i].tagName;
          temp["会议室名称"] = excelData[i].roomName;
          temp["容纳人数"] = excelData[i].roomPeople;
          temp["占地面积/㎡"] = excelData[i].roomArea;
          temp["开始时间"] = excelData[i].visitArriveTime;
          temp["结束时间"] = excelData[i].visitLeaveTime;
          json.push(temp);
        }
        json = JSON.stringify(json);
        this.$_fetch_exportExcel({ fileName, headers, json });
      });
    },
    // 条件查询
    useRecordSearch() {
      this.$_fetch_visitorUsedRecordInfo({
        guestName: this.visitorName,
        tagId: this.Purpose,
        visitArriveTime: this.beginTime,
        visitLeaveTime: this.endTime
      }).then(res => {
        this.userRecords = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.$_formateData(this.userRecords);
      });
    },
    // 分页
    currentChange(num) {
      this.$_fetch_visitorUsedRecordInfo({
        pageNum: num,
        guestName: this.visitorName,
        tagId: this.Purpose,
        visitArriveTime: this.beginTime,
        visitLeaveTime: this.endTime
      }).then(res => {
        this.userRecords = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.$_formateData(this.userRecords);
      });
    }
  },
  watch: {
    useRecordTime() {
      this.beginTime = dateFormate(
        this.useRecordTime[0].getTime(),
        "yyyy-MM-dd"
      );
      this.endTime = dateFormate(this.useRecordTime[1].getTime(), "yyyy-MM-dd");
    }
  }
};
</script>

<style lang="scss" scoped>
.accessRecord-wrapper {
  .useRecord-search {
    .search-item {
      margin-top: 5px;
    }
    .visitorName {
      width: 250px;
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
    .appointPurpose {
      display: inline-block;
      height: 40px;
      margin-left: 5px;
    }
    .useRecordTime {
      display: inline-block;
      height: 40px;
      margin-left: 5px;
      /deep/ .el-input__inner {
        width: 380px;
      }
    }
  }
  .useRecord-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .useRecord-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>