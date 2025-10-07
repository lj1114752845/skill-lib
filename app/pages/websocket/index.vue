<!--
 作者：李健
 邮箱：lj2690@163.com
-->
<script setup lang="ts">
import {WsData, WsViewModel} from "~/viewmodels/ws-viewmodel";
import {nextTick, reactive} from "vue";
import type {WsMessage} from "~/models/ws-result";
import {ImSocket} from "~/im/imsocket";

useHead({
  title: 'WebSocket',
  meta: [
    {name: 'description', content: 'WebSocket聊天室'}
  ],
});

const data: WsData = reactive(new WsData(false, new Map<string, WsMessage[]>(), '', '', ''));

const connDialogRef = ref(false);
const connIDErrRef = ref('');
const scrollRef = ref();
const vm = new WsViewModel(data);

function sendMsg() {
  vm.sendMsg((e) => {
    ElMessage.error(e);
  });
  scrollToBottom();
}

function wsEvent() {
  if (data.wsState) {
    vm.disConnWs();
  } else {
    connIDErrRef.value = '';
    connDialogRef.value = true;
  }
}

function wsConn() {
  if (data.id === '') {
    connIDErrRef.value = '唯一标识不能为空！';
    return;
  } else {
    connDialogRef.value = false;
    vm.connWs((d) => {
      ElMessage.success(d);
    }, (err) => {
      ElMessage.error(err);
    });
  }
}

function scrollToBottom() {
  nextTick()
      .then(() => {
        const scrollbar = scrollRef.value;
        if (scrollbar) {
          scrollbar.scrollTo(Number.MAX_SAFE_INTEGER);
        }
      });
}

onUnmounted(() => {
  vm.destroy();
});
</script>

<template>
  <div class="ws-container">
    <el-splitter layout="vertical" style="max-width: 960px">
      <el-splitter-panel min="20%">
        <el-card class="msg-content">
          <template #header>
            <div class="card-header">
              <el-select v-model="data.selOnLine"
                         placeholder="选择聊天用户" style="width: 140px" size="large"
                         @change="(id)=>vm.checkUser(id)">
                <template v-for="id of data.onLineList.keys()">
                  <el-option :label="id === ImSocket.ServerID ? '服务器用户':id" :value="id"/>
                </template>
                <template #empty>
                  请先连接至服务器
                </template>
              </el-select>
              <el-alert class="user-ws-conn" :title="data.wsState ? '断开服务' : '连接服务器'"
                        :type="data.wsState ? 'error':'primary'"
                        :closable="false" @click="wsEvent"/>
            </div>
          </template>
          <div class="msg-scroll-box">
            <el-scrollbar ref="scrollRef">
              <div class="msg-list">
                <template v-if="data.selOnLine !== ''" v-for="item of data.onLineList.get(data.selOnLine)!">
                  <div v-if="item.senderID === data.selOnLine" class="msg-receive">
                    <div class="msg-avatar"><span>{{ Utils.getStartChar(item.senderID) }}</span></div>
                    <div class="msg-body">
                      <div class="msg">
                        <p>{{ item.message }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-else class="msg-send">
                    <div class="msg-body">
                      <div class="msg">
                        <p>{{ item.message }}</p>
                      </div>
                    </div>
                    <div class="msg-avatar"><span>{{ Utils.getStartChar(item.senderID) }}</span></div>
                  </div>
                </template>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-splitter-panel>
      <el-splitter-panel min="20%" size="30%" style="padding: 1px">
        <div class="send-msg-content">
          <el-input v-model="data.editMsg" type="textarea" class="msg-input" placeholder="在这里输入消息"/>
          <el-button @click="sendMsg" type="primary" style="display: inline-block"
                     :disabled="!data.wsState || data.selOnLine === ''">
            发 送
          </el-button>
        </div>
      </el-splitter-panel>
    </el-splitter>
    <el-dialog v-model="connDialogRef" title="连接聊天服务器" width="300">
      <el-form-item :error="connIDErrRef" style="color: var(--el-color-error)">
        <el-input v-model="data.id"></el-input>
      </el-form-item>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="connDialogRef = false">取消</el-button>
          <el-button type="primary" @click="wsConn">连接</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.msg-avatar {
  width: 35px;
  aspect-ratio: 1/1;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  line-height: 14px;
  color: var(--el-text-color-primary);
}

.msg > p {
  white-space: pre-wrap;
}

.msg {
  display: inline-block;
  padding: 10px;
  background-color: var(--el-color-success);
  border-radius: 14px;
}

.msg-body {
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: row;
}

.msg-send > .msg-body {
  justify-content: flex-end;
}

.msg-receive > .msg-body {
  justify-content: flex-start;
}

.msg-receive, .msg-send {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  color: var(--el-text-color-primary);
  font-size: 14px;
  line-height: 24px;
  gap: 12px;
}

.msg-receive {
  justify-content: flex-start;
  width: calc(100% - 80px);
  margin-right: 80px;
}

.msg-send {
  justify-content: flex-end;
  width: calc(100% - 80px);
  margin-left: 80px;
}

.msg-list {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 25px;
}

.msg-scroll-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.msg-content > :deep(.el-card__header) {
  padding: 8px;
}

.msg-content > :deep(.el-card__body) {
  height: 0;
  flex: 1;
}

.msg-content {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.msg-input > :deep(textarea) {
  height: 100% !important;
  box-sizing: border-box;
  resize: none;
  box-shadow: none;
}

.msg-input {
  height: 0;
  flex: 1;
  box-sizing: border-box;
  padding: 10px;
}

.send-msg-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
  align-items: flex-end;
  border: var(--el-border-color) solid 1px;
  box-sizing: border-box;
}

.user-ws-conn {
  width: auto;
  cursor: pointer;
  user-select: none;
}

.ws-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>