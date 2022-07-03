// 这个模块主要获取的是品牌管理的数据模块
import request from '@/utils/request'
// 获取品牌列表接口
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' })
// 处理添加品牌
// 新增品牌:/admin/product/baseTrademark/save    post  携带两个参数： 品牌名称，品牌logo

// 修改品牌: /admin/product/baseTrademark/update put 携带参数：id,name,logo

export const reqAddOrUpdateTrateMark = (tradeMark) => {
  // 带给服务器数据携带ID---修改
  if (tradeMark.id) {
    return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
  } else {
    // 新增品牌
    return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
  }
}

// 删除品牌 /admin/product/baseTrademark/remove/{id} delete
export const reqDeleteTradeMark = (id) => request({ url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete' })
