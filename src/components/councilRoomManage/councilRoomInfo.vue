<template>
  <div class="councilRoomInfo-wrapper">
    <!-- 搜索 -->
    <InfoSearch @InfoSearch="councilRoomSearch" class="info-search">
      <el-input placeholder="请输入会议室名称" v-model="councilRoomName" class="search-item">
        <template slot="prepend">会议室名称</template>
      </el-input>
      <el-input placeholder="请输入最少容纳人数" v-model="containPopulation" class="search-item">
        <template slot="prepend">最少容纳人数</template>
      </el-input>
      <el-input placeholder="请输入会议室管理员" v-model="councilRoomAdministrator" class="search-item">
        <template slot="prepend">管理员</template>
      </el-input>
    </InfoSearch>

    <!-- 表格 -->
    <div class="councilRoomInfo-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="councilRoomInfo-result">
        <el-table
          :data="councilRoomInfo"
          stripe
          :cell-style="roomNameCellStyle"
          @row-click="jumpToAppointmentInfo"
        >
          <el-table-column prop="roomName" label="会议室名称" header-align="center" align="center"></el-table-column>
          <el-table-column prop="roomPeople" label="容纳人数" header-align="center" align="center"></el-table-column>
          <el-table-column prop="roomArea" label="占地面积/㎡" header-align="center" align="center"></el-table-column>
          <el-table-column prop="administrator" label="管理员" header-align="center" align="center"></el-table-column>
          <el-table-column prop="adminContact" label="管理员联系方式" header-align="center" align="center"></el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" round @click="handleDelete(scope.$index)">删除</el-button>
              <el-button type="primary" size="mini" round @click="handleEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
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

    <!-- 修改弹框 -->
    <div class="dialog" v-show="visible">
      <div class="updateForm">
        <div class="closeX" @click="closeX">×</div>
        <el-form
          class="changeForm"
          :label-position="labelPosition"
          label-width="90px"
          :model="councilRoomInfo[0]"
        >
          <el-form-item label="会议室名称">
            <el-input v-model="singleRoom.roomName" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="容纳人数">
            <el-input v-model="singleRoom.roomPeople"></el-input>
          </el-form-item>
          <el-form-item label="占地面积/㎡">
            <el-input v-model="singleRoom.roomArea"></el-input>
          </el-form-item>
          <el-form-item label="管理员">
            <el-input v-model="singleRoom.administrator"></el-input>
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input v-model="singleRoom.adminContact"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="changeBtn" @click="changeCouncilRoom">立即修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import InfoSearch from "comm/InfoSearch.vue";
import Fetch from "mixins/fetch";
import { $_splitField } from "@/utils";

export default {
  components: {
    InfoSearch
  },
  data() {
    return {
      councilRoomInfo: [],
      recordNum: 0,
      councilRoomName: "",
      containPopulation: "",
      councilRoomAdministrator: "",
      visible: false,
      singleRoom: {}
    };
  },
  mixins: [Fetch],
  created() {
    this.labelPosition = "left";
    this.pageSize = 8;
    this.pageCount = 5;
    // 获取页面初始数据
    this.$_fetch_councilRoomInfo().then(res => {
      this.councilRoomInfo = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
      $_splitField(this.councilRoomInfo);
    });
  },
  methods: {
    // 修改表格第一列样式
    roomNameCellStyle({ columnIndex }) {
      let textCenter = "text-align: center;";
      if (columnIndex === 0) {
        return textCenter + "color: blue; cursor:pointer;";
      }
      return textCenter;
    },
    // 跳转到对应访客预约信息
    jumpToAppointmentInfo(row, event, column) {
      if(column.label === '会议室名称') {
        this.$router.push({
          name: "councilRoomAppointmentInfo",
          params: { roomId: row.roomId }
        });
      }
    },
    // 条件查询
    councilRoomSearch() {
      this.$_fetch_councilRoomInfo({
        roomName: this.councilRoomName,
        roomPeople: this.containPopulation,
        roomManager: this.councilRoomAdministrator
      }).then(res => {
        this.councilRoomInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.councilRoomInfo);
      });
    },
    // 导出excel
    exportExcel() {
      this.$_fetch_councilRoomInfo({
        pageNum: -1,
        roomName: this.councilRoomName,
        roomPeople: this.containPopulation,
        roomManager: this.councilRoomAdministrator
      }).then(res => {
        let excelData = res.pageBean.dataList;
        $_splitField(excelData);
        let fileName = "councilRoomInfo";
        let headers = "会议室名称,容纳人数,占地面积/㎡,管理员,管理员联系方式,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["会议室名称"] = excelData[i].roomName;
          temp["容纳人数"] = excelData[i].roomPeople;
          temp["占地面积/㎡"] = excelData[i].roomArea;
          temp["管理员"] = excelData[i].administrator;
          temp["管理员联系方式"] = excelData[i].adminContact;
          json.push(temp);
        }
        json = JSON.stringify(json);
        this.$_fetch_exportExcel({ fileName, headers, json });
      });
    },
    // 分页
    currentChange(num) {
      this.$_fetch_councilRoomInfo({
        pageNum: num,
        roomName: this.councilRoomName,
        roomPeople: this.containPopulation,
        roomManager: this.councilRoomAdministrator
      }).then(res => {
        this.councilRoomInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        $_splitField(this.councilRoomInfo);
      });
    },
    // 删除会议室信息
    handleDelete(index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return this.$_fetch_deleteCouncilRoom({
            roomId: this.councilRoomInfo[index].roomId
          });
        })
        .then(res => {
          if (res.status === 1) {
            this.councilRoomInfo.splice(index, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 弹出修改框
    handleEdit(councilRoom) {
      this.visible = true;
      this.singleRoom = councilRoom;
    },
    // 修改会议室信息
    changeCouncilRoom() {
      this.$_fetch_updateCouncilRoom({
        roomId: this.singleRoom.roomId,
        roomPassword: this.singleRoom.roomPassword,
        roomName: this.singleRoom.roomName,
        roomAddress: this.singleRoom.roomAddress,
        roomArea: this.singleRoom.roomArea,
        roomPeople: this.singleRoom.roomPeople,
        roomManager:
          this.singleRoom.administrator + "#" + this.singleRoom.adminContact
      }).then(() => {
        this.visible = false;
      });
    },
    // 关闭修改弹窗
    closeX() {
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.councilRoomInfo-wrapper {
  position: relative;
  .info-search {
    .search-item {
      margin-top: 5px;
      margin-left: 5px;
      width: 300px;
    }
  }
  .councilRoomInfo-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .councilRoomInfo-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.7);
    .updateForm {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 450px;
      margin-left: -250px;
      margin-top: -225px;
      background-color: #eee;
      border: 1px solid #333;
      .closeX {
        position: absolute;
        top: 15px;
        right: 20px;
        width: 30px;
        height: 30px;
        text-align: center;
        font-size: 38px;
        color: #f56c6c;
        cursor: pointer;
      }
      .changeForm {
        margin: 60px 50px 50px;
        .changeBtn {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>