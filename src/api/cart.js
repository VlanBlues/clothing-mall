import request from '@/utils/request'

export function listByUserId(data) {
  return request({
    url: '/mall/cart/listByUserId',
    method: 'get',
    params:data
  })
}

export function addCart(data) {
  return request({
    url: '/mall/cart/add',
    method: 'post',
    data
  })
}
export function updateCart(data) {
  return request({
    url: '/mall/cart/update',
    method: 'post',
    data
  })
}