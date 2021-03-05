import request from '@/utils/request'


export function addOrder(data) {
  return request({
    url: '/mall/order/add',
    method: 'post',
    data
  })
}

export function listByUser(data) {
  return request({
    url: '/mall/order/listByUser',
    method: 'get',
    params:data
  })
}
