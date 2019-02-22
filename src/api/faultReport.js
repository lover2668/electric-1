import axios from '@/libs/api.request'
// 获取客户列表
export const getFaultList = (data) => {
    const MaxResultCount = data.maxResultCount
    const SkipCount = data.skipCount
    const Filter = data.filter

    return axios.request({
        url: 'services_app_Fault_GetPaged',
        params: {
            MaxResultCount,
            SkipCount,
            Filter
        },
        method: 'get'
    })
}
// 获取客户列表
export const getEchartData = () => {
    return axios.request({
        url: 'get_echart_data',
        method: 'get'
    })
}
// 新增客户
export const addCustomer = (Customer) => {
    const data = Customer
    return axios.request({
        url: 'services/app/Customer/Create',
        data,
        method: 'post'
    })
}
// 删除客户
export const delCustomer = (id) => {
    return axios.request({
        url: 'services/app/Customer/Delete',
        params: {
            id
        },
        method: 'delete'
    })
}
// 修改客户
export const updataCustomer = (Customer) => {
    const data = Customer
    return axios.request({
        url: 'services/app/Customer/Update',
        data,
        method: 'put'
    })
}
