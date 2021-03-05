import request from '@/utils/request'

export function listByCategory() {
  return request({
    url: '/mall/goods/listByCategory',
    method: 'get'
  })
}

export function listByCategoryId(data) {
  return request({
    url: '/mall/goods/listByCategoryId',
    method: 'get',
    params:data
  })
}

export function listBySearch(data) {
  return request({
    url: '/mall/goods/listBySearch',
    method: 'get',
    params:data
  })
}

export function getByGoodsId(data) {
  return request({
    url: '/mall/goods/getByGoodsId',
    method: 'get',
    params:data
  })
}

export function addGoods(data) {
  return request({
    url: '/mall/goods/add',
    method: 'post',
    data
  })
}
