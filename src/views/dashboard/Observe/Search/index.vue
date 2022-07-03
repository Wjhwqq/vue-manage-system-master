<template>
  <el-card>
    <div slot="header" class="header">
      <div class="search-header">
        <span>线上热门搜索</span>
        <el-dropdown>
          <span>
            <i class="el-icon-more" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-row :gutter="10">
        <el-col :span="12"><LineCharts /></el-col>
        <el-col :span="12"><LineCharts /></el-col>
      </el-row>
      <!-- table表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="date"
          label="排名"
          type="index"
          width="80"
        />
        <el-table-column
          prop="name"
          label="搜索关键字"

          width="180"
        />
        <el-table-column
          prop="address"
          label="用户数"
          sortable
        />
        <el-table-column
          prop="address"
          label="周涨幅"
          sortable
        />
      </el-table>
      <!-- 分页器 -->
      <el-pagination :total="1000" :current-page="1" layout="prev,pager,next" class="pagination" />
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  name: 'Search',
  components: {
    LineCharts
  },
  data() {
    return {
      tableData: []
    }
  }
}
</script>

<style scoped>
  .search-header{
    display: flex;
    justify-content: space-between;
  }
  .header{
    border-bottom: 1px solid #eee;
    padding: 5px 0;
  }
  .pagination{
    float: right;
  }
</style>
