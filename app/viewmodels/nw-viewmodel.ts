/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {NwRepository} from "~/repositorys/nw-repository";
import {NuxtWidget} from "~/models/nuxt-widget";

class NwData {
    dataList: NuxtWidget[]
    err: string


    constructor(dataList: NuxtWidget[], err: string) {
        this.dataList = dataList;
        this.err = err;
    }
}

class NwViewModel {
    private data: NwData;
    private repository: NwRepository

    constructor(data: NwData) {
        this.data = data;
        this.repository = new NwRepository();
    }

    async getWidgets() {
        this.data.err = '';
        const res = await this.repository.getNuxtWidgets();
        if (res.code === 1) {
            this.data.dataList.length = 0;
            this.data.dataList.push(...(res.data as Array<NuxtWidget>));
        } else {
            this.data.err = res.message;
        }
    }
}

export {
    NwViewModel,
    NwData
}