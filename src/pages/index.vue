<template>
  <div class="index-wrapper">
    <v-header class="index-header" @updateAccount="visible=true"></v-header>
    <div class="content-wrapper">
      <v-aside class="content-aside"></v-aside>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
    <div class="mask" v-show="visible">
      <div class="updateAccount">
        <div class="closeX" @click="visible = false">×</div>
        <el-form
          class="AccountForm"
          :model="updateAccount"
          label-position="left"
          label-width="80px"
        >
          <h1 class="title">修改密码</h1>
          <el-form-item label="账号">
            <el-input v-model="updateAccount.name"></el-input>
          </el-form-item>
          <el-form-item label="授权码">
            <el-input v-model="updateAccount.code"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input type="password" v-model="updateAccount.passWorld"></el-input>
          </el-form-item>
          <el-form-item label="确认密码">
            <el-input type="password" v-model="updateAccount.confirmPassWorld"></el-input>
          </el-form-item>
          <el-button type="primary" class="update" @click="update">确认修改</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from "comm/vHeader";
import vAside from "comm/vAside";
import Fetch from "mixins/fetch";

export default {
  name: "index",
  components: {
    vHeader,
    vAside
  },
  mixins: [Fetch],
  data() {
    return {
      visible: false,
      updateAccount: {
        name: "",
        code: "",
        passWorld: "",
        confirmPassWorld: ""
      },
      num: 0
    };
  },
  mounted() {
    this.$bus.$on("sideVisible", () => {
      this.num++;
      let aside = document.querySelectorAll(".content-aside")[0];
      let content = document.querySelectorAll(".content")[0];
      if (this.num % 2) {
        aside.style.width = 200 + "px";
        content.style.marginLeft = 200 + "px";
      } else {
        aside.style.width = 65 + "px";
        content.style.marginLeft = 65 + "px";
      }
    });
  },
  methods: {
    update() {
      const { name, code, passWorld, confirmPassWorld } = this.updateAccount;
      if (passWorld === "") {
        this.$message.error("密码不能为空！");
        return;
      }
      if (passWorld !== confirmPassWorld) {
        this.$message.error("密码不一致！");
        return;
      }
      let formData = new FormData();
      formData.append("adminPassword", passWorld);
      formData.append("adminId", name);
      formData.append("keyId", code);
      this.$_fetch_forgetPassWord(formData).then(res => {
        switch (res.status) {
          case 1:
            this.$message.success("密码修改成功！");
            break;
          case -1:
            this.$message.error("授权码过期！");
            break;
          case -2:
            this.$message.error("用户与授权码不对应！");
            break;
          case 0:
            this.$message.error("用户不存在！");
            break;
        }
      });
      this.visible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.index-wrapper {
  position: relative;
  height: 100%;
  .index-header {
    position: fixed;
    top: 0;
    left: 0;
    height: 60px;
  }
  .content-wrapper {
    margin-top: 60px;
    height: 100%;
    .content-aside {
      width: 65px;
      transition: all 0.5s;
    }
    .content {
      margin-left: 65px;
      padding: 10px;
      transition: all 0.5s;
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.7);
    .updateAccount {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 500px;
      height: 420px;
      margin-left: -250px;
      margin-top: -210px;
      background-color: #fff;
      border: 1px solid #333;
      .closeX {
        position: absolute;
        top: 5px;
        right: 15px;
        width: 20px;
        height: 20px;
        text-align: center;
        font-size: 38px;
        color: #f56c6c;
        cursor: pointer;
      }
      .AccountForm {
        padding: 45px;
        margin-top: -20px;
        .title {
          text-align: center;
          color: #606266;
        }
        .update {
          display: block;
          margin: 0 auto;
        }
      }
    }
  }
}
</style>