<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="handleAdd">添加</el-button>
    <!-- 
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" -->
    <el-table :data="rolelist" style="width: 100%" row-key="id">
      <!-- 
        label :列表头文字
        prop: 这一列关联的数据名称，key (只是显示纯文本用)
       -->
      <el-table-column label="名称" width="180" prop="rolename">
      </el-table-column>

      <el-table-column label="状态" width="180">
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
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
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

    <!-- 点击添加\编辑按钮弹出对话框 -->
    <el-dialog
      :title="'角色' + tip"
      :visible.sync="dialogVisible"
      width="50%"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="roleform"
      >
        <el-form-item label="角色名称" prop="rolename">
          <el-input v-model="formdata.rolename"></el-input>
        </el-form-item>

        <el-form-item label="菜单权限">
          <!-- 树形控件 
            data 绑定的树状结构数组数据(菜单列表数据)
            show-checkbox 可选择
            node-key: 节点表示
            props: children 属性作为子阶段数据
            label : 文本是title 属性
            ref : 添加标记，为后面 获取checked-key 做准备 
            default-checked-keys：	默认勾选的节点的 key 的数组	array
            node-key : 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的	String
            check-strictly 是否严格的遵循父子不互相关联的做法，默认为 false
            -->
          <el-tree
            check-strictly
            ref="power"
            :data="menu"
            show-checkbox
            node-key="id"
            :props="{ children: 'children', label: 'title' }"
            :default-checked-keys="menus"
          >
          </el-tree>
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
      rolelist: [],
      menu: [], //菜单权限上应该渲染的菜单列表数据
      menus: [], //角色权限 id数组，编辑时的预先选中项
      dialogVisible: false,
      tip: "", //对话框标题文本
      formdata: {
        rolename: "",
        status: "1",
      },
      rules: {
        rolename: [
          {
            required: true,
            message: "请输入上级菜单",
            trigger: "blur",
          },
        ],
      },
    };
  },
  //请求数据
  mounted() {
    this.getList();
  },
  methods: {
    //1、获取角色管理数据渲染表格
    async getList() {
      let res = await this.$http.get(this.$api.ROLELIST).then((res) => {
        if (res.code == 200) {
          console.log(res); //有children
          this.rolelist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //2、获取菜单的树状结构数据
    async getMenu() {
      let res = await this.$http
        .get(this.$api.MENULIST, { istree: true })
        .then((res) => {
          if (res.code == 200) {
            //console.log(res); //有children
            this.menu = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //7、和后台交互删除指定行数据
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.ROLEDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
        //  console.log(res);//返回删除后的数据，要重新渲染
        this, this.getList();

        this.$message({
          type: "success",
          message: "删除成功!",
        });
      } else {
        this.$message.error(res.msg);
      }
    },
    //3、点击添加按钮，弹出对话框，渲染数据
    handleAdd() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.getMenu();
      this.tip = "添加";
    },
    //4、点击关闭，情空表单内填入的数据
    reset() {
      this.dialogVisible = false;
      this.formdata = {
        rolename: "",
        status: "1",
      };
      //因为menus没有双向绑定，所以要调用赋值
      this.setCheckedKeys([]);
    },
    //5、提交事件
    submit() {
      let url = this.formdata.id ? this.$api.ROLEEDIT : this.$api.ROLEADD;
      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;
      // 获取 树状 组将选择权限 数组转化为字符串 准备提交
      /* 
      getCheckedKeys	若节点可被选择（即 show-checkbox 为 true），返回目前被选中的节点的 key 所组成的数组
      */
      //要有node-key作为选中的唯一标志节点,
      let menus = this.$refs.power.getCheckedKeys().join(","); //用，转为字符串
      // console.log(menus); //8,14,15
      this.formdata.menus = menus;
      //表单的输入验证
      this.$refs.roleform.validate((value) => {
        if (!value) {
          return false;
        }
        // console.log(this.formdata);
        //验证成功，调用接口
        this.$http.post(url, this.formdata).then((res) => {
          // console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            //新增成功之后，重新获取最新数据
            this.getList();
            //关闭对话框
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //6、删除事件
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
    handleEdit(row) {
      this.dialogVisible = true;
      // 获取菜单
      this.getMenu();
      this.tip = "修改";
      //把数据传进来
      console.log(row); //当前行数据
      this.formdata = {
        ...row,
      };
      //状态要转换 1为true
      this.formdata.status = this.formdata.status == 1 ? true : false;

      this.formdata.menus = row.menus;
      /*  this.setCheckedKeys();
      console.log(this.formdata); */
      // console.log(row.menus.split(","));//转数组
      // console.log(row.menus.join(","));//转字符串
      this.setCheckedKeys(row.menus.split(","));
    },

    setCheckedKeys(menus) {
      this.$nextTick(() => {
        this.$refs.power.setCheckedKeys(menus);
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