<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>分类列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="handleAdd">添加</el-button>

    <!-- 表格列表 -->
    <el-table
      :data="catelist"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="分类名称" width="180" prop="catename">
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1">启用</el-tag>
          <el-tag type="success" v-else-if="scope.row.status == 2">禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="$emit('edit', scope.row)"
            >编辑</el-button
          >
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
      :title="'分类' + tip"
      :visible.sync="dialogVisible"
      width="50%"
      @open="getTop"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="cateform"
      >
        <el-form-item label="上级分类" required prop="pid">
          <!-- {{ formdata.pid }} -->
          <!--  change	绑定值变化时触发的事件	回调参数：选中的 Radio label 值
            pid：上级分类编号
          -->
          <el-select v-model="formdata.pid" placeholder="请选择上级分类">
            <el-option key="0" label="顶级分类" value="0"></el-option>
            <!-- 动态生成 -->
            <el-option
              v-for="item in topmenu"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类名称" prop="catename">
          <el-input v-model="formdata.catename"></el-input>
        </el-form-item>

        <el-form-item label="图片">
          <!-- 原版 -->
          <!-- <input type="file" ref="file" /> -->

          <!-- el版
          上传组件主题
                action:自动上传的地址
                auto-upload: 是否自动上传
                list-type:照片墙
                on-preview:设置预览时的 回调函数
                on-remove:设置移除时的 回调函数
                on-change:设置选择上传图片时的回调函数
           -->
          <el-upload
            action="#"
            :auto-upload="false"
            list-type="picture-card"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-change="fileChange"
            :file-list="fileList"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- 放大图片设置 
            visible：显示状态
            apped-to-body:多个对话框的堆叠顺序问题
          -->
          <el-dialog :visible.sync="preVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
import axios from "axios";
export default {
  data() {
    return {
      catelist: [],
      formdata: {
        pid: "",
        catename: "",
        img: "",
        status: "1",
      },
      rules: {
        pid: [
          {
            required: true,
            message: "请输入上级菜单",
            trigger: "blur",
          },
        ],
        catename: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      tip: "",
      dialogVisible: false,
      topmenu: [], //顶层菜单
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //1、获取商品分类数据渲染表格
    async getList() {
      let res = await this.$http
        .get(this.$api.CATELIST, { istree: true })
        .then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.catelist = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //2、获取顶层菜单
    async getTop() {
      let res = await this.$http
        .get(this.$api.CATELIST, { pid: 0 })
        .then((res) => {
          if (res.code == 200) {
            //console.log(res); //获取到顶层菜单列表项
            this.topmenu = res.list ? res.list : [];
          } else {
            this.$message.error(res.msg);
          }
        });
    },
    //3、点击添加按钮
    handleAdd() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.tip = "添加";
    },
    //4、点击关闭、取消，重置表单内容
    reset() {
      this.formdata = {
        pid: "",
        catename: "",
        img: "",
        status: "1",
      };
    },
    //5、提交事件
    submit() {
      this.dialogVisible = false;
      //获取上次的图片的内容
      console.log(this.$refs.file.files[0]);
      this.formdata.img = this.$refs.file.files[0];

      let url = this.formdata.id ? this.$api.CATEEDIT : this.$api.CATEADD;
      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;

      //获取表单实例 ,后台规定上传的文件不能以单纯的字符串格式提交
      /* FormData的主要用途有两个：
      1、将form表单元素的name与value进行组合，实现表单数据的序列化，从而减少表单元素的拼接，提高工作效率。
      2、异步上传文件 */
      let form1 = new FormData(); //通过FormData构造函数创建一个空对象
      for (var key in this.formdata) {
        //调用表单实例的append方法(向表单实例追加数据的方法)
        //key:数据的名称  value：数据的值
        form1.append(key, this.formdata[key]);
      }

      //表单的输入验证
      this.$refs.cateform.validate((value) => {
        if (!value) {
          return false;
        }
        console.log(this.formdata);
        console.log(form1);
        //调用添加/编辑接口
        //不能用封装的方法，要用原版的，因为上传文件请求头要设置多一个属性:
        axios({
          method: "post",
          url,
          data: form1,
          headers: {
            Authorization: localStorage.getItem("token")
              ? localStorage.getItem("token")
              : "",
            "Content-Type": "multipart/form-data", //改写上传文件的文件类型
          },
        }).then((res) => {
          //console.log(res);
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
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>