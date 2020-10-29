<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理员管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="handleAdd">添加</el-button>
    <el-table :data="userlist" style="width: 100%" row-key="id">
      <!-- 
        label :列表头文字
        prop: 这一列关联的数据名称，key (只是显示纯文本用)
       -->
      <el-table-column label="用户编号" width="200" prop="uid">
      </el-table-column>
      <el-table-column label="角色" width="180" prop="rolename">
      </el-table-column>
      <el-table-column label="用户名" width="150" prop="username">
      </el-table-column>

      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else-if="scope.row.status == 2"
            >禁用</el-tag
          >
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- 自定义事件传到父组件 -->
          <el-button size="mini" @click="handleEdit(scope.row.uid)"
            >编辑</el-button
          >
          <!-- 如果表格的数据不够，应该把id传进来，根据指定的id编号获取一条信息，更加严谨
            <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button> 
            -->
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 
    total:总条数
    page-size；默认每页显示10条
    @current-change:currentPage(当前页) 改变时会触发事件
    current-change：属性，当前页数，支持 .sync 修饰符,默认为1
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>

    <!-- 点击添加\编辑按钮弹出对话框 -->
    <el-dialog
      :title="'管理员' + tip"
      :visible.sync="dialogVisible"
      width="50%"
      @close="reset"
      @open="openFn"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="userform"
      >
        <el-form-item label="角色" prop="roleid">
          <!-- 将被选中role的id,作为新增的管理员的roleid -->
          <el-select v-model="formdata.roleid" placeholder="请选择角色">
            <!-- 动态生成 -->
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="用户名" prop="username">
          <el-input v-model="formdata.username"></el-input>
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
      page: 1,
      size: 2,
      total: 0,
      userlist: [],
      topmenu: [], //顶层菜单
      dialogVisible: false,
      tip: "", //对话框标题文本
      formdata: {
        roleid: "",
        username: "",
        password: "",
        status: "1",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "change",
          },
        ],
        roleid: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change",
          },
        ],
      },
    };
  },
  //请求数据
  mounted() {
    this.getList();
    this.getCount();
  },
  methods: {
    //页面数发生变化时触发的函数 page 新的页数
    pageChange(page) {
      //console.log(page);
      this.page = page;
      this.getList();
    },

    //1、获取角色管理数据渲染表格
    async getList() {
      //如果不传参list为null,page/size,根据接口说明里查看
      let res = await this.$http
        .get(this.$api.USERLIST, {
          page: this.page,
          size: this.size,
        })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.userlist = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
      this.getCount();
    },
    //2、获取总页数
    async getCount() {
      let res = await this.$http.get(this.$api.USERCOUNT).then((res) => {
        if (res.code == 200) {
          // console.log(res); //res.list.total 获取总条数
          //console.log(res.list[0].total);
          this.total = res.list[0].total;
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //3、获取顶级菜单
    async getTop() {
      let res = await this.$http
        .get(this.$api.ROLELIST, { pid: 0 })
        .then((res) => {
          if (res.code == 200) {
            //console.log(res); //获取到顶层菜单列表项
            this.topmenu = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },

    //7、和后台交互删除指定行数据
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.USERDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
        //  console.log(res);//返回删除后的数据，要重新渲染
        if (this.userlist.length == 1) {
          this.page--;
        }

        this.getList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      } else {
        this.$message.error(res.msg);
      }
    },

    //4、点击添加按钮，弹出对话框，渲染数据
    handleAdd() {
      this.dialogVisible = true;

      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.getTop();
      this.tip = "添加";
    },
    //5、点击关闭，情空表单内填入的数据
    reset() {
      this.dialogVisible = false;
      this.formdata = {
        roleid: "",
        username: "",
        password: "",
        status: "1",
      };
    },

    // 提交按钮
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;
      let url = this.formdata.uid ? this.$api.USEREDIT : this.$api.USERADD;

      let str = this.$qs.stringify(this.formdata);
      //表单的输入验证
      this.$refs.userform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(url, str).then((res) => {
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
    //6、删除挽留事件
    handleDelete(id) {
      this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除指定内容,调用删除接口
          this.deleteMenu(id);
        })
        .catch(() => {});
    },

    //8、编辑事件
    handleEdit(uid) {
      this.dialogVisible = true;
      this.getTop();
      this.$http.get(this.$api.USERINFO, { uid }).then((res) => {
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
        this.$refs.userform.clearValidate();
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