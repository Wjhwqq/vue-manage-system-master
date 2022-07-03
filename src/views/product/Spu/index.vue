<template>
  <div>
    <el-card style="margin:20px 0">
      <CategorySelect :show="scene!=0" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <!-- 底部这里将来是有三部分进行切换 -->
      <div v-show="scene==0">
        <!-- 展示spu列表的解构 -->
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width:100%" border :data="records">
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column prop="spuName" align="center" label="SPU名称" width="width" />
          <el-table-column prop="description" align="center" label="SPU描述" width="width" />
          <el-table-column prop="prop" align="center" label="操作" width="width">
            <template slot-scope="{row}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加sku" @click="addSku(row)" />
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改spu" @click="updateSpu(row)" />
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部列表" @click="handler(row)" />
              <el-popconfirm title="确定要删除吗？" @onConfirm="deleteSpu(row)">
                <hint-button slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除spu" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align: center"
          :total="total"
          :current-page="page"
          :page-size="limit"
          :page-sizes="[3, 5, 10]"
          layout="prev,pager,next,jumper,->,sizes,total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        />
      </div>
      <SpuForm v-show="scene==1" ref="spu" @changeScene="changeScene" />
      <SkuForm v-show="scene==2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <!-- table展示 -->
      <el-table v-loading="loading" :data="skuList" border style="'width:100%'">
        <el-table-column prop="skuName" label="名称" />
        <el-table-column prop="price" label="价格" />
        <el-table-column prop="weight" label="重量" />
        <el-table-column label="默认图片">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
// 引入子组件
import SpuForm from './SpuForm'
import SkuForm from './SkuForm'
export default {
  name: 'Spu',
  components: {
    SpuForm, SkuForm
  },
  data() {
    return {
      // 分别是分类的id
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 分页器当前第几页
      page: 1,
      // 每一页展示多少数据
      limit: 3,
      // spu列表的数据
      records: [],
      // 分页器一共要展示的条数
      total: 0,
      // 代表切换场景 0代表展示spu列表数据 1添加spu|修改spu 2添加sku
      scene: 0,
      // 控制对话框的显示与隐藏
      dialogTableVisible: false,
      // 保存spu信息
      spu: {},
      // 存储的是sku列表的数组
      skuList: [],
      loading: true
    }
  },
  methods: {
    // 获取spu列表数据的方法
    async getSpuList(pages = 1) {
      this.page = pages
      const { page, limit, category3Id } = this
      // 携带三个参数 page 第几页 limit 每一页展示多少数据 三级分类id
      const result = await this.$API.spu.reqSpuList(page, limit, category3Id)
      const { total, records } = result.data
      if (result.code === 200) {
        this.total = total
        this.records = records
      }
    },
    // 三级联动的自定义事件，吧子组件的相应的id传递给父组件
    getCategoryId({ categoryId, level }) {
      // categoryId:获取到一二三级分类的id
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
      } else {
        this.category3Id = categoryId
        // 发请求
        this.getSpuList()
      }
    },
    // 当分页器的某一页展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit
      this.getSpuList()
    },
    // 添加spu按钮的回调
    addSpu() {
      this.scene = 1
      // 通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id)
    },
    // 修改某一个spu
    updateSpu(row) {
      this.scene = 1
      // 获取子组件SpuForm
      this.$refs.spu.initSpuData(row)
    },
    // 自定义事件的回调(SpuForm)
    changeScene({ scene, flag }) {
      this.scene = scene
      // flag来区分保存按钮是添加还是修改
      if (flag === '修改') {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
    },
    // 删除spu按钮的回调
    async deleteSpu(row) {
      const result = await this.$API.spu.reqDeleteSpu(row.id)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '删除成功' })
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1)
      }
    },
    // 添加sku按钮的回调
    addSku(row) {
      this.scene = 2
      this.$refs.sku.getData(this.category1Id, this.category2Id, row)
    },
    // skuForm通知父组件修改场景
    changeScenes(scene) {
      this.scene = scene
    },
    // 查看sku列表按钮的回调
    async handler(spu) {
      this.dialogTableVisible = true
      this.spu = spu
      // 获取sku列表的数据进行展示
      const result = await this.$API.spu.reqSkuList(spu.id)
      if (result.code === 200) {
        this.skuList = result.data
        this.loading = false
      }
    },
    // 关闭对话框的回调
    close(done) {
      this.loading = true
      this.skuList = []
      done()
    }
  }
}
</script>

<style>

</style>
