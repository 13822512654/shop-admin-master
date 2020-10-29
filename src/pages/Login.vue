<template>
  <div class="login-bg">
    <div class="login-container">
      <!-- el-form:表单容器
      :model:表单数据，data需要设置对应的数据引用
      ref:表单组件引用
      rules:验证规则
 -->
      <el-form :model="ruleForm" ref="loginForm" :rules="rules">
        <h2>登录</h2>
        <el-form-item prop="username" lable="">
          <!-- prop：指明这一条数据需要用哪一个来验证,获取 rules中同名验证规则进行验证-->
          <el-input v-model="ruleForm.username" prop="username"></el-input>
        </el-form-item>
        <el-form-item prop="password" lable="">
          <!-- prop：指明这一条数据需要用哪一个来验证,获取 rules中同名验证规则进行验证-->
          <el-input v-model="ruleForm.password" prop="password"></el-input>
        </el-form-item>
        <el-button type="primary" @click="submit('loginForm')">登陆</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions } from "vuex";
export default {
  methods: {
    //调用方法，保存登陆数据
    ...mapMutations(["setInfo"]),
    ...mapActions(["userLogin"]), //调用store/index.js中的userLogin方法
    /* validate	对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise */
    //点击登陆的时候再做一次验证，防止用户什么都没填就直接点击登陆，提交空的值
    submit(form) {
      /*  console.log(this.$store);//Store对象，里面有commit函数
       console.log(form);//loginForm
      console.log(this.$refs[form]);// */

      //利用传入的ref值，调用表单组件的验证方法
      //@value：boolean  是否通过验证的boolean
      this.$refs[form].validate((value) => {
        if (!value) {
          return false;
        }
        /* 法2
        this.userLogin(this.ruleForm); */
        //法1
        let str = this.$qs.stringify(this.ruleForm);
        //console.log(str)//username=admin&password=123123

        this.$http.post(this.$api.USERLOGIN, str).then((res) => {
          console.log(res);
          //登陆成功
          if (res.code == 200) {
            this.setInfo({ token: res.list.token, info: res.list });
            this.$router.replace("/index");
          } else {
            //登陆失败
            //  this.$message({
            //   type:'error',
            //   msg:res.msg
            // })
            this.$message.error(res.msg);
          }
        });
      });
    },
  },
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        //验证规则名称，每一条规则都是一条验证规则
        username: [
          {
            required: true, //必须填
            message: "请输入管理员名称",
            trigger: "blur", //失去焦点时
          },
          {
            pattern: /^\S{4,8}$/g,
            message: "请输入4-8非空字符",
            trigger: "blur", //失去焦点时
          },
        ],
        password: [
          {
            required: true, //必须填
            message: "请输入管理员密码",
            trigger: "blur", //失去焦点时
          },
          {
            max: 8,
            min: 5,
            message: "请输入5-8非空字符",
            trigger: "blur", //失去焦点时
          },
        ],
      },
    };
  },
};
</script>
<style lang="less">
.login-bg {
  height: 100%;
  background: -webkit-linear-gradient(left, #563443, #413a53, #2f3d60);
  .login-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    text-align: center;
    width: 300px;
    height: 250px;
    h2 {
      font-size: 25px;
      font-weight: bold;
      color: #fff;
      margin-bottom: 20px;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>