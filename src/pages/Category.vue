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
          <el-button size="mini" @click="handleEdit(scope.row.id)"
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
        <el-form-item label="上级分类" prop="pid">
          <!-- {{ formdata.pid }} -->
          <!--  change	绑定值变化时触发的事件	回调参数：选中的 Radio label 值
            pid：上级分类编号
          -->
          <el-select v-model="formdata.pid" placeholder="请选择上级分类">
            <el-option :key="0" label="顶级分类" :value="0"></el-option>
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
      fileList: [], //上传文件列表
      catelist: [], //表格数据
      dialogVisible: false, //表单对话框显示状态
      preVisible: false, //放大图片对话库显示状态
      dialogImageUrl: "", //放大图片的地址
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
            trigger: "change",
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
      let url = this.formdata.id ? this.$api.CATEEDIT : this.$api.CATEADD;
      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;

      //表单的输入验证
      this.$refs.cateform.validate((value) => {
        if (!value) {
          return false;
        }
        //调用添加/编辑接口
        this.$http.upload(url, this.formdata).then((res) => {
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
    //6、关闭重置表单内容
    reset() {
      this.formdata = {
        pid: "",
        catename: "",
        img: "",
        status: "1",
      };
      this.fileList = [];
    },

    //7、删除事件
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

    //8、和后台交互删除指定行数据
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.CATEDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
        //  console.log(res);//返回删除后的数据，要重新渲染
        this.getList();

        this.$message({
          type: "success",
          message: "删除成功!",
        });
      } else {
        this.$message.error(res.msg);
      }
    },

    //9、编辑按钮
    handleEdit(id) {
      // console.log(id);
      this.dialogVisible = true;
      this.tip = "修改";

      //把数据传进来
      this.$http.get(this.$api.CATEINFO, { id }).then((res) => {
        // console.log(res);
        if (res.code == 200) {
          //图片路径赋值
          if (res.list.img) {
            this.fileList = [
              {
                name: "",
                url: "http://localhost:3000" + res.list.img,
              },
            ];
          }
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },

    // @file:上传文件信息对象 file.raw就是被上传的文件数据
    // @fileList: 上传文件列表
    fileChange(file, fileList) {
      //文件上传会触发回调函数
      // console.log(file,fileList);
      this.formdata.img = file.raw;
    },
    // file：选中的上传图片对象
    handlePreview(file) {
      // console.log("handlePreview")
      this.dialogImageUrl = file.url; // 设置放大图片地址
      this.preVisible = true; //显示放大框
    },
    handleRemove() {},
  },
};
</script>
<style lang="less">
.el-breadcrumb {
  margin-bottom: 20px;
}
</style>