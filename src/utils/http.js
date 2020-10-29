import axios from 'axios'
axios.defaults.baseURL = ''
axios.defaults.timeout = 3000

//拦截器请求与响应
axios.interceptors.request.use(config => {
  // Do something before request is sent
  let token = localStorage.getItem('token') ? localStorage.getItem('token') : '';
  /*  let info = localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : '' */
  //请求头添加token
  config.headers.Authorization = token;
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

axios.interceptors.response.use(response => {
  // Do something before response is sent
  // console.log(response.data)
  return response.data;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});

//自己封装post，get函数
/* 封装的get请求方法
@url:请求路径
@parmas：Object|string 请求参数
：promise
*/
function get(url, params = {}) {
  return new Promise((res, rej) => {
    axios({
      method: 'get',
      url,
      params
    }).then(data => {
      res(data)
    }).catch(err => {
      rej(err)
    })
  })
}
function post(url, data = {}) {
  return new Promise((res, rej) => {
    axios({
      method: 'post',
      url,
      data
    }).then(data => {
      res(data)
    }).catch(err => {
      rej(err)
    })
  })
}

// 封装包含上传内容的方法
// @url:上传地址
// @data:上传数据
function upload(url, data = {}) {
  return new Promise((res, rej) => {
    let form = new FormData();
    for (var key in data) {
      // append:向表单实例添加数据的方法
      // key: 数据的名称
      // value: 数据的值
      form.append(key, data[key]);
    }
    axios({
      method: 'post',
      url,
      data: form,
      headers: {
        //上传文件要改默认的格式，让服务器知道提交的是表单数据
        "Content-Type": "multipart/form-data"
      }
    }).then(data => {
      res(data)
    }).catch(err => {
      rej(err)
    })
  })
}
export default {
  get,
  post,
  upload
}