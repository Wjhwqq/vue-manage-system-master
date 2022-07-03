<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="sku名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input v-model="skuInfo.price" placeholder="价格(元)" type="number" />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)纯数字" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="(attr) in attrInfoList" :key="attr.id" :label="attr.attrName">
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(attrValue) in attr.attrValueList" :key="attrValue.id" :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item v-for="(saleAttr) in spuSaleAttrList" :key="saleAttr.id" :label="saleAttr.saleAttrName">
            <el-select v-model="saleAttr.attrIdAndValueId" placeholder="请选择">
              <el-option v-for="(saleAttrValue) in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id" :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border style="width:100%" :data="spuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" prop="prop" />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" alt="" style="width:100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button v-if="row.isDefault===0" type="primary" @click="changeDefault(row)">设置默认</el-button>
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'SkuForm',
  data() {
    return {
      // 存储图片的信息
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 父组件给予的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 通过数据双向绑定收集的
        skuName: '',
        price: 0,
        weight: '',
        skuDesc: '',
        // 默认图片
        skuDefaultImg: '',
        // 收集图片
        skuImageList: [],
        // 平台属性
        skuAttrValueList: [
          // {
          //   attrId:0,
          //   valueId:0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: []
      },
      spu: {},
      // 收集图片的数据字段
      imageList: []
    }
  },
  methods: {
    // 获取SkuForm数据
    async getData(category1Id, category2Id, spu) {
      // 收集父组件给予的数据
      this.skuInfo.category3Id = spu.category3Id
      this.skuInfo.spuId = spu.id
      this.skuInfo.tmId = spu.tmId
      this.spu = spu
      // 获取图片的数据
      const result = await this.$API.spu.reqSpuImageList(spu.id)
      if (result.code === 200) {
        const list = result.data
        list.forEach(item => {
          item.isDefault = 0
        })
        this.spuImageList = list
      }
      // 获取销售属性的数据
      const result1 = await this.$API.spu.reqSpuSaleAttrList(spu.id)
      if (result1.code === 200) {
        this.spuSaleAttrList = result1.data
      }
      // 获取平台属性的数据
      const result2 = await this.$API.spu.reqAttrInfoList(category1Id, category2Id, spu.category3Id)
      if (result2.code === 200) {
        this.attrInfoList = result2.data
      }
    },
    // table表格复选框按钮事件
    handleSelectionChange(params) {
      // 获取到用户选中图片的信息数据
      this.imageList = params
    },
    // 设置默认事件
    changeDefault(row) {
      this.spuImageList.forEach(item => {
        item.isDefault = 0
      })
      row.isDefault = 1
      this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击取消按钮事件
    cancel() {
      this.$emit('changeScenes', 0)
      // 清除数据
      Object.assign(this._data, this.$options.data())
    },
    // 保存按钮的事件
    async save() {
      const { attrInfoList, skuInfo, spuSaleAttrList, imageList } = this
      // 整理平台属性
      // 方法1
      // let arr=[]
      // attrInfoList.forEach(item=>{
      //   if(item.attrIdAndValueId){
      //     const[attrId,valueId]=item.attrIdAndValueId.split(':')
      //     let obj={attrId,valueId}
      //     arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList=arr
      // 方法二
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(':')
          prev.push({ attrId, valueId })
        }
        return prev
      }, [])
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.attrIdAndValueId.split(':')
          prev.push({ saleAttrId, saleAttrValueId })
        }
        return prev
      }, [])
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddSku(skuInfo)
      if (result.code === 200) {
        console.log(result)
        this.$message({ type: 'success', message: '添加sku成功' })
        this.$emit('changeScenes', 0)
      }
    }
  }
}
</script>

<style>

</style>
