<template>
  <div>
    <el-row :gutter="10">
      <!-- 第一个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="总销售额" count="￥126560">
            <template slot="charts">
              <span>周同比&nbsp;&nbsp;56.67%&nbsp;<svg t="1656804217188" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3958" width="16" height="16"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="3959" /></svg>&nbsp;</span>
              <span>日同比&nbsp;&nbsp;29.96%&nbsp;<svg t="1656804383626" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5210" width="16" height="16"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#1afa29" p-id="5211" /></svg>&nbsp;</span>
            </template>
            <template slot="footer">
              <span>日销售额￥12423</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第二个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="访问量" count="88460">
            <template slot="charts">
              <LineChart />
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第三个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="支付笔数" count="88460">
            <template slot="charts">
              <BarChart />
            </template>
            <template slot="footer">
              <span>转换率66%</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <!-- 第四个card -->
      <el-col :span="6">
        <el-card>
          <Detail title="运营活动效果" count="78%">
            <template slot="charts">
              <ProgressChart />
            </template>
            <template slot="footer">
              <span>周同比&nbsp;&nbsp;12%&nbsp;<svg t="1656804217188" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3958" width="16" height="16"><path d="M512 405.333333L298.666667 618.666667h426.666666L512 405.333333z" fill="#d81e06" p-id="3959" /></svg>&nbsp;</span>
              <span>日同比&nbsp;&nbsp;10%&nbsp;<svg t="1656804383626" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5210" width="16" height="16"><path d="M512 618.666667L298.666667 405.333333h426.666666L512 618.666667z" fill="#1afa29" p-id="5211" /></svg>&nbsp;</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Detail from './Detail'
import LineChart from './LineChart'
import BarChart from './BarChart'
import ProgressChart from './ProgressChart'
export default {
  name: 'Card',
  components: {
    Detail, LineChart, BarChart, ProgressChart
  }
}
</script>

<style>

</style>
