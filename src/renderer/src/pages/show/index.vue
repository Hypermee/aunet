<template>
  <main class="main-wrap">
    <div class="card">
      <span class="title">授权信息</span>
      <div class="content">
        <input :value="userStore.JSESSIONID" type="text" disabled />
        <button type="primary" @click="copyBtn()">点击复制</button>
        <button type="primary" @click="refresh()" title="请求远程连接"><i class="iconfont icon-send" /></button>
      </div>
    </div>
    <div class="card share">
      <span class="title">共享用户<button type="primary" title="从剪贴板导入" @click="toList">导入</button></span>
      <div class="content">
        <table>
          <thead>
          <tr>
            <th>
              授权码
            </th>
            <th>
              用户信息
            </th>
            <th>
              IP地址
            </th>
            <th>
              操作
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in userStore.sharelist" :key="item.JSESSIONID">
            <td>
              {{ state.isEdit && state.editIndex === index ?  '' : item.JSESSIONID ? item.JSESSIONID.slice(0, 10) + '...' : '' }}
              <input v-show="state.isEdit && state.editIndex === index" v-model="state.editValue" style="width: 90px" />
            </td>
            <td>
              {{ item.username }}
            </td>
            <td>
              {{ item.ip }}
            </td>
            <td>
              <a v-if="!state.isEdit || state.editIndex !== index"
                 style="margin-right: 5px"
                 @click="edit(index)"
              >编辑</a>
              <a
                style="margin-right: 5px"
                @click="confirm"
                v-else
              >确定</a>
              <a v-if="!state.isEdit || state.editIndex !== index"
                 @click="remote(index)"
              >上线</a>
              <a v-else @click="remove">移除</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import {defineComponent, reactive} from "vue";
import { useUserStore } from "../../store";
import Message from "../../components/message";


const state = reactive({
  isEdit: true,
  editIndex: -1,
  editValue: '',
})
const clipboard: Clipboard = require('electron').clipboard;
const userStore: ReturnType<typeof useUserStore>[1] = useUserStore();

const copyBtn = () => {
  clipboard.writeText(userStore.JSESSIONID)
  Message({ type: "success", text: "复制成功" });
}

const edit = (index) => {
  state.isEdit = true;
  state.editIndex = index;
  state.editValue = userStore.sharelist[index].JSESSIONID;
}

const remove = () => {
  userStore.sharelist.splice(state.editIndex, 1);
  state.isEdit = false;
  state.editIndex = -1;
  state.editValue = '';
}

const confirm = () => {
  if(state.isEdit && state.editIndex !== -1 && state.editValue.length == 32) {
    userStore.sharelist[state.editIndex].JSESSIONID = state.editValue.toUpperCase();
    state.isEdit = false;
    state.editIndex = -1;
    state.editValue = '';
  }
}

const remote = (index) => {
  let { account = '', password = '', ISP = '0' } = userStore;
  const JSESSIONID = userStore.sharelist[index].JSESSIONID;

  if (
    (account.length < 9 && account.length > 13) &&
    (password.length < 8 && password.length > 20)
  ) return Message({ type: 'error', text: '请先设置正确的一卡通账号' });

  window.electron.ipcRenderer.send('remote-login', {
    ISP,
    account,
    password,
    JSESSIONID
  })

  window.electron.ipcRenderer.once('renderer-remoteLogin', function (e, res) {
    if(res && res[2]) {
      const { ip = '', username = '' } = res[2];

      ip && (userStore.sharelist[index].ip = ip);
      username && (userStore.sharelist[index].username = username);
    }

    if(!res || res[0] === false) return Message({ type: 'error', text: '本地请求失败' });

    Message({ type: res[0] ? 'warn' : 'success', text: res[1] });
  })

}

const toList = async () => {
  const text = await clipboard.readText();

  if(text && text.length == 32) {
    let temp = new Set(userStore.sharelist.map((item) => item.JSESSIONID))

    if(!temp.has(text)) userStore.sharelist.push({
      JSESSIONID: text,
      username: '',
      ip: null,
    })
  }
}

const refresh = () => {
  let { account = '', password = '', JSESSIONID = '' } = userStore;

  if (
    (account.length < 9 && account.length > 13) &&
    (password.length < 8 && password.length > 20) &&
    JSESSIONID != ''
  ) return;

  if(JSESSIONID != '') {
    window.electron.ipcRenderer.once('renderer-refresh', function (e, res) {
      if(res) {
        userStore.userdata = res.userdata;
        userStore.username = res.username;
        userStore.JSESSIONID = res.JSESSIONID;

        Message({ type: "success", text: "已发送远程连接请求" });
      } else {
        let { account = '', password = '', JSESSIONID = '' } = userStore;

        if (
          (account.length < 9 && account.length > 11) &&
          (password.length < 8 && password.length > 20)
        ) return;

        window.electron.ipcRenderer.once('renderer-username', function (e, res) {
          if(res) {
            userStore.userdata = res.userdata;
            userStore.username = res.username;
            userStore.JSESSIONID = res.JSESSIONID;

            Message({ type: "success", text: "已发送远程连接请求" });
          } else {
            userStore.userdata = { };
            userStore.username = '';
            userStore.JSESSIONID = '';

            Message({ type: "success", text: "远程请求发送失败" });
          }
        })

        window.electron.ipcRenderer.send('username', {
          account,
          password,
          JSESSIONID
        })
      }
    })

    window.electron.ipcRenderer.send('refresh-account', JSESSIONID)
  } else {
    window.electron.ipcRenderer.once('renderer-username', function (e, res) {
      if(res) {
        userStore.userdata = res.userdata;
        userStore.username = res.username;
        userStore.JSESSIONID = res.JSESSIONID;
        Message({ type: "success", text: "已发送远程连接请求" });
      } else {
        userStore.userdata = { };
        userStore.username = '';
        userStore.JSESSIONID = '';
        Message({ type: "success", text: "远程请求发送失败" });
      }
    })
    window.electron.ipcRenderer.send('username', {
      account,
      password,
      JSESSIONID
    })
  }
}

defineComponent({
  name: 'show'
})
</script>

<style lang="scss" scoped>
  .card {
    margin-top: 25px;

    &.share>.title {
      display: flex;
      align-items: center;
      justify-content: space-between;

      button {
        width: 40px;
        height: 22px;
        line-height: 22px;
      }
    }

    .title {
      color: #333333;
      font-size: 16px;
      font-weight: 400;
    }

    .content {
      font-size: 14px;
      font-weight: 400;
      margin-top: 10px;

      &>input {
        width: 280px;
        margin-left: 0;
        margin-right: 15px;
        text-align: center;
      }

      .icon-send {
        font-size: 19px;
      }

      button {
        margin-right: 4px;
        text-align: center;
        vertical-align: middle;

        &:nth-of-type(2) {
          width: 10px;
        }
      }

      table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;

        thead {
          tr {
            text-align: center;
            th {
              vertical-align: bottom;
              line-height: 24px;
              overflow: hidden;
              white-space: nowrap;
              border-bottom: 1px solid #ddd;
            }
          }
        }
        tbody {
          tr {
            height: 30px;
            text-align: center;
            td {

              a {
                color: #337ab7;
                cursor: pointer;
                text-decoration: none;
                background-color: transparent;

                &:focus, &:hover {
                  color: #23527c;
                }
              }
            }

            &:nth-of-type(odd) {
              background-color: #f9f9f9;
            }
          }
        }
      }
    }
  }
</style>
