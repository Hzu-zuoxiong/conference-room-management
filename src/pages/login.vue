<template>
  <div class="login-wrapper">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="100"
      shapeType="star"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <div class="login">
      <div class="projectName">
        <span>掌上智能访客及会议室管理系统</span>
      </div>
      <ul class="login-list" @keyup.13="login">
        <li>
          <input id="userName" type="text" placeholder="请输入账号">
        </li>
        <li>
          <input id="password" type="password" placeholder="请输入密码">
        </li>
        <li>
          <a id="login" class="btn" @click="login">登 录</a>
        </li>
        <li>
          <a href="forgetPass.html" class="tar">忘记密码？</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Fetch from "mixins/fetch";

export default {
  data() {
    return {};
  },
  mixins: [Fetch],
  mounted() {
    window.addEventListener("enter", this.login);
  },
  destroyed() {
    window.removeEventListener("enter", this.login);
  },
  methods: {
    // 登陆
    login() {
      const userName = document.getElementById("userName").value;
      const password = document.getElementById("password").value;
      console.log(userName);
      console.log(password);
      if (userName !== "" && password !== "") {
        this.$_fetch_login(this.$qs.stringify({ userName, password })).then(
          res => {
            if (res.status === 1) {
              this.$router.push("/");
            } else if (res.status === 0) {
              this.$message({
                message: "用户不存在！",
                type: "error"
              });
            } else if (res.status === -1) {
              this.$message({
                message: "授权码过期！",
                type: "error"
              });
            } else if (res.status === 2) {
              this.$message({
                message: "用户密码错误！",
                type: "error"
              });
            }
          }
        );
      } else {
        this.$message({
          message: "账号密码不能为空！",
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  background: url("../assets/images/bj.jpg") no-repeat center fixed;
  background-size: cover;
  background-repeat: no-repeat;
  overflow: hidden;
  width: 100%;
  height: 100%;
  .login {
    width: 400px;
    height: 345px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -172px 0 0 -200px;
    .projectName {
      width: 50%;
      margin: 30px auto 30px;
      font-size: 18px;
      color: #fff;
      text-align: center;
    }
    .login-list {
      width: 90%;
      margin: 0 auto;
      li {
        margin-bottom: 15px;
        input {
          padding: 13px 10px;
          border: 1px solid #e6e6e6;
          border-radius: 3px;
          font-size: 14px;
          width: 100%;
        }
        .btn {
          width: 100%;
          height: 45px;
          line-height: 45px;
          text-align: center;
          background: #17b5a6;
          font-size: 16px;
          color: #fff;
          display: block;
          border-radius: 3px;
          &:hover {
            cursor: pointer;
          }
        }
        .tar:hover {
          color: #fff;
        }
      }
    }
  }
}
</style>
