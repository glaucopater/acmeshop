import axios from 'axios';

const instance = axios.create({
// test   
    baseURL: 'http://challenge.monoqi.net/'

});

export default instance;