/*
* 作者：李健
* 邮箱：lj2690@163.com
* */

class Intv {
    static TableName = "knowledge_point";
    id: number;
    title: string
    code: string
    result: string
    createTime: number;
    updateTime: number;


    constructor(id: number, title: string, code: string, result: string, createTime: number, updateTime: number) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.result = result;
        this.createTime = createTime;
        this.updateTime = updateTime;
    }
}

export {
    Intv
}