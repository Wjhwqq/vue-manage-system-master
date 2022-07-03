<template>
  <div ref="charts" class="charts" />
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ProgressChart',
  mounted() {
    const lineCharts = echarts.init(this.$refs.charts)
    lineCharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100
      },
      yAxis: {
        show: false,
        type: 'category'
      },
      series: [
        {
          smooth: true,
          type: 'bar',
          data: [78],
          barWidth: 10,
          color: 'yellowgreen',
          showBackground: true,
          backgroundStyle: {
            color: '#d9d9d9'
          }
        }
      ],
      label: {
        show: true,
        formatter: '|',
        position: 'right'
      },
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    })
  }
}
</script>

<style scoped>
.charts{
  width:100%;
  height: 100%;
}
</style>
