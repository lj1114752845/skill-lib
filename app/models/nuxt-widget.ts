/*
* 作者：李健
* 邮箱：lj2690@163.com
* */


class NuxtWidget {
    static TableName = 'nuxt_widget';

    id: number;
    name: string;
    code: string;
    desc: string;
    createTime: number;
    updateTime: number;


    constructor(id: number, name: string, code: string, desc: string, createTime: number, updateTime: number) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.desc = desc;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }
}

export {
    NuxtWidget
}