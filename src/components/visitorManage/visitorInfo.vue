<template>
  <div class="visitorInfo-wrapper">
    <!-- 搜索 -->
    <InfoSearch @InfoSearch="visitorInfoSearch" class="info-search">
      <el-input
        placeholder="请输入访客姓名"
        v-model="visitorName"
        id="visitorName"
        class="search-item visitorName"
      >
        <template slot="prepend">姓名</template>
      </el-input>
      <el-input
        placeholder="请输入访客信誉分"
        v-model="visitorCredit"
        id="visitorCredit"
        class="search-item visitorCredit"
      >
        <template slot="prepend">信誉分</template>
      </el-input>
    </InfoSearch>

    <div class="info-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="info-result">
        <el-table
          :data="visiInfo"
          stripe
          :cell-style="guestNameCellStyle"
          @row-click="jumpToAppointmentInfo">
          <el-table-column prop="guestName" label="姓名" header-align="center"></el-table-column>
          <el-table-column prop="guestCredit" label="身份证" header-align="center"></el-table-column>
          <el-table-column prop="guestTelephone" label="联系方式" header-align="center"></el-table-column>
          <el-table-column prop="guestEmail" label="邮箱" header-align="center"></el-table-column>
          <el-table-column prop="guestCompany" label="单位" header-align="center"></el-table-column>
          <el-table-column prop="guestCredit" label="信誉分" header-align="center"></el-table-column>
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

export default {
  components: {
    InfoSearch
  },
  data() {
    return {
      recordNum: 0,
      visitorName: "",
      visitorCredit: "",
      visiInfo: []
    };
  },
  mixins: [Fetch],
  created() {
    this.pageSize = 8; // 分页数据条数
    this.pageCount = 5; // 显示分页数

    // 页面初始数据
    this.$_fetch_visitorInfo().then(res => {
      this.visiInfo = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
    });
  },
  methods: {
    // 修改表格第一列样式
    guestNameCellStyle({ columnIndex }) {
      let textCenter = "text-align: center;";
      if (columnIndex === 0) {
        return textCenter + "color: blue; cursor:pointer;";
      }
      return textCenter;
    },
    // 跳转到对应访客预约信息
    jumpToAppointmentInfo(row, event, column) {
      if(column.label === '姓名') {
        this.$router.push({
          name: "VisitorAppointmentInfo",
          params: { guestId: row.guestId }
        });
      }
    },
    // 导出excel
    exportExcel() {
      this.$_fetch_visitorInfo({
        pageNum: -1,
        guestName: this.visitorName,
        guestCredit: this.visitorCredit
      }).then(res => {
        let excelData = res.pageBean.dataList;
        let fileName = "visitInfo";
        let headers = "姓名,身份证,联系方式,邮箱,单位,信誉分,";
        let json = [];
        for (let i in excelData) {
          let temp = {};
          temp["姓名"] = excelData[i].guestName;
          temp["身份证"] = excelData[i].guestId;
          temp["联系方式"] = excelData[i].guestTelephone;
          temp["邮箱"] = excelData[i].guestEmail;
          temp["单位"] = excelData[i].guestCompany;
          temp["信誉分"] = excelData[i].guestCredit.toString();
          json.push(temp);
        }
        json = JSON.stringify(json);
        this.$_fetch_exportExcel(
          this.$qs.stringify({ fileName, headers, json })
        );
      });
    },
    // 分页
    currentChange(num) {
      this.$_fetch_visitorInfo({
        pageNum: num,
        guestName: this.visitorName,
        guestCredit: this.visitorCredit
      }).then(res => {
        this.visiInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
      });
    },
    // 查询访客信息
    visitorInfoSearch() {
      this.$_fetch_visitorInfo({
        guestName: this.visitorName,
        guestCredit: this.visitorCredit
      }).then(res => {
        this.visiInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.visitorInfo-wrapper {
  .info-search {
    .search-item {
      margin-top: 5px;
      width: 300px;
      &.visitorCredit {
        margin-left: 5px;
      }
    }
  }
  .info-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .info-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>