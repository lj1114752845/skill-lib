/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import type {Intv} from "~/models/intv";
import {JsRepository} from "~/repositorys/js-repository";

class JsData {
    dataList: Intv[]
    err: string


    constructor(dataList?: Intv[], err?: string) {
        this.dataList = dataList ?? [];
        this.err = err ?? '';
    }
}

class JsViewModel {
    private data: JsData;
    private repository: JsRepository;

    constructor(data: JsData) {
        this.data = data;
        this.repository = new JsRepository();
    }


    async getIntvqList() {
        this.data.err = '';
        const res = await this.repository.getIntvqList();
        if (res.code === 1) {
            this.data.dataList.length = 0;
            this.data.dataList.push(...(res.data as Array<Intv>));
        } else {
            this.data.err = res.message;
        }
    }
}

export {
    JsViewModel,
    JsData
}