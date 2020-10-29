<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table :data="secklist">
      <el-table-column
        label="活动名称"
        prop="title"
        width="150"
      ></el-table-column>

      <el-table-column label="状态" width="200">
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

    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" @close="closeFn" @open="openFn">
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="seckill"
        :rules="rules"
      >
        <el-form-item prop="title" label="活动名称">
          <el-input v-model="formdata.title"></el-input>
        </el-form-item>

        <el-form-item label="活动期限">
          <div class="block">
            <el-date-picker
              v-model="dateval"
              value-format="timestamp"
              @change="timeChange"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item prop="first_cateid" label="一级分类">
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
            @change="changeTwo"
          >
            <el-option
              v-for="item in secondlist"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsid" label="商品">
          <!-- <p>{{ formdata.goodsid }}</p> -->
          <el-select v-model="formdata.goodsid" placeholder="请选择商品">
            <el-option
              v-for="item in thirdlist"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="formdata.status"></el-switch>
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
      dateval: [], //日期时间
      secklist: [], //表格数据
      dialogVisible: false, //对话框显示状态
      //表格绑定数据
      formdata: {
        title: "", //  限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: true,
      },
      //验证规则
      rules: {
        title: [
          {
            required: true,
            message: "请填写活动名称",
            trigger: "change",
          },
        ],
      },
      //一级分类列表
      firstlist: [],
      //二级分类列表
      secondlist: [],
      //三级分类列表
      thirdlist: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //时间获取
    timeChange(e) {
      console.log(e);
      this.formdata.begintime = e[0];
      this.formdata.endtime = e[1];
    },
    // 1、获取所有的秒杀列表
    async getList() {
      let res = await this.$http.get(this.$api.SECKLIST);
      console.log(res);
      if (res.code == 200) {
        this.secklist = res.list ? res.list : [];
      } else {
        this.$message.error(res.msg);
      }
    },
    // 2、打开对话框时需要的一级分类列表
    getFirstList() {
      this.$http.get(this.$api.CATELIST, { pid: 0 }).then((res) => {
        // console.log(res); //5
        this.firstlist = res.list ? res.list : [];
        // console.log(this.firstlist);
      });
    },
    //3、点击一级目录更新二级
    changeFn(first_cateid) {
      // console.log(first_cateid);
      this.$http.get(this.$api.CATELIST, { pid: first_cateid }).then((res) => {
        console.log(res); //二级分类信息
        this.secondlist = res.list ? res.list : [];
        // console.log(this.secondlist);
      });
    },
    //4、点击二级目录更新商品
    changeTwo() {
      // console.log(pid);
      this.$http
        .get(this.$api.GOODSLIST, {
          fid: this.formdata.first_cateid,
          sid: this.formdata.second_cateid,
        })
        .then((res) => {
          console.log(res.list); //二级分类信息
          this.thirdlist = res.list;
          /*   for (var item of res.list) {
          if (item.second_cateid == second_cateid) {
            // console.log(item);
            this.thirdlist.push(item);
          }
        } */

          // console.log(this.thirdlist);
        });
    },
    //5新增按钮
    addFn() {
      this.getFirstList();
      this.dialogVisible = true;
    },
    //6、点击关闭重置
    closeFn() {
      this.formdata = {
        title: "", //  限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //商品一级分类编号
        second_cateid: "", //商品二级分类编号
        goodsid: "", //商品编号
        status: true,
      };
      this.dateval = [];
      this.secondlist = [];
      this.thirdlist = [];
    },
    //7、编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.$http.get(this.$api.SECKINFO, { id }).then((res) => {
        console.log(res.list);
        if (res.code == 200) {
          this.formdata = {
            ...res.list,
          };
          this.formdata.id = id;
          this.getFirstList();
          //利用商品信息获取二级分类列表
          this.changeFn(this.formdata.first_cateid);
          this.changeTwo(
            this.formdata.first_cateid,
            this.formdata.second_cateid
          );
          this.dateval = [
            this.formdata.begintime.toString(),
            this.formdata.endtime.toString(),
          ];
          console.log(this.formdata.goodsid);
          console.log(this.thirdlist);
          /*  this.thirdlist = [];*/

          this.formdata.status = res.list.status == 1 ? true : false;
        }
      });
    },
    //8、 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.SECKDELETE, { id }).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$message.success("删除成功");
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    //8.5删除挽留事件
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
    //9、提交按钮
    submit() {
      // this.timeChange(); //将标准时间转为毫秒数作为参数
      let url = this.formdata.id ? this.$api.SECKEDIT : this.$api.SECKADD;
      this.formdata.status = this.formdata.status ? 1 : 2;

      this.$refs.seckill.validate((value) => {
        if (!value) {
          return false;
        }
        console.log(this.formdata);
        let str = this.$qs.stringify(this.formdata);
        this.$http.post(url, str).then((res) => {
          if (res.code == 200) {
            console.log(res);
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.msg);
          }
          this.dialogVisible = false;
          this.getList();
        });
      });
    },
    //打开对话框清空验证
    openFn() {
      this.$nextTick(() => {
        this.$refs.seckill.clearValidate();
      });
    },
  },
};
</script>