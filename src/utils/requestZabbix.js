import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import { VueAxios } from './axios'
import qs from 'qs'
import defaultSettings from '@/config/defaultSettings'

axios.defaults.withCredentials = false; //让ajax不携带cookie

const isProd = process.env.NODE_ENV === 'production'

const loginOut = (c_url) => {
    const baseurl = window.API_ROOT.split('/')[0]
    window.location.href = baseurl + `/login/?c_url=${c_url}`
}

// 创建 axios 实例
const requestZabbix = axios.create({
    // API 请求的默认前缀
    baseURL: defaultSettings.zabbixUrl,
    // timeout: 15000 // 请求超时时间
})


// 异常拦截处理器
const errorHandler = (error) => {
    if (error.response) {
        const statusText = error.response.statusText
        notification.error({
            message: '错误',
            description: statusText
        })
    }
    return Promise.reject(error)
}

// request interceptor

requestZabbix.interceptors.request.use(config => {
    if (config.method.toLowerCase() == 'get') {
        //get请求 序列化数组参数
        config.paramsSerializer = (params) => {
            return qs.stringify(params, { arrayFormat: 'repeat' })
        }
    }
    return config
}, errorHandler)

// response interceptor
requestZabbix.interceptors.response.use(null,err => {
    if (err && err.response && err.response.status == 403) {
        message.warning({
            content: err.response
        })
    }
    return Promise.reject('expectations error')
}, errorHandler)

export default requestZabbix
