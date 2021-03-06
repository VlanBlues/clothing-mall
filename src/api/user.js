import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/mall/user/login',
    method: 'post',
    data
  })
}

export function register(data) {
  return request({
    url: '/mall/user/addOrUpdate',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
export function uploadFile(data) {
  return request({
    url: '/mall/img/upload2',
    method: 'post',
    data
  })
}

export function addOrUpdate(data) {
  return request({
    url: '/mall/user/update',
    method: 'post',
    data
  })
}
