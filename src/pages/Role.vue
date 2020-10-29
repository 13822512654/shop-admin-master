<template>
  <div class="container">
    <!-- 面包屑导航 -->
    <!-- separator : 分隔符 -->
    <el-breadcrumb separator="/" class="bread">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item> 管理员管理 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="dialogVisible = true">添加</el-button>

    <!-- data:表格渲染使用的数据 -->
    <el-table :data="userlist">
      <!-- el-table-column:每一列渲染
     label:列表头
     prop:表示这一列关联的属性名称，就是数据的key,这一部分的prop跟之前的prop不一样,不同的地方有不同的用法
     -->
      <el-table-column label="角色编号" width="180" prop="uid">
      </el-table-column>
      <el-table-column label="角色" width="180" prop="rolename">
      </el-table-column>
      <el-table-column label="用户名" width="180" prop="username">
      </el-table-column>
      <el-table-column label="状态" width="180">
        <!-- slot-scope:作用域插槽 暴露的数据,scope代表包含每一行的数据对象-->
        <!-- 当遇到非文字类时, 需要用到作用域插槽 -->
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success" effect="dark"
            >启用</el-tag
          >
          <el-tag v-else effect="dark" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.uid)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteFn(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      .sync:可以双向修改的数据
       dialogVisible:对话框显示还是隐藏,,默认值:false
     -->
    <!-- open:打开对话框时触发的回调(请求顶级菜单的数据) 
           close:关闭对话框，重置
     -->
    <el-dialog :visible.sync="dialogVisible" @open="openFn" @close="closeFn">
      <el-form
        label-width="100px"
        :model="formdata"
        ref="userform"
        :rules="rules"
      >
        <!-- label: 表单域文本 -->
        <el-form-item prop="roleid" label="角色">
          <el-select v-model="formdata.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input v-model="formdata.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formdata.status"> </el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </span>
    </el-dialog>
    <!-- 
      background: 有背景颜色的分页器
      layout: 包含的模块
      tatal: 总条数
      :page-size: 每一页的条数
       current-change: 页码切换时执行的函数
       current-page: 当前页码数
     -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="count"
      :page-size="size"
      @current-change="handlePageChange"
      :current-page="page"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false, //对话框显示状态
      // 页数
      page: 1,
      // 每页返回的数据
      size: 2,
      // 总条数
      count: 0,
      // 表格数据
      userlist: [],

      // 表单内容
      formdata: {
        roleid: "",
        username: "",
        password: "",
        status: true,
      },

      // 验证规则
      rules: {
        roleid: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: "change",
          },
        ],
        username: [
          {
            required: true,
            message: "请填写用户名",
            trigger: "blur",
          },
        ],
      },
      rolelist: [],
    };
  },
  mounted() {
    this.getList();
    this.getCount();
  },
  methods: {
    // 编辑
    editFn(uid) {
      this.dialogVisible = true; //关闭对话框
      this.$http.get(this.$api.USERINFO, { uid }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.formdata = {
            ...res.list,
          };
          this.formdata.password = "";
          this.formdata.status = res.list.status == 1 ? true : false;
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 页码数发生变化的函数
    handlePageChange(page) {
      this.page = page;
      this.getList();
    },
    // 对话框关闭
    closeFn() {
      this.checkedKeys = [];
      this.formdata = {
        rolename: "",
        menus: [],
        status: true,
      };
    },
    // 对话框打开
    openFn() {
      this.getRoleList();
    },
    // 删除数据
    deleteFn(id) {
      this.$confirm("此操作将永久删除该管理员, 是否继续?", "", {
        confirmButtonText: "确定", //确定按钮的文本
        cancelButtonText: "取消", //取消按钮的文本
        type: "warning",
      }).then(() => {
        this.$http
          .post(this.$api.USERDELETE, this.$qs.stringify({ id }))
          .then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message.success("删除成功");
              this.page = 1;
              // this.userlist = res.list ? res.list : [];
              this.getList();
              this.getCount();
            } else {
              this.$message.error(res.msg);
            }
          });
      });
    },
    // 添加提交
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.uid ? this.$api.USEREDIT : this.$api.USERADD; //如果含有id则是角色修改, 否则是添加

      let str = this.$qs.stringify(this.formdata);
      this.$refs.userform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(url, str).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getList();
            this.getCount();
            this.dialogVisible = false; //关闭对话框
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    // 请求角色数据
    getRoleList() {
      this.$http.get(this.$api.ROLELIST).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.rolelist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    getCount() {
      this.$http.get(this.$api.USERCOUNT).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.count = res.list[0].total ? res.list[0].total : 0;
          console.log(this.count);
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    // 请求数据
    getList() {
      this.$http
        .get(this.$api.USERLIST, { page: this.page, size: this.size })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.userlist = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
};
</script>
<style lang="less">
.container {
  .bread {
    margin-bottom: 20px;
  }
}
</style>