<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="handleAdd">添加</el-button>

    <!-- 表格列表 -->
    <el-table :data="bannerlist" style="width: 100%" row-key="id">
      <el-table-column label="轮播图名称" width="180" prop="title">
      </el-table-column>

      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" effect="dark" type="success"
            >启用</el-tag
          >
          <el-tag type="danger" effect="dark" v-else-if="scope.row.status == 2"
            >禁用</el-tag
          >
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

    <!-- 对话框 -->
    <el-dialog
      :title="'分类' + tip"
      :visible.sync="dialogVisible"
      width="50%"
      @close="reset"
    >
      <el-form
        label-width="100px"
        :model="formdata"
        :rules="rules"
        ref="bannerform"
      >
        <el-form-item label="轮播标题" prop="title">
          <el-input v-model="formdata.title"></el-input>
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
export default {
  data() {
    return {
      fileList: [], //上传文件列表
      preVisible: false, //放大图片对话库显示状态
      dialogImageUrl: "", //放大图片的地址
      bannerlist: [], //表格数据
      formdata: {
        title: "",
        img: "",
        status: "1",
      },
      rules: {
        title: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
      },
      tip: "",
      dialogVisible: false,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //1、获取商品分类数据渲染表格
    async getList() {
      let res = await this.$http.get(this.$api.BANNERLIST).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.bannerlist = res.list ? res.list : [];
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //2、点击添加按钮
    handleAdd() {
      this.dialogVisible = true;
      this.formdata.status = this.formdata.status == 1 ? true : false;
      this.tip = "添加";
    },
    //3、关闭重置表单内容
    reset() {
      this.formdata = {
        title: "",
        img: "",
        status: "1",
      };
      this.fileList = [];
    },
    //4、提交按钮
    submit() {
      let url = this.formdata.id ? this.$api.BANNEREDIT : this.$api.BANNERADD;
      //根据接口说明里面所需要的参数传入
      this.formdata.status = this.formdata.status ? 1 : 2;

      //表单的输入验证
      this.$refs.bannerform.validate((value) => {
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
            this.dialogVisible = false;
          } else {
            this.$message.error(res.msg);
          }
        });
      });
    },
    //5、 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.BANNERDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
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
          this.deleteFn(id);
        })
        .catch(() => {});
    },

    //7、编辑事件
    handleEdit(id) {
      this.dialogVisible = true;
      this.tip = "修改";
      //把数据传进来
      this.$http.get(this.$api.BANNERINFO, { id }).then((res) => {
        //console.log(res);
        if (res.code == 200) {
          //图片路径赋值
          this.fileList = [
            {
              name: "",
              url: "http://localhost:3000" + res.list.img,
            },
          ];
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
      console.log(file, fileList);
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