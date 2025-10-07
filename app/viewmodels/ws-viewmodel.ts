/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {WsMessage} from "~/models/ws-result";
import {ImSocket} from "~/im/imsocket";

class WsData {
    //ws链接状态
    wsState: boolean;
    //在线用户列表以及聊天记录
    onLineList: Map<string, WsMessage[]>;
    //正在聊天的用户
    selOnLine: string
    //编辑中的消息
    editMsg: string;
    //当前设备链接ID
    id: string;


    constructor(wsState: boolean, onLineList: Map<string, WsMessage[]>, selOnLine: string, editMsg: string, id: string) {
        this.wsState = wsState;
        this.onLineList = onLineList;
        this.selOnLine = selOnLine;
        this.editMsg = editMsg;
        this.id = id;
    }
}

class WsViewModel {

    data: WsData;
    imSocket = new ImSocket();

    constructor(data: WsData) {
        this.data = data;
    }

    sendMsg(err: (str: string) => void) {
        if (this.data.selOnLine === '') {
            err('接收人不能为空');
        } else if (this.data.editMsg === '') {
            err('消息不能为空');
        } else {
            this.imSocket.sendMessage(this.data.selOnLine, this.data.editMsg);
            let msgList = this.data.onLineList.get(this.data.selOnLine);
            msgList?.push(new WsMessage(this.data.id, this.data.selOnLine, this.data.editMsg));
        }
        this.data.editMsg = '';
    }

    disConnWs() {
        this.imSocket.disConnWs();
        this.data.wsState = false;
    }

    connWs(notice: (d: string) => void, err: (e: string) => void) {
        this.imSocket.connWs(this.data.id, {
            open: () => {
                this.data.onLineList.clear();
                this.data.wsState = true;
                notice(`用户：${this.data.id}已连接到服务器`);
            },
            online: (id) => {
                this.data.onLineList.set(id, []);
                notice(`用户：${id}已上线`);
            },
            offline: (id) => {
                this.data.onLineList.delete(id);
                notice(`用户：${id}已下线`);
                if (this.data.selOnLine === id) {
                    this.data.selOnLine = '';
                }
            },
            onlineList: (ids) => {
                for (let id of ids) {
                    this.data.onLineList.set(id, []);
                }
            },
            newMsg: (msg) => {
                if (msg.recipientID !== this.data.id) {
                    err(`WebSocket收到一条不属于当前用户的消息:${JSON.stringify(msg)}`);
                    return;
                }
                if (!this.data.onLineList.has(msg.senderID)) {
                    //可能会出现服务器在线客户端不知道在线的情况处理下
                    this.data.onLineList.set(msg.senderID, []);
                }
                let msgList = this.data.onLineList.get(msg.senderID);
                msgList?.push(msg);
            },
            serverMsg: (msg) => {
                let msgList = this.data.onLineList.get(msg.senderID);
                msgList?.push(msg);
            },
            appError: (m) => {
                err(m);
            },
            wsError: () => {
                this.data.wsState = false;
                this.data.selOnLine = '';
                this.data.onLineList.clear();
                this.imSocket.disConnWs();
            },
            close: () => {
                this.data.wsState = false;
                this.data.selOnLine = '';
                this.data.onLineList.clear();
                this.imSocket.disConnWs();
            }
        });
    }

    checkUser(id: string) {
        this.data.selOnLine = id;
    }

    destroy() {
        this.imSocket.disConnWs();
    }
}

export {
    WsViewModel,
    WsData
}