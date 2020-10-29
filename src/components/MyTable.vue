<template>
  <!-- 2、渲染 表格列表
    :data 渲染需要的数据
    :tree-props 树形数据配置 树形懒加载
       children ：'后台返回的子数据key的名称'
       hasChildren:代表拥有子菜单
    -->
  <el-table
    :data="menulist"
    style="width: 100%"
    row-key="id"
    :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
  >
    <!-- 
        label :列表头文字
        prop: 这一列关联的数据名称，key (只是显示纯文本用)
       -->
    <el-table-column label="名称" width="180" prop="title"> </el-table-column>
    <el-table-column label="图标" width="180">
      <!-- 作用域插槽 定义样式的时候使用
          scope ：代表包含每一行的数据对象
          row:行
          {{scope.row.icon}}
        -->
      <template slot-scope="scope">
        <i :class="scope.row.icon"></i>
      </template>
    </el-table-column>

    <el-table-column label="类型" width="180">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.type == 1">目录</el-tag>
        <el-tag type="success" v-else-if="scope.row.type == 2">菜单</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="菜单URL" width="150" prop="url"> </el-table-column>

    <el-table-column label="操作">
      <template slot-scope="scope">
        <!-- 自定义事件传到父组件 -->
        <el-button size="mini" @click="$emit('edit', scope.row)"
          >编辑</el-button
        >
        <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)"
          >删除</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    menulist: {
      type: Array,
    },
  },
  methods: {
    //和后台交互删除指定行数据
    async deleteMenu(id) {
      let res = await this.$http.post(
        this.$api.MENUDELETE,
        this.$qs.stringify({ id })
      );
      if (res.code == 200) {
        //console.log(res); //返回删除后的数据
        //但是没有重新渲染新数据，要刷新才能出来，所以要把新数据赋值给meneliist重新渲染
        //要向父组件通信，把删除后的值传给父组件重新渲染
        this.$emit("changeMenu", res.list);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      } else {
        this.$message.error(res.msg);
      }
    },
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
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {},
};
</script>