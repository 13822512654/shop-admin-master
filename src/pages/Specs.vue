<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>规格列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-button type="primary" @click="addFn">添加</el-button>

    <el-table :data="specslist">
      <el-table-column
        label="属性名称"
        prop="specsname"
        width="150"
      ></el-table-column>

      <!-- 属性标签  prop="attrs"-->
      <el-table-column label="属性值" width="180">
        <template slot-scope="scope"
          ><!-- 获取到row的数据 -->
          <!-- 遍历行的属性，生成多个属性标签 -->
          <el-tag v-for="(item, index) in scope.row.attrs" :key="index">{{
            item
          }}</el-tag>
        </template>
      </el-table-column>

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
          <el-button
            size="mini"
            @click="handleDelete(scope.row.id)"
            type="danger"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="'规格' + tip"
      @close="closeFn"
    >
      <!-- 表单 -->
      <el-form
        label-width="100px"
        :model="formdata"
        ref="specsform"
        :rules="rules"
      >
        <el-form-item prop="specsname" label="属性名称">
          <el-input v-model="formdata.specsname"></el-input>
        </el-form-item>

        <!-- 属性值 -->
        <el-form-item label="属性值">
          <div v-for="(item, index) in attrsArr" :key="index">
            <el-input v-model="item.value" :style="{ width: '60%' }"></el-input>

            <el-button
              dark
              type="primary"
              v-if="index == 0"
              @click="addAttr(index)"
              >新增属性值</el-button
            >
            <el-button dark type="danger" v-else @click="delAttr(index)"
              >删除</el-button
            >
          </div>
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
import { createNamespacedHelpers } from "vuex";
export default {
  data() {
    return {
      tip: "",
      specslist: [], //表格数据
      dialogVisible: false, //对话框显示状态

      attrsArr: [{ value: "" }], //属性值数组,后台要求提交的是字符串，所以提交的时候还要对它进行操作，转成对象后再赋值给this.formdata.attrs
      //表格绑定数据
      formdata: {
        attrs: "",
        specsname: "",
        status: true,
      },
      //验证规则
      rules: {
        specsname: [
          {
            required: true,
            message: "请填写属性名称",
            trigger: "change",
          },
        ],
      },
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    //1、获取角色管理数据渲染表格
    async getList() {
      //如果不传参list为null,page/size,根据接口说明里查看
      let res = await this.$http.get(this.$api.SPECSLIST).then((res) => {
        if (res.code == 200) {
          //console.log(res);
          this.specslist = res.list ? res.list : [];
          console.log(this.specslist);
        } else {
          this.$message.error(res.msg);
        }
      });
    },

    //关闭重置
    closeFn() {
      this.attrsArr = [];
      this.formdata = {
        attrs: "",
        specsname: "",
        status: true,
      };
    },

    //点击添加按钮打开对话框
    addFn() {
      this.tip = "添加";
      this.dialogVisible = true;
    },

    // 提交按钮
    submit() {
      this.formdata.status = this.formdata.status ? 1 : 2;

      //将数组套对象转为字符串,后台要求提交方式
      this.formdata.attrs = this.attrsArr.map((item) => item.value).join(",");

      let url = this.formdata.id ? this.$api.SPECSEDIT : this.$api.SPECSADD;
      let str = this.$qs.stringify(this.formdata);
      this.$refs.specsform.validate((value) => {
        if (!value) {
          return false;
        }
        this.$http.post(url, str).then((res) => {
          //表单的输入验证

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

    // 编辑按钮
    editFn(id) {
      this.dialogVisible = true;
      this.tip = "修改";
      this.$http.get(this.$api.SPECSINFO, { id }).then((res) => {
        console.log(res.list[0]);
        if (res.code == 200) {
          this.formdata = {
            ...res.list[0],
          };

          this.formdata.status = res.list[0].status == 1 ? true : false;
          //数组转数组套对象
          this.attrsArr = res.list[0].attrs.map((item) => ({ value: item }));
          // console.log(this.formdata);
        }
      });
    },
    //新增属性
    addAttr() {
      this.attrsArr.push({ value: "" });
    },
    //删除属性
    delAttr(i) {
      this.attrsArr.splice(i, 1);
    },

    // 删除按钮
    deleteFn(id) {
      this.$http.post(this.$api.SPECSDELETE, { id }).then((res) => {
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

    /*  //打开对话框清空验证
    openFn() {
      this.$nextTick(() => {
        this.$refs.specsform.clearValidate();
      });
    }, */
  },
};
</script>
<style lang="less">
.attrs {
  width: 250px;
  display: inline-block;
}
</style>