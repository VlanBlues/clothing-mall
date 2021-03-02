import request from '@/utils/request'

export function listByUserId(data) {
  return request({
    url: '/mall/cart/listByUserId',
    method: 'get',
    params:data
  })
}