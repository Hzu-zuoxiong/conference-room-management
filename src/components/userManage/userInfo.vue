<template>
  <div class="userInfo-wrapper">
    <InfoSearch @InfoSearch="userInfoSearch" class="info-search">
      <el-input placeholder="请输入用户ID" v-model="userId" class="search-item">
        <template slot="prepend">用户ID</template>
      </el-input>
      <el-input placeholder="请输入真实姓名" v-model="userName" class="search-item">
        <template slot="prepend">真实姓名</template>
      </el-input>
      <el-input placeholder="请输入用户邮箱" v-model="userEmail" class="search-item">
        <template slot="prepend">用户邮箱</template>
      </el-input>
    </InfoSearch>
    <!-- 表格 -->
    <div class="userInfo-result-wrapper">
      <div class="port-btn">
        <el-button type="primary" size="small" class="port-btn" @click="exportExcel">导出</el-button>
      </div>
      <div class="userInfo-result">
        <el-table :data="userInfo" stripe>
          <el-table-column prop="userId" label="ID" header-align="center" align="center"></el-table-column>
          <el-table-column prop="userName" label="真实姓名" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="userEmail"
            width="180"
            label="邮箱"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="userTelephone" label="联系方式" header-align="center" align="center"></el-table-column>
          <el-table-column
            prop="userLoginPreTime"
            label="上次登陆时间"
            header-align="center"
            align="center"
          ></el-table-column>
          <el-table-column prop="userLoginIp" label="上次登陆IP" header-align="center" align="center"></el-table-column>
          <el-table-column label="授权登陆" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                plain
                @click="changeAuthorized(scope.$index, scope.row.userId, scope.row.userIsAuthorized)"
              >{{scope.row.userIsAuthorized? '停用' : '启用'}}</el-button>
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
  props: {},
  data() {
    return {
      userId: "",
      userName: "",
      userEmail: "",
      userInfo: [],
      recordNum: 0
    };
  },
  mixins: [Fetch],
  created() {
    this.pageNum = 0;
    this.pageSize = 8;
    this.pageCount = 5;
    // 获取页面初始数据
    this.$_fetch_userInfo().then(res => {
      this.userInfo = res.pageBean.dataList;
      this.recordNum = res.pageBean.recordNum;
      this.pageNum = res.pageBean.pageNum;
      this.$_formateTime(this.userInfo);
    });
  },
  mounted() {},
  computed: {},
  methods: {
    // 格式化时间
    $_formateTime(appiontInfo) {
      if (!appiontInfo) return;
      for (let item of appiontInfo) {
        // 修改时间
        item.userLoginPreTime = dateFormate(
          item.userLoginPreTime,
          "yyyy-MM-dd hh:mm:ss"
        );
      }
    },
    exportExcel() {},
    // 分页
    currentChange(num) {
      const { userId, userName, userEmail } = this;
      this.$_fetch_userInfo({
        userId: userId,
        userName: userName,
        userEmail: userEmail,
        pageNum: num
      }).then(res => {
        this.userInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.pageNum = res.pageBean.pageNum;
        this.$_formateTime(this.userInfo);
      });
    },
    // 条件查询
    userInfoSearch() {
      const { userId, userName, userEmail } = this;
      this.$_fetch_userInfo({
        userId: userId,
        userName: userName,
        userEmail: userEmail
      }).then(res => {
        this.userInfo = res.pageBean.dataList;
        this.recordNum = res.pageBean.recordNum;
        this.$_formateTime(this.userInfo);
      });
    },
    changeAuthorized(index, userId, userIsAuthorized) {
      console.log(userIsAuthorized);
      this.$confirm(
        `${userIsAuthorized ? "取消" : "同意"}用户的登陆权限?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          return this.$_fetch_updateUserAuthority({
            userId: userId
          });
        })
        .then(() => {
          let userIndex = (this.pageNum - 1) * 8 + index;
          this.userInfo[userIndex].userIsAuthorized = !userIsAuthorized;
          userIsAuthorized = !userIsAuthorized;
          this.$message({
            type: "success",
            message: "更改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消更改"
          });
        });
    }
  },
  watch: {}
};
</script>

<style lang="scss" scoped>
.userInfo-wrapper {
  .info-search {
    .search-item {
      margin-top: 5px;
      margin-left: 5px;
      width: 300px;
    }
  }
  .userInfo-result-wrapper {
    .port-btn {
      border-top: 1px solid #ccc;
      margin-top: 10px;
      margin-bottom: 10px;
      text-align: right;
    }
    .userInfo-result {
      text-align: center;
      .pagination {
        margin-top: 20px;
      }
    }
  }
}
</style>