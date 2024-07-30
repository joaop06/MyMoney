import axios from 'axios';
import MMKV from './MMKV/MMKV';

const Axios = axios.create({
    timeout: 10000,
    baseURL: 'https://api.test.com',
    headers: { 'Content-Type': 'application/json', },
})

Axios.interceptors.request.use(
    (config) => {
        // const token = MMKV.find('access_token')


    }
)


export default Axios;