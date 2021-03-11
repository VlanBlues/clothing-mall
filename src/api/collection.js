import request from '@/utils/request'


export function addOrUpdateCollection(data) {
  return request({
    url: '/mall/collection/addOrUpdate',
    method: 'post',
    data
  })
}

export function getCollectionState(data) {
  return request({
    url: '/mall/collection/getCollectionState',
    method: 'get',
    params:data
  })
}

export function listByUserId(data) {
  return request({
    url: '/mall/collection/listByUserId',
    method: 'get',
    params:data
  })
}