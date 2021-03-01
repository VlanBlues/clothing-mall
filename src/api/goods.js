import request from '@/utils/request'

export function listByCategory() {
  return request({
    url: '/mall/goods/listByCategory',
    method: 'get'
  })
}

export function getByGoodsId(data) {
  return request({
    url: '/mall/goods/getByGoodsId',
    method: 'get',
    params:data
  })
}
