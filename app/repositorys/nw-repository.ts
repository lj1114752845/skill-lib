/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {ResultData} from "~/repositorys/http";
import {Http} from "./http";

class NwRepository {
    async getNuxtWidgets() {
        let response;
        try {
            response = await Http.request('nuxtwidgets', {
                method: 'get'
            });
            if (response.ok) {
                return await response.json() as ResultData;
            } else {
                return new ResultData(0, '', `请求服务器失败返回：${String(response.status)}`);
            }
        } catch (e) {
            return new ResultData(0, '', `请求服务器失败`);
        }
    }
}

export {
    NwRepository
}