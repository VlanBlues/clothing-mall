import request from '@/utils/request'


export function addOrUpdateCollection(data) {
  return request({
    url: '/mall/collection/addOrUpdate',
    method: 'post',
    data
  })
}