<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table :data="goodslist">
      <el-table-column
        label="一级分类"
        prop="firstcatename"
        width="150"
      ></el-table-column>
      <el-table-column
        label="二级分类"
        prop="secondcatename"
        width="150"
      ></el-table-column>
      <el-table-column
        label="商品名称"
        prop="goodsname"
        width="150"
      ></el-table-column>
      <el-table-column
        label="销售价"
        prop="price"
        width="100"
      ></el-table-column>
      <el-table-column
        label="市场价"
        prop="market_price"
        width="100"
      ></el-table-column>

      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-tag effect="dark" type="success" v-if="scope.row.status == 1"
            >启用</el-tag
          >
          <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editFn(scope.row.id)">编辑</el-button>
          <el-button size="mini" @click="deleteFn(scope.row.id)" type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
            background:设置背景
            layout:布局
            total:总条数
            page-size:每一页数据量
            current-change:当前页面发生变化触发的事件
            current-page:当前的页数
    -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="pageChange"
      :current-page="page"
    ></el-pagination>
    <!-- 对话框    -->
    <el-dialog
      :visible.sync="dialogVisible"
      @close="closeFn"
      @opened="openedFn"
      @open="openFn"
    >
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="goodsform"
        :rules="rules"
      >
        <el-form-item prop="first_cateid" label="一级分类">
          <!-- <p>{{ formdata.first_cateid }}</p> -->
          <el-select
            v-model="formdata.first_cateid"
            placeholder="请选择一级分类"
            @change="changeFn"
          >
            <el-option
              v-for="item in firstlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="second_cateid" label="二级分类">
          <!-- <p>{{ formdata.second_cateid }}</p> -->
          <el-select
            v-model="formdata.second_cateid"
            placeholder="请选择二级分类"
          >
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" prop="goodsname">
          <el-input v-model="formdata.goodsname"></el-input>
        </el-form-item>

        <!-- 图片 -->
        <el-form-item label="商品图片">
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

        <!-- 商品规格联动 -->
        <el-form-item label="商品规格名">
          <el-select
            v-model="formdata.specsid"
            placeholder="请选择商品规格名"
            @change="changeSpecs"
          >
            <el-option
              v-for="item in specslist"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品规格值">
          <el-select
            v-model="formdata.specsattr"
            multiple
            placeholder="请选择商品规格值"
          >
            <el-option
              v-for="item in attrs"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="销售价">
          <el-input type="number" v-model="formdata.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价">
          <el-input type="number" v-model="formdata.market_price"></el-input>
        </el-form-item>
        <el-form-item label="是否热卖">
          <el-radio v-model="formdata.ishot" :label="1">是</el-radio>
          <el-radio v-model="formdata.ishot" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否新品">
          <el-radio v-model="formdata.isnew" :label="1">是</el-radio>
          <el-radio v-model="formdata.isnew" :label="2">否</el-radio>
        </el-form-item>

        <!-- 富文本编辑 -->
        <el-form-item label="商品描述">
          <div id="editor"></div>
        </el-form-item>

        <el-form-item label="状态">
          <el-radio v-model="formdata.status" :label="1">上架</el-radio>
          <el-radio v-model="formdata.status" :label="2">下架</el-radio>
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
import E from "wangeditor";
export default {
  data() {
    return {
      fileList: [], //上传文件列表
      preVisible: false, //放大图片对话库显示状态
      dialogImageUrl: "", //放大图片的地址
      total: 0,
      page: 1,
      size: 2,
      goodslist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      //表格绑定数据
      formdata: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1, //是否新品     1-是 2-否
        ishot: 1, //是否热卖推荐 1-是 2-否
        status: 1,
      },
      //验证规则
      rules: {
        goodsname: [
          {
            required: true,
            message: "请填写角色名称",
            trigger: blur,
          },
        ],
      },
      //一级分类列表
      firstlist: [],
      //二级分类列表
      secondlist: [],
      specslist: [], //商品规格名
      attrs: [], //商品规格属性值
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //   页面数发生变化时触发的函数 page 新的页数
    pageChange(page) {
      //   console.log(page);
      this.page = page;
      this.getList();
    },
    // 1、获取所有的管理员列表和页数
    async getList() {
      let res1 = await this.$http.get(this.$api.GOODSCOUNT);
      // console.log(res1);
      this.total = res1.list[0].total;
      // console.log(this.total);
      let res = await this.$http.get(this.$api.GOODSLIST, {
        page: this.page,
        size: this.size,
      });
      console.log(res);
      if (res.code == 200) {
        this.goodslist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },

    // 2、打开对话框时需要的一级分类列表和商品规格名
    async getSelectList() {
      //一级分类
      let res = await this.$http.get(this.$api.CATELIST, { pid: 0 });
      // console.log(res); //5
      //商品规格
      let res1 = await this.$http.get(this.$api.SPECSLIST);
      console.log(res1);
      if (res.code == 200 && res1.code == 200) {
        this.firstlist = res.list ? res.list : [];
        this.specslist = res1.list ? res1.list : [];
      }
    },

    //3、点击一级目录更新二级
    changeFn(first_cateid) {
      // this.formdata.second_cateid = "";
      /*  console.log(first_cateid); */
      this.$http.get(this.$api.CATELIST, { pid: first_cateid }).then((res) => {
        console.log(res); //二级分类信息
        this.secondlist = res.list ? res.list : [];
      });
    },
    //3、点击商品规格更新商品属性值
    changeSpecs(id) {
      console.log(id);
      this.attrs = this.specslist.find((item) => item.id == id).attrs;
      console.log(this.attrs);
    },

    //新增按钮
    addFn() {
      this.dialogVisible = true;
    },
    openFn() {
      this.getSelectList();
    },
    openedFn() {
      /* ------------ */
      this.editor = new E("#editor");
      // 设置监听输入操作的回调函数，newHtml ：输入的内容
      this.editor.config.onchange = (newHtml) => {
        // console.log("change 之后最新的 html", newHtml);
        this.formdata.description = newHtml;
      };
      this.editor.create();
      //返回的数据设置为 富文本编辑框的内容
      this.editor.txt.html(this.formdata.description);
    },
    closeFn() {
      this.formdata = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: "",
        description: "",
        specsid: "",
        specsattr: "",
        isnew: "", //是否新品     1-是 2-否
        ishot: "", //是否热卖推荐 1-是 2-否
        status: true,
      };
      this.fileList = []; //上传文件列表

      /* ---------- */
      this.editor = null;
      document.getElementById("editor").innerHTML = ""; //重置富文本编辑器的html内容
    },

    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      // this.getSelectList();
      //获取商品信息 获取 二级分类列表

      this.$http.get(this.$api.GOODSINFO, { id }).then(async (res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.changeFn(res.list.first_cateid);
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          this.changeFn(this.formdata.first_cateid);
          this.attrs = this.formdata.specsattr.split(",");
          console.log(this.attrs); //[白色，黑色]
          this.formdata.specsattr = this.formdata.specsattr.split(",");

          //字符串拼接地址  this.$domain全局变量：http://localhost:3000
          this.fileList = [{ name: "", url: this.$domain + this.formdata.img }];
        }
      });
    },
    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.GOODSDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.page = 1;
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    // 提交按钮
    async submit() {
      let url = this.formdata.id ? this.$api.GOODSEDIT : this.$api.GOODSADD;
      console.log(url);
      console.log(this.formdata.specsattr); //白色，黑色
      /*    this.formdata.specsattr = this.formdata.specsattr.join(",");
      console.log(this.formdata.specsattr);
 */
      let res = await this.$http.upload(url, this.formdata);
      if (res.code == 200) {
        console.log(res);
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.msg);
      }
      this.dialogVisible = false;
      this.getList();
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