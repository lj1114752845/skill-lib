/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
class WsResult<T> {
    //错误
    static ERROR = 0;
    //上线
    static ONLINE = 1;
    //下线
    static OFFLINE = 2;
    //消息
    static NEW_MES = 3;
    //在线列表
    static ONLINE_LIST = 4;


    //0发生错误 1有用户上线 2有用户离线 3有新消息
    code: number;
    data: T;
    message: string;


    constructor(code: number, data: any, message: string) {
        this.code = code;
        this.data = data;
        this.message = message;
    }

    static error(message: string) {
        return new WsResult<string>(WsResult.ERROR, '', message)
    }


    static onLine(data: OnLine) {
        //data存储上线用户ID
        return new WsResult<OnLine>(WsResult.ONLINE, data, '');
    }

    static offLine(data: OffLine) {
        //data存储下线用户ID
        return new WsResult<OffLine>(WsResult.OFFLINE, data, '');
    }

    static onLineList(ids: string[]) {
        return new WsResult<string[]>(WsResult.ONLINE_LIST, ids, '');
    }

    static newMsg(senderID: string, recipientID: string, message: string) {
        return new WsResult<WsMessage>(WsResult.NEW_MES, new WsMessage(senderID, recipientID, message), message);
    }
}

class OnLine {
    id: string;


    constructor(id: string) {
        this.id = id;
    }
}

class OffLine {
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}

class WsMessage {
    senderID: string;
    recipientID: string;
    message: string;

    constructor(senderID: string, recipientID: string, message: string) {
        this.senderID = senderID;
        this.recipientID = recipientID;
        this.message = message;
    }
}

export {
    WsResult,
    OnLine, OffLine, WsMessage
}

