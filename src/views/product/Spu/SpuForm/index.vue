<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input v-model="spu.spuName" placeholder="SPU名称" />
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spu.tmId" placeholder="请选择品牌" value="">
          <el-option v-for="(tm) in tradeMarkList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input v-model="spu.description" type="textarea" rows="4" placeholder="SPU描述" />
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-success="handlerSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select v-model="attrIdAndAttrName" :placeholder="`还有${unSelectSaleAttr.length}未选择`" value="">
          <el-option v-for="(unselect) in unSelectSaleAttr" :key="unselect.id" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" />
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
        <!-- table 展示的是当前spu属于自己的销售属性 -->
        <el-table style="width:100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="saleAttrName" label="属性名" width="width" />
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{row}">
              <!-- el-tag：展示已有属性值列表的数据  row.spuSaleAttrValueList.splice(index,1)-->
              <el-tag v-for="(tag,index) in row.spuSaleAttrValueList" :key="tag.id" closable :disable-transitions="false" @close="handleClose(row,index)">
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 以下结构与之前span与input切换类似 -->
              <el-input v-if="row.inputVisible" ref="saveTagInput" v-model="row.inputValue" class="input-new-tag" size="small" @blur="handleInputConfirm(row)" />
              <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="$emit('changeScene',{scene:0,flag:''});Object.assign(_data,$options.data())">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      // 存储SPU信息属性 通过文档看数据有哪些字段
      spu: {
        category3Id: 0,
        description: '',
        spuName: '',
        // 品牌id
        tmid: '',
        spuImageList: [],
        spuSaleAttrList: []
      },
      // 存储品牌的信息
      tradeMarkList: [],
      // 存储spu图片
      spuImageList: [],
      // 存储平台销售属性
      saleAttrList: [],
      // 收集未选择的销售属性
      attrIdAndAttrName: ''
    }
  },
  computed: {
  // 计算出还未选择的销售属性
    unSelectSaleAttr() {
    // 整个平台的销售属性一共三个：颜色，尺寸，版本 ---saleAttrList
    // 当前spu拥有的属于自己的销售属性spu.spuSaleAttrList
      const result = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name !== item1.saleAttrName
        })
      })
      return result
    }
  },
  methods: {
    // 照片墙图片上传成功的回调
    handlerSuccess(response, file, fileList) {
      // 收集图片的信息
      this.spuImageList = fileList
    },
    // 照片墙删除图片是触发
    handleRemove(file, fileList) {
      // 收集照片墙图片的数据
      this.spuImageList = fileList
    },
    // 照片墙图片预览的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 初始化SpuForm数据
    async initSpuData(spu) {
      // 获取spu信息的数据
      const spuResult = await this.$API.spu.reqSpu(spu.id)
      if (spuResult.code === 200) {
        this.spu = spuResult.data
      }
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取spu图片
      const spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
      if (spuImageResult.code === 200) {
        const listAttr = spuImageResult.data
        // 照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段 需要把服务器返回的数据进行修改
        listAttr.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = listAttr
      }
      // 获取平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    },
    // 添加新的销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(':')
      const newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [] }
      this.spu.spuSaleAttrList.push(newSaleAttr)
      this.attrIdAndAttrName = ''
    },
    // 属性值添加按钮的回调
    addSaleAttrValue(row) {
      this.$set(row, 'inputVisible', true)
      this.$set(row, 'inputValue', '')
    },
    // el-input失去焦点事件
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row
      if (inputValue.trim() === '') {
        this.$message('属性值不能为空')
        return
      }
      const result = row.spuSaleAttrValueList.some(item => {
        return item.saleAttrValueName === inputValue
      })
      console.log(result)
      if (result) {
        this.$message('属性值重复')
        return
      }
      const newSaleAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue }
      row.spuSaleAttrValueList.push(newSaleAttrValue)
      row.inputVisible = false
    },
    // 删除属性值tag事件
    handleClose(row, index) {
      console.log(row)
      row.spuSaleAttrValueList.splice(index, 1)
    },
    // 保存按钮的回调
    async addOrUpdateSpu() {
      // 整理参数
      this.spu.spuImageList = this.spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url
        }
      })
      // 发请求
      const result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
      if (result.code === 200) {
        this.$message({ type: 'success', message: '保存成功' })
        this.$emit('changeScene', { scene: 0, flag: this.spu.id ? '修改' : '添加' })
      }
      // 清理数据 object.assign:可以合并对象 组件实例this._data可以操作data中响应式数据 this.$options可以获取配置对象 配置对象的data函数执行，返回的响应式数据为空
      Object.assign(this._data, this.$options.data())
    },
    // 点击添加spu按钮的时候，发请求的函数
    async addSpuData(category3Id) {
      this.spu.category3Id = category3Id
      // 获取品牌的信息
      const tradeMarkResult = await this.$API.spu.reqTradeMarkList()
      if (tradeMarkResult.code === 200) {
        this.tradeMarkList = tradeMarkResult.data
      }
      // 获取平台销售属性
      const saleResult = await this.$API.spu.reqBaseSaleAttrList()
      if (saleResult.code === 200) {
        this.saleAttrList = saleResult.data
      }
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
