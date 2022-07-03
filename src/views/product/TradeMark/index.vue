<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="
        dialogFormVisible = true;
        tmForm = { tmName: '', logoUrl: '' };
      "
    >添加</el-button>
    <!--
      表格组件
      data:表格组件将来需要展示的数据--数组类型
    -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        prop="prop"
        label="序号"
        width="80px"
        align="center"
      />
      <el-table-column prop="tmName" label="品牌名称" width="width" />
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px">
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
          >修改</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      style="margin-top: 20px; text-align: center"
      :total="total"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      layout="prev,pager,next,jumper,->,sizes,total"
      @current-change="handleCurrentChange"
      @size-change="
        (page) => {
          limit = page;
          getPageList();
        }
      "
    />
    <!-- 对话框 -->
    <el-dialog :title="tmForm.id ?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <!-- form表单  model属性作用：把表单数据收集到那个对象的身上，将来表单验证，也需要这个属性-->
      <el-form ref="ruleForm" style="width: 80%" :model="tmForm" :rules="rules">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌logo" label-width="100px" prop="logoUrl">
          <!-- 这里收集数据，不能使用v-model
            action:设置图片上传的地址
            :on-success:可以检测到图片上传成功，当图片上传成功会执行一次
            :before-upload:可以在上传图片之前执行一次
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="addOrUpdateTradeMark(row)"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TradeMark',
  data() {
    return {
      // 代表的分页器第几页
      page: 1,
      // 当前页数展示数据条数
      limit: 3,
      // 总共数据条数
      total: 0,
      // 列表展示的数组
      list: [],
      // 对话框显示与隐藏控制的属性
      dialogFormVisible: false,
      // 收集添加品牌信息
      tmForm: {
        tmName: '',
        logoUrl: ''
      },
      // 表单验证规则
      rules: {
        tmName: [
          { required: true, message: '请输入品牌名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
        ],
        logoUrl: [
          { required: true, message: '请选择品牌图片', trigger: 'change' }
        ]
      }
    }
  },
  // 组件挂载完毕发请求
  mounted() {
    // 获取列表数据方法
    this.getPageList()
  },
  methods: {
    // 获取品牌列表的数据
    async getPageList() {
      // 解构出参数
      const { page, limit } = this
      // 获取品牌列表的接口
      const result = await this.$API.trademark.reqTradeMarkList(page, limit)
      if (result.code === 200) {
        // 分别是展示数据总条数与列表展示的数组
        this.total = result.data.total
        this.list = result.data.records
      }
    },
    handleCurrentChange(pager) {
      // 修改参数
      this.page = pager
      this.getPageList()
    },
    // 修改某个品牌
    updateTradeMark(row) {
      // row:当前用户选中的信息
      this.dialogFormVisible = true
      this.tmForm = { ...row }
      console.log(row)
      console.log(this.tmForm)
    },
    // 上传图片相关回调(success)
    handleAvatarSuccess(res, file) {
      // res:上传成功之后返回前端数据
      // file:上传成功之后服务器返回前端数据
      // 收集品牌图片数据
      this.tmForm.logoUrl = res.data
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 添加按钮（添加品牌|修改品牌）
    addOrUpdateTradeMark() {
      // 当全部验证字段通过，再去书写业务逻辑
      this.$refs.ruleForm.validate(async(success) => {
        if (success) {
          this.dialogFormVisible = false
          // 发请求
          const result = await this.$API.trademark.reqAddOrUpdateTrateMark(this.tmForm)
          if (result.code === 200) {
            // 弹出信息
            // 添加或者修改品牌成功之后，需要再次获取品牌列表
            this.$message({
              type: 'success',
              message: this.tmForm.id ? '修改品牌成功' : '添加品牌成功'
            })
            // this.$message(this.tmForm.id ? "修改品牌成功" : "添加品牌成功");
            // 添加或者修改品牌成功之后，需要再次获取品牌列表
            // 如果添加品牌，放最后，修改品牌应该停留在当前页
            this.getPageList()
            // this.getPageList(this.tmForm.id?this.page:1)
          }
        } else {
          return false
        }
      })
    },
    // 删除品牌操作
    deleteTradeMark(row) {
      // 弹框
      this.$confirm(`你确定删除${row.tmName}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        // 当用户点击确定时触发
        // 向服务器发请求
        const result = await this.$API.trademark.reqDeleteTradeMark(row.id)
        if (result.code === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
        // 再次获得品牌列表数据
        this.getPageList()
      }).catch(() => {
        // 取消触发
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
