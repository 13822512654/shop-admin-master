<template>
  <div class="layout">
    <el-container class="container">
      <el-aside width="150px">
        <SideBar></SideBar>
      </el-aside>
      <el-container>
        <el-header>
          <MyHeader :username="username"></MyHeader>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script >
import MyHeader from "@/components/MyHeader";
import SideBar from "@/components/SideBar";
export default {
  components: {
    MyHeader,
    SideBar,
  },
  computed: {
    username() {
      return this.$store.state.info.username;
    },
  },
};
</script>
<style lang="less">
.layout {
  height: 100%;
  .container {
    width: 100%;
    height: 100%;
    .el-header {
      text-align: right;
      height: 60px;
      background-color: #b3c0d1;
      line-height: 60px;
      span {
        cursor: pointer;
      }
      .el-dropdown-link {
        font-size: 20px;
      }
    }
    .el-aside {
      color: #333;
      background: #20222a;
    }
    .el-main {
      background: #e5e5e5;
    }
  }
}
</style>