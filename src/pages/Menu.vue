<template>
  <div>
    <!-- 面包屑导航 -->
    <!-- separator：分割符 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="dialogVisible = true">添加</el-button>
    <!-- @changeMenu="menulist=$event" 作为自定义事件，从子组件中接收新的值，重新渲染上去 -->

    <!-- 法1、
      <MyTable :menulist="menulist" @changeMenu="menulist = $event"></MyTable> -->
    <!-- 法2、用函数接收值 
         @edit='editFn'  子组件自定义编辑事件
    -->
    <MyTable
      :menulist="menulist"
      @changeMenu="changeFn"
      @edit="editFn"
    ></MyTable>

    <!-- 
   :visible.sync="dialogVisible" 双向绑定，对话框是显示还是隐藏，一开始应该是false，点击显示
   open: 打开对话框时触发的回调(调用getTop函数获取顶级菜单数据)
 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getTop"
      @close="reset"
    >
      <!-- 表单 
         label:表单左侧文本
         ref:绑定传入的表单数据
      -->
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="menuform"
      >
        <el-form-item label="菜单名称">
          <!--  {{ formdata.pid }} 
          change	绑定值变化时触发的事件	回调参数：选中的 Radio label 值
          -->
          <el-select v-model="formdata.pid" @change="changeMenu">
            <!-- 
              key:标识
              label:选择项的文本
              value：当前项被选中的value(v-model绑定的值变成选中项的value)
              要从后台拿数据遍历
             -->
            <!-- 顶级菜单写死，不属于我们遍历的内容 -->
            <el-option :key="0" label="顶级菜单" :value="0"> </el-option>
            <!-- 动态生成 -->
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>

        <!-- 通过pid的值来判断应该显示的输入框 -->
        <el-form-item label="菜单图标" v-if="formdata.pid == 0">
          <el-input v-model="formdata.icon"></el-input>
        </el-form-item>

        <el-form-item label="菜单地址" v-else prop="url">
          <el-input v-model="formdata.url"></el-input>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item label="类型">
          <el-radio
            v-model="formdata.type"
            :label="1"
            :disabled="formdata.type != 1"
            >目录</el-radio
          >
          <el-radio
            v-model="formdata.type"
            :label="2"
            :disabled="formdata.type === 1"
            >菜单</el-radio
          >
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
      menulist: [],
      /* 添加表单需要的数据(根据接口说明里面的写) */
      formdata: {
        pid: 0, //上一级分类编号
        title: "",
        icon: "",
        type: 1, //类型：1目录 2菜单
        url: "",
        status: true, //状态，初始应该是选择状态
      },
      dialogVisible: false, //对话框显示状况
      topmenu: [], //顶层菜单
      rules: {
        title: [
          {
            required: true,
            message: "填写菜单名称",
            trigger: "blur",
          },
          {
            pattern: /^\S{2,8}$/g,
            message: "请输入4-8非空字符",
            trigger: "blur", //失去焦点时
          },
        ],
        /*   url: [
          {
            required: true,
            pattern: /^\S{7,8}$/g,
            message: "请输入4-8非空字符",
            trigger: "blur", //失去焦点时
          },
        ], */
      },
    };
  },
  //1、请求数据
  mounted() {
    this.getList(); //调用getList()方法
  },
  methods: {
    //子组件点击编辑时触发的自定义事件处理函数
    editFn(row) {
      this.dialogVisible = true; //打开对话框
      //把数据传进来
      // console.log(row); //传进来的就是点击的当行的数据，会向formdata添加了一个id属性
      //所以把formdata赋值
      this.formdata = {
        ...row,
      };
      //状态要转换 1为true
      this.formdata.status = this.formdata.status == 1 ? true : false;
    },

    //提交事件
    submit() {
      //对比修改和新增接口所需要的的参数，修改与新增的区别在于有没有id，有id就是修改操作
      let url = this.formdata.id ? this.$api.MENUEDIT : this.$api.MENUADD;

      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;
      //表单的输入验证
      this.$refs.menuform.validate((value) => {
        if (!value) {
          return false;
        }
        // console.log(this.formdata);
        //调用添加/编辑接口
        this.$http.post(url, this.formdata).then((res) => {
          // console.log(res);
          //获取到新增的数据，要重新渲染
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

    //关闭对话框，情况上一次输入的对话框内数据
    reset() {
      this.formdata = {
        pid: 0, //上一级分类编号
        title: "",
        icon: "",
        type: 1, //类型：1目录 2菜单
        url: "",
        status: true, //状态，初始应该是选择状态
      };
    },
    //切换菜单的时候触发
    changeMenu(pid) {
      // console.log(pid);
      //根据pid的值修改单选按钮的值
      this.formdata.type = pid > 0 ? 2 : 1;
    },

    // 子组件触发的自定义事件
    changeFn(menulist) {
      //console.log(menulist);
      this.menulist = menulist;
    },
    //获取树形结构的所有菜单
    async getList() {
      let res = await this.$http
        .get(this.$api.MENULIST, { istree: true })
        .then((res) => {
          if (res.code == 200) {
            // console.log(res); //有children
            this.menulist = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //获取顶层菜单数据
    async getTop() {
      let res = await this.$http
        .get(this.$api.MENULIST, { pid: 0 })
        .then((res) => {
          if (res.code == 200) {
            //console.log(res);//没有children，只有两个顶级菜单项
            this.topmenu = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-dialog__body {
  padding: 20px 30px 0 20px;
}
.el-dialog__footer {
  padding: 0px 20px 20px;
  text-align: right;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
</style>