<template>
  <div class="index-container">
    <!-- 分为24行，  gutter 间隙-->
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="row-item">
          <el-row class="title">
            <!-- 可以进行套，每一个都有24个 -->
            <el-col :span="24">商品总览</el-col>
          </el-row>
          <el-row class="number">
            <el-col :span="6"><h3>100</h3></el-col>
            <el-col :span="6"><h3>400</h3></el-col>
            <el-col :span="6"><h3>50</h3></el-col>
            <el-col :span="6"><h3>100</h3></el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="6"><span>已下架</span></el-col>
            <el-col :span="6"><span>已上架</span></el-col>
            <el-col :span="6"><span>库存紧张</span></el-col>
            <el-col :span="6"><span>全部商品</span></el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="row-item">
          <el-row class="title">
            <el-col :span="24">用户总览</el-col>
          </el-row>
          <el-row class="number">
            <el-col :span="6"><h3>100</h3></el-col>
            <el-col :span="6"><h3>200</h3></el-col>
            <el-col :span="6"><h3>1000</h3></el-col>
            <el-col :span="6"><h3>5000</h3></el-col>
          </el-row>
          <el-row class="list">
            <el-col :span="6"><span>今日新增</span></el-col>
            <el-col :span="6"><span>昨日新增</span></el-col>
            <el-col :span="6"><span>本月新增</span></el-col>
            <el-col :span="6"><span>会员总数</span></el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="main" style="width: 600px; height: 400px"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import echarts from "echarts";
export default {
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
};
</script>
<style lang="less" >
.index-container {
  margin: 0 auto;
  width: 80%;
  text-align: center;
  .row-item {
    border: 1px solid #000;
  }
  .title {
    background-color: aliceblue;
    height: 50px;
    line-height: 50px;
    font-size: 18px;
    font-weight: bold;
  }
  .number {
    margin-top: 30px;
    line-height: 50px;
    font-size: 20px;
    font-weight: bold;
    color: tomato;
  }
  .list {
    font-size: 18px;
    margin-bottom: 40px;
  }
  #main {
    margin-top: 20px;
  }
}
</style>