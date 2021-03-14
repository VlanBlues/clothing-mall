import request from '@/utils/request'


export function addComment(data) {
  return request({
    url: '/mall/comment/add',
    method: 'get',
    params:data
  })
}

export function listComment(data) {
  return request({
    url: '/mall/comment/list',
    method: 'get',
    params:data
  })
}
