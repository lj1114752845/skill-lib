/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
class Http {
    //static HOST = import.meta.env.DEV ? 'localhost' : '8.137.122.38';
    static HOST = '8.137.122.38';
    static PORT = 80;
    static WS_PORT = 80;
    static BASE_URL = `http://${Http.HOST}:${Http.PORT}`;

    static request(url: string, opt: RequestInit) {
        let r = (url.startsWith('http://') || url.startsWith('https://')) ? url : `${Http.BASE_URL}/${url}`;
        return fetch(r, opt);
    }
}

class ResultData {
    code: 0 | 1;
    data: any;
    message: string;


    constructor(code: 0 | 1, data: any, message: string) {
        this.code = code;
        this.data = data;
        this.message = message;
    }
}

export {
    Http,
    ResultData
}