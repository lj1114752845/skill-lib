/*
* 作者：李健
* 邮箱：lj2690@163.com
* */
import {Http} from "~/repositorys/http";
import {OffLine, OnLine, WsMessage, WsResult} from "~/models/ws-result";

interface WSCall {
    open: () => void;
    appError: (str: string) => void;
    wsError: () => void;
    close: () => void;
    onlineList: (users: string[]) => void;
    online: (id: string) => void;
    offline: (id: string) => void;
    newMsg: (msg: WsMessage) => void;
    serverMsg: (msg: WsMessage) => void;
}

class ImSocket {
    static ServerID = 'server';
    ws: WebSocket | null = null;
    id: string = '';

    sendMessage(recipientID: string, message: string) {
        if (!this.ws) {
            return;
        }
        const str = JSON.stringify(WsResult.newMsg(this.id, recipientID, message));
        this.ws?.send(str);
    }

    disConnWs() {
        this.ws?.close();
        this.ws = null;
    }

    connWs(id: string, call: WSCall) {
        this.id = id;
        this.ws = new WebSocket(`ws://${Http.HOST}:${Http.WS_PORT}?id=${this.id}`);
        this.ws.addEventListener('open', () => {
            call.open();
        });
        this.ws.addEventListener('message', (message) => {
            const serverMsg = JSON.parse(message.data) as WsResult<any>;
            switch (serverMsg.code) {
                case WsResult.ERROR:
                    call.appError(serverMsg.message);
                    break;
                case WsResult.ONLINE_LIST:
                    let ids = serverMsg.data as string[];
                    call.onlineList(ids);
                    break;
                case WsResult.ONLINE:
                    let onLine = (serverMsg.data as OnLine);
                    call.online(onLine.id);
                    break;
                case WsResult.OFFLINE:
                    let offLine = (serverMsg.data as OffLine);
                    call.offline(offLine.id);
                    break;
                case WsResult.NEW_MES:
                    let newMsg = (serverMsg.data as WsMessage);
                    if (newMsg.senderID === ImSocket.ServerID) {
                        call.serverMsg(newMsg);
                    } else {
                        call.newMsg(newMsg);
                    }
                    break;
            }
        });
        this.ws.addEventListener('error', () => {
            call.wsError();
        });
        this.ws.addEventListener('close', () => {
            call.close();
        });
    }
}

export {
    ImSocket
}

export type {
    WSCall
}