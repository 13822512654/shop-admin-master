<template>
  <!-- @command="函数名"  
          点击任意菜单项都会触发自带的点击函数，并且被点击的项command值作为事件处理函数的参数-->
  <el-dropdown @command="logout">
    <!-- 下拉框固定显示 -->
    <span class="el-dropdown-link">
      <span>{{ username }}</span>
      <!-- 图标的使用，类名实现 -->
      <i class="el-icon-setting"></i>
    </span>
    <!-- 下拉菜单 -->
    <el-dropdown-menu slot="dropdown">
      <!-- command='?' 当有多个选项时，识别点击的是哪一个-->
      <!--  <el-dropdown-item command='x'>登出</el-dropdown-item> -->
      <!-- 目前不需要 command，因为只有一项-->
      <el-dropdown-item>登出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  props: {
    username: {
      required: true,
      type: String,
    },
  },
  methods: {
    //调用方法，清空登陆数据
    ...mapMutations(["clearInfo"]),
    logout() {
      this.clearInfo();
      this.$router.replace("/login");
    },
    /*  logout(command) {
      //  法2 基础版本 点击传入自己写的参数
      //点击清空所有信息，并跳转到登录页
      localStorage.clear();
      this.$store.state.token = "";
      this.$store.state.info = {};
      this.$router.replace("/login");

      //法3   this.$store.commit("clearInfo");
      // this.$router.replace("/login");
    }, */
  },
};
</script>