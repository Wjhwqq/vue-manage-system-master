<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect :show="!isShowTable" @getCategoryId="getCategoryId" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
        <!-- 表格:展示平台属性 -->
        <el-table style="width:100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center" />
          <el-table-column prop="attrName" label="属性名称" width="150" />
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{row}">
              <el-tag v-for="(attrValue) in row.attrValueList" :key="attrValue.id" type="success" style="margin: 0px 20px;">{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{row}">
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)" />
              <!-- <el-button type="danger" icon="el-icon-delete" size="mini" /> -->
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或修改属性的结构 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName" placeholder="请输入属性名" />
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
        <el-table border style="width:100%;margin: 20px 0px;" :data="attrInfo.attrValueList">
          <el-table-column type="index" align="center" label="序号" width="80" />
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row,$index}">
              <!-- input 与 span 来回切换 -->
              <el-input v-if="row.flag" :ref="$index" v-model="row.valueName" placeholder="请输入属性值名称" size="mini" @blur="toLook(row)" @keyup.native.enter="toLook(row)" />
              <span v-else style="display:block" @click="toEdit(row,$index)">{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
              <!-- 气泡确认框 -->
              <el-popconfirm :title="`确定删除${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
        <el-button @click="isShowTable=true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 按需引入lodash当中的深拷贝
import cloneDeep from 'lodash/cloneDeep'
import CategorySelect from '@/components/CategorySelect/index.vue'
export default {
  name: 'Attr',
  components: { CategorySelect },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      // 接受平台属性字段
      attrList: [],
      // 控制table显示与隐藏
      isShowTable: true,
      // 收集新增属性|修改属性的使用的
      attrInfo: {
        attrName: '', // 属性名
        attrValueList: [// 属性值
          // {
          //   // attrId:0,//相应属性名的id
          //   // valueName:""
          // },
        ],
        categoryId: 0, // 三级分类的id
        categoryLevel: 3// 区分级别
      }
    }
  },
  methods: {
    // 获取平台属性的数据
    async getAttrList() {
      // 获取分类的id
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
        console.log(this.attrList)
      }
    },
    // 传数据
    getCategoryId({ categoryId, level }) {
      // 区分三级分类相应的id,以及父组件进行存储
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
        this.getAttrList()
      }
    },
    // 添加属性值回调
    addAttrValue() {
      // 向属性值的数组里面添加元素
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, // 对于修改某一个属性的时候，可以在已有的属性值基础上新增新的属性值
        valueName: '',
        flag: true// 用于切换查看模式与编辑模式,每一个属性值可以控制自己的模式切换
      })
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus()
      })
    },
    // 添加属性按钮回调
    addAttr() {
      this.isShowTable = false
      // 清除数据
      this.attrInfo = {
        attrName: '', // 属性名
        attrValueList: [],
        categoryId: this.category3Id, // 三级分类的id
        categoryLevel: 3// 区分级别
      }
    },
    // 修改某一个属性
    updateAttr(row) {
      this.isShowTable = false
      // 将选中的属性赋值给arrtInfo
      // 由于数据结构当中存在对象里面套着数组，数组里面有套对象，需要使用深拷贝解决这类问题
      this.attrInfo = cloneDeep(row)
      // 在修改某一个属性的时候，将相应的属性值添加上flag标记
      this.attrInfo.attrValueList.forEach(item => {
        this.$set(item, 'flag', false)
      })
    },
    // 失去焦点事件
    toLook(row) {
      if (row.valueName.trim() === '') {
        this.$message('不能为空！')
        return
      }
      const isTrue = this.attrInfo.attrValueList.some(item => {
        if (row !== item) {
          return row.valueName === item.valueName
        }
      })
      if (isTrue) return
      row.flag = false
    },
    // 点击span的回调,变为编辑模式
    toEdit(row, index) {
      row.flag = true
      // 获取input节点,实现自动聚焦
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },
    // 气泡确认框确定按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1)
    },
    // 保存按钮操作
    async addOrUpdateAttr() {
      // 整理参数
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item) => {
        // 过滤掉属性值不是空的
        if (item.valueName !== '') {
          // 删除掉flag
          delete item.flag
          return true
        }
      })
      try {
        // 发请求
        await this.$API.attr.reqAddAttr(this.attrInfo)
        this.isShowTable = true
        this.$message({ type: 'success', message: '保存成功' })
        // 保存成功以后需要再次获取平台属性进行展示
        this.getAttrList()
      } catch (error) {
        this.$message({ type: 'warning', message: '保存失败' })
      }
    }
  }
}
</script>

<style>

</style>
