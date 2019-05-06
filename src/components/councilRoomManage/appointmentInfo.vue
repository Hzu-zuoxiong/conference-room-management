<template>
  <div class="roomAppoint-wrapper">
    <!-- 搜索 -->
    <InfoSearch @InfoSearch="roomAppointSearch" class="roomAppoint-search">
      <el-input placeholder="请输入会议室名称" v-model="councilRoomName" class="search-item">
        <template slot="prepend">会议室名称</template>
      </el-input>
      <el-input placeholder="请输入预约访客姓名" v-model="visitorName" class="search-item">
        <template slot="prepend">预约者</template>
      </el-input>
      <div class="roomAppointTime search-item">
        <span class="label">时间段</span>
        <el-date-picker
          v-model="roomAppointTime"
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
    <div class="roomAppoint-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="roomAppoint-result">
        <el-table :data="roomAppointInfo" stripe>
          <el-table-column prop="room.roomName" label="会议室名称" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="appointUse"
            label="预约时间"
            header-align="center"
            width="300"
            align="center"
          ></el-table-column>
          <el-table-column prop="guestName" label="预约者" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="guestTelephone"
            label="预约者联系方式"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="administrator" label="管理员" header-align="center" align="center"></el-table-column>
          <el-table-column prop="adminContact" label="管理员联系方式" header-align="center" align="center"></el-table-column>
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
import { $_splitField, dateFormate, Excelpost } from "@/utils";

export default {
  components: {
    InfoSearch
  },
  data() {
    return {
      roomAppointInfo: [],
      recordNum: 0,
      councilRoomName: "",
      visitorName: "",
      roomAppointTime: "",
      useRoomBeginTime: "", // 查询条件
      useRoomEndTime: ""
    };
  },
  mixins: [Fetch],
  created() {
    this.pageSize = 8;
    this.pageCount = 5;
    // 获取页面初始数据
    if (this.$route.params.roomId) {
      this.$_fetch_roomAppointmentInfo({
        "room.roomId": this.$route.params.roomId
      }).then(res => {
        this.roomAppointInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.roomAppointInfo);
        this.$_formateTime(this.roomAppointInfo);
      });
    } else {
      this.$_fetch_roomAppointmentInfo().then(res => {
        this.roomAppointInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.roomAppointInfo);
        this.$_formateTime(this.roomAppointInfo);
      });
    }
  },
  methods: {
    // 格式化时间
    $_formateTime(appiontInfo) {
      if (!appiontInfo) return;
      for (let item of appiontInfo) {
        // 修改时间
        item.appointStart = dateFormate(
          item.appointStart,
          "yyyy-MM-dd hh:mm:ss"
        );
        item.appointEnd = dateFormate(item.appointEnd, "yyyy-MM-dd hh:mm:ss");
        item.appointUse = item.appointStart + "----" + item.appointEnd;
      }
    },
    // 分页
    currentChange(num) {
      const {
        visitorName,
        councilRoomName,
        useRoomBeginTime,
        useRoomEndTime
      } = this;
      this.$_fetch_roomAppointmentInfo({
        guestName: visitorName,
        "room.roomName": councilRoomName,
        useRoomBeginTime: useRoomBeginTime,
        useRoomEndTime: useRoomEndTime,
        pageNum: num
      }).then(res => {
        this.roomAppointInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.roomAppointInfo);
        this.$_formateTime(this.roomAppointInfo);
      });
    },
    // 条件查询
    roomAppointSearch() {
      const {
        visitorName,
        councilRoomName,
        useRoomBeginTime,
        useRoomEndTime
      } = this;
      this.$_fetch_roomAppointmentInfo({
        guestName: visitorName,
        "room.roomName": councilRoomName,
        useRoomBeginTime: useRoomBeginTime,
        useRoomEndTime: useRoomEndTime
      }).then(res => {
        this.roomAppointInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.roomAppointInfo);
        this.$_formateTime(this.roomAppointInfo);
      });
    },
    exportExcel() {
      const {
        visitorName,
        councilRoomName,
        useRoomBeginTime,
        useRoomEndTime
      } = this;
      this.$_fetch_roomAppointmentInfo({
        pageNum: -1,
        guestName: visitorName,
        "room.roomName": councilRoomName,
        useRoomBeginTime: useRoomBeginTime,
        useRoomEndTime: useRoomEndTime
      }).then(res => {
        let excelData = res.pageBean.dataList;
        $_splitField(excelData);
        let fileName = "hysAppointInfo";
        let headers =
          "会议室名称,预约时间,预约者,预约者联系方式,管理员,管理员联系方式,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["会议室名称"] = excelData[i].room.roomName;
          temp["预约时间"] = excelData[i].appointUse;
          temp["预约者"] = excelData[i].room.guestName;
          temp["预约者联系方式"] = excelData[i].guestTelephone;
          temp["管理员"] = excelData[i].administrator;
          temp["管理员联系方式"] = excelData[i].adminContact;
          json.push(temp);
        }
        json = JSON.stringify(json);
        Excelpost({ fileName, headers, json });
      });
    }
  },
  watch: {
    roomAppointTime() {
      this.useRoomBeginTime = dateFormate(
        this.roomAppointTime[0].getTime(),
        "yyyy-MM-dd"
      );
      this.useRoomEndTime = dateFormate(
        this.roomAppointTime[1].getTime(),
        "yyyy-MM-dd"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.roomAppoint-wrapper {
  .roomAppoint-search {
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
    .roomAppointTime {
      display: inline-block;
      height: 40px;
      width: 480px;
      margin-left: 5px;
      /deep/ .el-input__inner {
        width: 380px;
      }
    }
  }
  .roomAppoint-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .roomAppoint-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>