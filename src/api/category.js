import request from '@/utils/request'

export function listCategory() {
  return request({
    url: '/mall/category/list',
    method: 'get'
  })
}