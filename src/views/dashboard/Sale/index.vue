<template>
  <el-card class="box-card" style="margin:10px 0">
    <div slot="header" class="clearfix">
      <!-- 头部左侧内容 -->
      <el-tabs v-model="activeName" class="tab">
        <el-tab-pane label="销售额" name="sale" />
        <el-tab-pane label="访问量" name="visite" />
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMounth">本月</span>
        <span @click="setYear">本年</span>
        <el-date-picker
          v-model="date"
          format="yyyy-MM-dd"
          class="date"
          size="mini"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </div>
    </div>
    <!-- 内容区域 -->
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <!-- 柱状图 -->
          <div ref="charts" class="charts" />
        </el-col>
        <!-- 门店列表 -->
        <el-col :span="6" class="list">
          <div>门店{{ title }}排名</div>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>肯德基</span>
              <span class="rvalue">325,814</span>
            </li>
            <li>
              <span class="rindex">2</span>
              <span>麦当劳</span>
              <span class="rvalue">299,531</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>肯德基</span>
              <span class="rvalue">258,153</span>
            </li>
            <li>
              <span class="pindex">4</span>
              <span>海底捞</span>
              <span class="rvalue">243,515</span>
            </li>
            <li>
              <span class="pindex">5</span>
              <span>西贝筱面村</span>
              <span class="rvalue">200.156</span>
            </li>
            <li>
              <span class="pindex">6</span>
              <span>汉堡王</span>
              <span class="rvalue">180,516</span>
            </li>
            <li>
              <span class="pindex">7</span>
              <span>真功夫</span>
              <span class="rvalue">150,948</span>
            </li>
            <li>
              <span class="pindex">8</span>
              <span>Subway</span>
              <span class="rvalue">140,645</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
export default {
  name: 'Sale',
  data() {
    return {
      // 存储销售额与访问量切换的信息
      activeName: 'sale',
      // 收集echarts实例
      myCharts: null,
      // 收集日历数据
      date: [],
      dataSale: [10, 52, 200, 334, 390, 330, 220, 110, 98, 163, 125, 44],
      dataVisit: [23, 45, 46, 81, 64, 48, 13, 6, 98, 45, 68, 12, 98, 55, 42, 32]
    }
  },
  computed: {
    // 标题
    title() {
      return this.activeName === 'sale' ? '销售额' : '访问量'
    }
  },
  watch: {
    // 监听title变化
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + '趋势'
        },
        series: [
          {
            name: 'Direct',
            type: this.activeName === 'sale' ? 'bar' : 'line',
            barWidth: '60%',
            data: this.activeName === 'sale' ? this.dataSale : this.dataVisit,
            color: this.activeName === 'sale' ? 'bisque' : 'skyblue'
          }
        ]
      })
    }
  },
  mounted() {
    this.myCharts = echarts.init(this.$refs.charts)
    this.myCharts.setOption({
      title: {
        text: '销售额趋势'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: this.dataSale,
          color: 'bisque'
        }
      ]
    })
  },
  methods: {
    // 本天
    setDay() {
      const day = dayjs().format('YYYY-MM-DD')
      this.date = [day, day]
    },
    // 本周
    setWeek() {
      const start = dayjs().day(1).format('YYYY-MM-DD')
      const end = dayjs().day(7).format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本月
    setMounth() {
      const start = dayjs().startOf('month').format('YYYY-MM-DD')
      const end = dayjs().endOf('month').format('YYYY-MM-DD')
      this.date = [start, end]
    },
    // 本年
    setYear() {
      const start = dayjs().startOf('year').format('YYYY-MM-DD')
      const end = dayjs().endOf('year').format('YYYY-MM-DD')
      this.date = [start, end]
    }
  }
}
</script>

<style scoped>
  .clearfix{
    display:flex;
    justify-content: space-between;
    position: relative;
  }
  .tab{
    width: 100%;
  }
  .right{
    position:absolute;
    right: 0;
  }
  .date{
    width:250px;
    margin:0 20px;
  }
  .right span{
    margin:0 10px
  }
  .charts{
    width:100%;
    height:300px;
  }
  .list{
    padding: 0;
  }
  ul{
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0;
  }
  ul li{
    height: 8%;
    margin: 10px 0;
  }
  .rindex{
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: black;
    color: white;
    text-align: center;
  }
  .rvalue{
    float: right;
  }
  .pindex{
    margin-left: 6px;
    margin-right: 6px;
  }
</style>
