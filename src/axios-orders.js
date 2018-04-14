import axios from 'axios';

const instance = axios.create({
// test  
// baseURL: 'https://react-my-burger-1ed07.firebaseio.com/'
    baseURL: 'http://challenge.monoqi.net/'

});

export default instance;