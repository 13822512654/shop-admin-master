<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-table :data="memberlist" style="width: 100%" row-key="id">
      <!-- 
       表格列表
       -->
      <el-table-column label="昵称" width="150" prop="nickname">
      </el-table-column>
      <el-table-column label="手机号" width="180" prop="phone">
      </el-table-column>
      <el-table-column label="注册日期" width="200">
        <template slot-scope="scope">
          <!-- 过滤器的使用 -->
          {{ scope.row.addtime | format }}
          <!-- {{ new Date(parseInt(scope.row.addtime)).toLocaleString()}} -->
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 自定义事件传到父组件 -->
          <el-button size="mini" @click="handleEdit(scope.row.uid)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 点击添加\编辑按钮弹出对话框 -->
    <el-dialog
      title="会员编辑"
      :visible.sync="dialogVisible"
      width="50%"
      @open="openFn"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="memberform"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formdata.nickname"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formdata.phone"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="formdata.password" type="password"></el-input>
        </el-form-item>

        <!-- 状态框 -->
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      memberlist: [],
      dialogVisible: false,
      formdata: {
        uid: "",
        nickname: "",
        phone: "",
        password: "",
        status: "1",
      },
      rules: {
        nickname: [
          {
            required: true,
            message: "请输入昵称",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "change",
          },
        ],
      },
    };
  },
  //请求数据
  mounted() {
    this.getList();
  },
  filters: {
    // 时间戳转为日期。
    format(time) {
      // 返回日期格式为：2020-03-19 11:05:09
      var date = new Date(parseInt(time));
      let year = date.getFullYear(); //获取完整的年份
      let month = date.getMonth() + 1 + ""; //获取当前月份(0-11,0代表1月)
      let day = date.getDate() + "";
      let hour = date.getHours() + "";
      let minute = date.getMinutes() + "";
      let second = date.getSeconds() + "";
      return `${year}-${month.padStart(2, "0")}-${day.padStart(
        2,
        "0"
      )} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:${second.padStart(
        2,
        "0"
      )}`;
    },
  },

  computed: {},
  methods: {
    //1、获取会员管理数据渲染表格
    async getList() {
      let res = await this.$http.get(this.$api.MEMBERLIST).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.memberlist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 提交按钮
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      //表单的输入验证
      this.$refs.memberform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(this.$api.MEMBEREDIT, this.formdata).then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.dialogVisible = false;
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.msg);
          }
          this.getList();
        });
      });
    },

    //编辑事件
    handleEdit(uid) {
      this.dialogVisible = true;
      this.$http.get(this.$api.MEMBERINFO, { uid }).then((res) => {
        // console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list,
          };
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },

    //打开对话框清空验证
    openFn() {
      this.$nextTick(() => {
        this.$refs.memberform.clearValidate();
      });
    },
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>