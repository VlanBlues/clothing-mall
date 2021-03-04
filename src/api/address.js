import request from '@/utils/request'

export function getAddressByUserId(data) {
  return request({
    url: '/mall/address/listByUserId',
    method: 'get',
    params:data
  })
}


export function addAddress(data) {
  return request({
    url: '/mall/address/add',
    method: 'post',
    data
  })
}
