import axios from 'axios';

axios.defaults.headers['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8';

export default config =>
  axios({ ...config }).then(res => Promise.resolve(res.data));
