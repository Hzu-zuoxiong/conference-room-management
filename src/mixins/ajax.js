import axios from 'axios';
import qs from 'qs';

axios.defaults.headers['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';
axios.interceptors.request.use(
  config => {
    if (config.method === 'POST') {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default config =>
  axios({ ...config }).then(res => Promise.resolve(res.data));
